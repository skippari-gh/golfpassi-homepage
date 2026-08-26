import type { Assignment, AuditReport } from './golfpassi'

const END_OVERRIDES = [
  {
    leader: 'Juha-Matti Vuorinen',
    place: 'Rio Real',
    latestEnd: '2026-11-11',
    source: 'https://golfpassi.fi/pelimatkat/espanja/rio-real-golf-hotel-14-vrk-4-11-2026/',
    reason: 'Golfpassin matkasivu kertoo: Juha-Matti Vuorinen 11.11. asti.',
  },
]

function crossDestinationOverlaps(assignments:Assignment[]) {
  const issues:AuditReport['overlaps']=[]
  const byLeader=new Map<string,Assignment[]>()
  for(const item of assignments){
    if(!byLeader.has(item.leader)) byLeader.set(item.leader,[])
    byLeader.get(item.leader)!.push(item)
  }
  for(const [leader,items] of byLeader){
    const sorted=[...items].sort((a,b)=>a.start.localeCompare(b.start))
    for(let i=0;i<sorted.length;i++){
      for(let j=i+1;j<sorted.length;j++){
        if(sorted[j].start>sorted[i].end) break
        if(sorted[i].place===sorted[j].place) continue
        const start=sorted[i].start>sorted[j].start?sorted[i].start:sorted[j].start
        const end=sorted[i].end<sorted[j].end?sorted[i].end:sorted[j].end
        // Sama rajapäivä hyväksytään siirtymäpäiväksi kohteesta toiseen.
        if(start>=end) continue
        issues.push({
          type:'overlap',leader,start,end,tripUrl:sorted[j].tripUrl,
          detail:`Sama vetäjä kahdessa eri kohteessa: ${sorted[i].place} / ${sorted[j].place}`,
        })
      }
    }
  }
  return issues
}

export function normalizeProductionData(assignments:Assignment[],audit:AuditReport){
  const appliedOverrides:Array<{leader:string;place:string;end:string;source:string;reason:string}>=[]
  const normalized=assignments.map(item=>{
    let next={...item}
    for(const override of END_OVERRIDES){
      if(next.leader===override.leader&&next.place===override.place&&next.end>override.latestEnd){
        next={...next,end:override.latestEnd,id:`${next.leader}|${next.place}|${next.start}`}
        appliedOverrides.push({leader:next.leader,place:next.place,end:override.latestEnd,source:override.source,reason:override.reason})
      }
    }
    return next
  }).filter(item=>item.end>=item.start)

  const overlaps=crossDestinationOverlaps(normalized)
  const normalizedAudit={
    ...audit,
    generatedAt:new Date().toISOString(),
    totalAssignments:normalized.length,
    exactLocations:normalized.filter(item=>item.locationAccuracy==='exact').length,
    tripVerified:normalized.filter(item=>item.tripVerified).length,
    overlaps,
    severeCount:audit.unresolvedLocations.length+overlaps.length+audit.duplicates.length+audit.sourceCollisions.length,
    sourceOverrides:appliedOverrides,
  }
  return {assignments:normalized,audit:normalizedAudit}
}

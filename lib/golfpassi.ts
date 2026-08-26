const BASE = 'https://golfpassi.fi'
const LEADERS_URL = `${BASE}/hyva-tietaa/matkanjohtajat/`
const REVALIDATE_SECONDS = 60 * 60 * 6

type ProfileRef = { name: string; profileUrl: string }
type LocationAccuracy = 'exact' | 'country'

type Location = {
  place: string
  country: string
  lat: number
  lon: number
  accuracy: LocationAccuracy
}

export type Assignment = {
  id: string
  leader: string
  place: string
  country: string
  trip: string
  start: string
  end: string
  lat: number
  lon: number
  profile: string
  tripUrl: string
  imageUrl: string | null
  tripVerified: boolean
  tripPageChecked: boolean
  locationAccuracy: LocationAccuracy
}

export type AuditIssue = {
  type: 'location' | 'overlap' | 'long' | 'unverified' | 'duplicate'
  leader?: string
  trip?: string
  place?: string
  country?: string
  start?: string
  end?: string
  detail: string
  tripUrl?: string
}

export type AuditReport = {
  generatedAt: string
  totalAssignments: number
  exactLocations: number
  tripVerified: number
  unresolvedLocations: AuditIssue[]
  overlaps: AuditIssue[]
  longAssignments: AuditIssue[]
  unverifiedAssignments: AuditIssue[]
  duplicates: AuditIssue[]
  severeCount: number
  warningCount: number
}

const exact = (place:string,country:string,lat:number,lon:number):Location => ({place,country,lat,lon,accuracy:'exact'})

const locationRules: Array<{ pattern: RegExp; value: Location }> = [
  { pattern: /costa navarino|westin costa|w costa/i, value: exact('Costa Navarino','Kreikka',36.96,21.70) },
  { pattern: /rio real/i, value: exact('Rio Real','Espanja',36.52,-4.84) },
  { pattern: /fairplay|benalup/i, value: exact('Fairplay','Espanja',36.34,-5.81) },
  { pattern: /la sella|denia marriott/i, value: exact('La Sella','Espanja',38.80,0.07) },
  { pattern: /montecastillo/i, value: exact('Montecastillo','Espanja',36.71,-6.03) },
  { pattern: /mar menor/i, value: exact('Mar Menor','Espanja',37.74,-0.91) },
  { pattern: /el rompido/i, value: exact('El Rompido','Espanja',37.22,-7.12) },
  { pattern: /infinitum|blaumar/i, value: exact('Infinitum','Espanja',41.08,1.16) },
  { pattern: /calahonda|doña lola|dona lola/i, value: exact('Calahonda','Espanja',36.49,-4.71) },
  { pattern: /san roque/i, value: exact('San Roque','Espanja',36.21,-5.38) },
  { pattern: /la finca/i, value: exact('La Finca','Espanja',38.06,-0.80) },
  { pattern: /tecina|la gomera/i, value: exact('La Gomera','Espanja',28.03,-17.21) },
  { pattern: /elba estepona|estepona/i, value: exact('Estepona','Espanja',36.43,-5.15) },
  { pattern: /inmood|sotogrande/i, value: exact('Sotogrande','Espanja',36.29,-5.28) },
  { pattern: /isla canela/i, value: exact('Isla Canela','Espanja',37.18,-7.38) },
  { pattern: /mijas|la cala/i, value: exact('Mijas','Espanja',36.54,-4.69) },
  { pattern: /alcaidesa/i, value: exact('La Alcaidesa','Espanja',36.24,-5.31) },
  { pattern: /almerimar/i, value: exact('Almerimar','Espanja',36.70,-2.79) },
  { pattern: /alicante|bonalba/i, value: exact('Alicante','Espanja',38.45,-0.43) },
  { pattern: /murcia|hacienda del alamo/i, value: exact('Murcia','Espanja',37.76,-1.15) },
  { pattern: /aroeira/i, value: exact('Aroeira','Portugali',38.58,-9.19) },
  { pattern: /camporeal/i, value: exact('CampoReal','Portugali',39.04,-9.24) },
  { pattern: /cascais|quinta da marinha/i, value: exact('Cascais','Portugali',38.70,-9.42) },
  { pattern: /obidos|praia d'el rey|praia del rey|royal obidos/i, value: exact('Óbidos','Portugali',39.36,-9.22) },
  { pattern: /algarve|vilamoura|dom pedro/i, value: exact('Vilamoura','Portugali',37.09,-8.12) },
  { pattern: /belek|sirene|titanic deluxe|sueno/i, value: exact('Belek','Turkki',36.86,31.05) },
  { pattern: /marrakech|tikida palmeraie/i, value: exact('Marrakech','Marokko',31.63,-8.00) },
  { pattern: /agadir/i, value: exact('Agadir','Marokko',30.42,-9.60) },
  { pattern: /tamarina|mauritius/i, value: exact('Mauritius','Mauritius',-20.28,57.38) },
  { pattern: /hua hin/i, value: exact('Hua Hin','Thaimaa',12.57,99.96) },
  { pattern: /bangkok/i, value: exact('Bangkok','Thaimaa',13.76,100.50) },
  { pattern: /ho tram/i, value: exact('Ho Tram','Vietnam',10.47,107.37) },
  { pattern: /wafaifo|hoi an/i, value: exact('Hoi An','Vietnam',15.88,108.34) },
  { pattern: /nusa dua|handara|bali|merusaka/i, value: exact('Bali','Indonesia',-8.55,115.17) },
  { pattern: /st andrews/i, value: exact('St Andrews','Skotlanti',56.34,-2.80) },
  { pattern: /pirin golf/i, value: exact('Pirin Golf','Bulgaria',41.83,23.48) },
  { pattern: /le national|pariis|paris/i, value: exact('Le National, Pariisi','Ranska',48.75,2.08) },
  { pattern: /somabay|soma bay|hurghada/i, value: exact('Somabay','Egypti',26.85,33.99) },
  { pattern: /korineum|pohjois-kypros/i, value: exact('Korineum','Pohjois-Kypros',35.34,33.57) },
  { pattern: /aphrodite hills|pafos|paphos/i, value: exact('Pafos','Kypros',34.75,32.49) },
  { pattern: /bogogno/i, value: exact('Bogogno','Italia',45.66,8.53) },
  { pattern: /garda|lake garda/i, value: exact('Gardajärvi','Italia',45.57,10.55) },
  { pattern: /konopiste|konopiště/i, value: exact('Konopiště','Tšekki',49.78,14.65) },
  { pattern: /beckenbauer|penning|bad griesbach|porsche golf/i, value: exact('Bad Griesbach','Saksa',48.45,13.19) },
  { pattern: /estonian golf|sea course|tallinn/i, value: exact('Tallinna','Viro',59.44,24.75) },
  { pattern: /visby/i, value: exact('Visby','Ruotsi',57.63,18.29) },
  { pattern: /kungsängen|bro hof/i, value: exact('Tukholma','Ruotsi',59.45,17.65) },
]

const countryCenters: Record<string,{lat:number;lon:number}> = {
  Espanja:{lat:40.1,lon:-3.7}, Portugali:{lat:39.5,lon:-8.0}, Kreikka:{lat:39.0,lon:22.0},
  Turkki:{lat:39.0,lon:35.0}, Marokko:{lat:31.8,lon:-7.1}, Mauritius:{lat:-20.2,lon:57.5},
  Thaimaa:{lat:15.8,lon:100.9}, Vietnam:{lat:16.0,lon:107.8}, Indonesia:{lat:-2.5,lon:118.0},
  Skotlanti:{lat:56.5,lon:-4.2}, Bulgaria:{lat:42.7,lon:25.5}, Ranska:{lat:46.2,lon:2.2},
  Italia:{lat:42.8,lon:12.8}, Egypti:{lat:26.8,lon:30.8}, 'Pohjois-Kypros':{lat:35.3,lon:33.4},
  Tšekki:{lat:49.8,lon:15.5}, Kypros:{lat:35.1,lon:33.4}, Saksa:{lat:51.2,lon:10.5},
  Ruotsi:{lat:62.0,lon:15.0}, Suomi:{lat:64.0,lon:26.0}, Viro:{lat:58.6,lon:25.0},
}

function decodeHtml(value:string) {
  return value
    .replace(/&nbsp;|&#160;/gi,' ')
    .replace(/&amp;/gi,'&')
    .replace(/&quot;/gi,'"')
    .replace(/&#039;|&apos;/gi,"'")
    .replace(/&ndash;|&#8211;/gi,'–')
    .replace(/&mdash;|&#8212;/gi,'—')
    .replace(/&auml;/gi,'ä').replace(/&ouml;/gi,'ö').replace(/&aring;/gi,'å')
    .replace(/&Auml;/g,'Ä').replace(/&Ouml;/g,'Ö').replace(/&Aring;/g,'Å')
    .replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n)))
}

function cleanText(value:string) {
  return decodeHtml(value.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' '))
    .replace(/\s+/g,' ').trim()
}

function absoluteUrl(value:string, base:string) {
  if (!value) return null
  try { return new URL(decodeHtml(value),base).toString() } catch { return null }
}

async function fetchHtml(url:string) {
  const response = await fetch(url,{
    headers:{'user-agent':'Golfpassi-Maailmalla/1.0','accept':'text/html,application/xhtml+xml'},
    next:{revalidate:REVALIDATE_SECONDS},
    signal:AbortSignal.timeout(15000),
  })
  if (!response.ok) throw new Error(`Golfpassi ${response.status}: ${url}`)
  return response.text()
}

function extractAnchors(html:string) {
  const out:Array<{href:string; html:string; text:string; index:number}> = []
  const re=/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi
  let match:RegExpExecArray|null
  while ((match=re.exec(html))) out.push({href:match[1],html:match[2],text:cleanText(match[2]),index:match.index})
  return out
}

function extractProfiles(indexHtml:string):ProfileRef[] {
  const map=new Map<string,ProfileRef>()
  for (const a of extractAnchors(indexHtml)) {
    if (!/\/hyva-tietaa\/matkanjohtajat\/[^/?#]+\/?(?:[?#].*)?$/i.test(a.href)) continue
    const profileUrl=absoluteUrl(a.href,LEADERS_URL)
    if (!profileUrl || profileUrl.replace(/\/$/,'')===LEADERS_URL.replace(/\/$/,'')) continue
    const name=a.text.replace(/^Pro\s+/i,'').replace(/\s+/g,' ').trim()
    if (name.length<3 || name.length>70 || /matkanjohtajat|lue lisää/i.test(name)) continue
    map.set(profileUrl,{name,profileUrl})
  }
  return [...map.values()]
}

function chooseSrcFromTag(tag:string, base:string) {
  for (const attr of ['data-lazy-src','data-src','src']) {
    const m=tag.match(new RegExp(`${attr}=["']([^"']+)["']`,'i'))
    const u=m && absoluteUrl(m[1],base)
    if (u && !u.startsWith('data:')) return u
  }
  const srcset=tag.match(/srcset=["']([^"']+)["']/i)?.[1]
  if (srcset) {
    const entries=srcset.split(',').map(v=>v.trim().split(/\s+/)).filter(v=>v[0])
    const best=entries.sort((a,b)=>(parseInt(b[1]||'0')||0)-(parseInt(a[1]||'0')||0))[0]
    if (best) return absoluteUrl(best[0],base)
  }
  return null
}

function extractProfileImage(html:string, profile:ProfileRef) {
  const nameParts=profile.name.toLowerCase().split(/\s+/).filter(Boolean)
  const headingRe=/<h[1-3]\b[^>]*>([\s\S]*?)<\/h[1-3]>/gi
  let start=0, m:RegExpExecArray|null
  while ((m=headingRe.exec(html))) {
    const txt=cleanText(m[1]).toLowerCase()
    if (nameParts.some(p=>p.length>3 && txt.includes(p))) { start=m.index; break }
  }
  const mukanaIndex=html.toLowerCase().indexOf('mukana matkoilla',start)
  const end=mukanaIndex>start?mukanaIndex:Math.min(html.length,start+30000)
  const segment=html.slice(start,end)
  const candidates:Array<{url:string;score:number}> = []
  const imgRe=/<img\b[^>]*>/gi
  while ((m=imgRe.exec(segment))) {
    const tag=m[0]
    const url=chooseSrcFromTag(tag,profile.profileUrl)
    if (!url) continue
    const hay=decodeHtml(tag).toLowerCase()
    let score=0
    if (/wp-content\/uploads/i.test(url)) score+=6
    if (nameParts.some(p=>p.length>3 && hay.includes(p))) score+=10
    if (/portrait|profile|person|matkanjoht|pro-/i.test(hay)) score+=5
    if (/logo|icon|spinner|placeholder|payment|flag|golfpassi-logo/i.test(`${url} ${hay}`)) score-=30
    if (/\.svg(?:\?|$)/i.test(url)) score-=10
    const w=Number(tag.match(/width=["']?(\d+)/i)?.[1]||0)
    const h=Number(tag.match(/height=["']?(\d+)/i)?.[1]||0)
    if (w>=200 || h>=200) score+=2
    if (w&&h&&Math.abs(w-h)<Math.max(w,h)*0.45) score+=2
    candidates.push({url,score})
  }
  candidates.sort((a,b)=>b.score-a.score)
  return candidates[0] && candidates[0].score>=5 ? candidates[0].url : null
}

function iso(day:number,month:number,year:number) {
  const d=new Date(Date.UTC(year,month-1,day))
  if (d.getUTCFullYear()!==year||d.getUTCMonth()!==month-1||d.getUTCDate()!==day) return null
  return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`
}

type DateHit = { start:string; end:string; index:number; length:number }

function extractDateHits(textValue:string):DateHit[] {
  const text=decodeHtml(textValue).replace(/\.\.\.+/g,'–').replace(/\s+/g,' ')
  const hits:DateHit[]=[]
  const patterns = [
    /(\d{1,2})\.(\d{1,2})\.(\d{4})\s*[–—-]\s*(\d{1,2})\.(\d{1,2})\.(\d{4})/g,
    /(\d{1,2})\.(\d{1,2})\.\s*[–—-]\s*(\d{1,2})\.(\d{1,2})\.(\d{4})/g,
    /(\d{1,2})\.\s*[–—-]\s*(\d{1,2})\.(\d{1,2})\.(\d{4})/g,
  ]
  patterns.forEach((re,patternIndex)=>{
    let m:RegExpExecArray|null
    while ((m=re.exec(text))) {
      let start:string|null=null,end:string|null=null
      if (patternIndex===0) {
        start=iso(+m[1],+m[2],+m[3]); end=iso(+m[4],+m[5],+m[6])
      } else if (patternIndex===1) {
        const endYear=+m[5], startMonth=+m[2], endMonth=+m[4]
        start=iso(+m[1],startMonth,startMonth>endMonth?endYear-1:endYear); end=iso(+m[3],endMonth,endYear)
      } else {
        start=iso(+m[1],+m[3],+m[4]); end=iso(+m[2],+m[3],+m[4])
      }
      if (start&&end&&end>=start) hits.push({start,end,index:m.index,length:m[0].length})
    }
  })
  const unique=new Map<string,DateHit>()
  for (const hit of hits) unique.set(`${hit.start}|${hit.end}|${hit.index}`,hit)
  return [...unique.values()].sort((a,b)=>a.index-b.index)
}

function dateRange(textValue:string) {
  const hit=extractDateHits(textValue)[0]
  return hit ? {start:hit.start,end:hit.end} : null
}

function countryFrom(text:string,url:string) {
  const hay=`${text} ${url}`
  const pairs:Array<[RegExp,string]> = [
    [/espanja|\/espanja\//i,'Espanja'],[/portugali|\/portugali\//i,'Portugali'],[/kreikka|\/kreikka\//i,'Kreikka'],
    [/turkki|\/turkki\//i,'Turkki'],[/marokko|\/marokko\//i,'Marokko'],[/mauritius/i,'Mauritius'],
    [/thaimaa/i,'Thaimaa'],[/vietnam/i,'Vietnam'],[/indonesia|bali/i,'Indonesia'],[/skotlanti|scotland/i,'Skotlanti'],
    [/bulgaria/i,'Bulgaria'],[/ranska|paris|pariisi/i,'Ranska'],[/italia/i,'Italia'],[/egypti|hurghada/i,'Egypti'],
    [/pohjois-kypros/i,'Pohjois-Kypros'],[/kypros/i,'Kypros'],[/tšekki|tsekki/i,'Tšekki'],[/saksa/i,'Saksa'],
    [/ruotsi/i,'Ruotsi'],[/suomi/i,'Suomi'],[/viro/i,'Viro']
  ]
  return pairs.find(([re])=>re.test(hay))?.[1]||'Tuntematon'
}

function resolveLocation(text:string,url:string):Location|null {
  const hay=`${text} ${url}`
  const found=locationRules.find(r=>r.pattern.test(hay))
  if (found) return found.value
  const country=countryFrom(text,url)
  const center=countryCenters[country]
  if (!center) return null
  return {place:country,country,lat:center.lat,lon:center.lon,accuracy:'country'}
}

function titleFromAnchor(text:string,url:string) {
  let t=text.replace(/alk\.\s*[\d\s.,]+€.*$/i,' ').replace(/\d{1,2}\.\d{1,2}\.?(?:\d{4})?\s*[–—-].*$/,' ').replace(/\s+/g,' ').trim()
  if (t.length>=4) return t.slice(0,140)
  try { return decodeURIComponent(new URL(url).pathname.split('/').filter(Boolean).pop()||'Golfpassin matka').replace(/-/g,' ') } catch { return 'Golfpassin matka' }
}

function pageTitle(html:string,url:string) {
  const h1=html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]
  const title=h1?cleanText(h1):''
  return title || titleFromAnchor('',url)
}

function extractTrips(profileHtml:string,profile:ProfileRef,imageUrl:string|null):Assignment[] {
  const sectionIndex=profileHtml.toLowerCase().indexOf('mukana matkoilla')
  const html=sectionIndex>=0?profileHtml.slice(sectionIndex):profileHtml
  const anchors=extractAnchors(html)
  const byUrl=new Map<string,Assignment>()
  for (const a of anchors) {
    if (!/(\/pelimatkat\/|\/kurssimatkat\/)/i.test(a.href)) continue
    const tripUrl=absoluteUrl(a.href,profile.profileUrl)
    if (!tripUrl) continue
    const near=cleanText(html.slice(Math.max(0,a.index-250),Math.min(html.length,a.index+a.html.length+850)))
    const range=dateRange(a.text)||dateRange(near)
    if (!range?.start||!range?.end) continue
    const location=resolveLocation(`${a.text} ${near}`,tripUrl)
    if (!location) continue
    const trip=titleFromAnchor(a.text,tripUrl)
    const candidate:Assignment={
      id:`${profile.name}|${tripUrl}|${range.start}|${range.end}`,
      leader:profile.name,place:location.place,country:location.country,trip,
      start:range.start,end:range.end,lat:location.lat,lon:location.lon,
      profile:profile.profileUrl,tripUrl,imageUrl,tripVerified:false,tripPageChecked:false,
      locationAccuracy:location.accuracy,
    }
    const previous=byUrl.get(tripUrl)
    if (!previous || candidate.start<previous.start) byUrl.set(tripUrl,candidate)
  }
  return [...byUrl.values()]
}

async function mapLimit<T,R>(items:T[],limit:number,worker:(item:T)=>Promise<R>):Promise<R[]> {
  const results=new Array<R>(items.length)
  let cursor=0
  async function run(){ while(true){ const i=cursor++; if(i>=items.length)return; results[i]=await worker(items[i]) } }
  await Promise.all(Array.from({length:Math.min(limit,items.length)},run))
  return results
}

function daysBetween(start:string,end:string) {
  return Math.round((Date.parse(`${end}T00:00:00Z`)-Date.parse(`${start}T00:00:00Z`))/86400000)
}

function leaderVariants(name:string) {
  const parts=name.toLowerCase().split(/\s+/).filter(Boolean)
  const surname=parts[parts.length-1]||''
  const variants=new Set<string>([name.toLowerCase(),surname])
  if (surname.endsWith('nen')) variants.add(`${surname.slice(0,-3)}sen`)
  if (surname.endsWith('e')) variants.add(`${surname}n`)
  if (surname.endsWith('o')||surname.endsWith('a')||surname.endsWith('ä')) variants.add(`${surname}n`)
  return [...variants].filter(v=>v.length>=4)
}

function verifyRangeFromTripPage(bodyText:string,assignment:Assignment) {
  const lower=bodyText.toLowerCase()
  const variants=leaderVariants(assignment.leader)
  const mentions:Array<{index:number;variant:string}>=[]
  for (const variant of variants) {
    let pos=lower.indexOf(variant)
    while (pos>=0) {
      mentions.push({index:pos,variant})
      pos=lower.indexOf(variant,pos+variant.length)
    }
  }
  if (!mentions.length) return {verified:false,start:assignment.start,end:assignment.end}

  let best:{start:string;end:string;score:number}|null=null
  for (const mention of mentions) {
    const from=Math.max(0,mention.index-260)
    const to=Math.min(bodyText.length,mention.index+mention.variant.length+360)
    const snippet=bodyText.slice(from,to)
    const relativeMention=mention.index-from
    for (const hit of extractDateHits(snippet)) {
      if (hit.start<assignment.start || hit.end>assignment.end) continue
      const midpoint=hit.index+hit.length/2
      const distance=Math.abs(midpoint-relativeMention)
      const duration=daysBetween(hit.start,hit.end)
      const score=distance+(duration*0.25)
      if (!best||score<best.score) best={start:hit.start,end:hit.end,score}
    }
  }
  return best ? {verified:true,start:best.start,end:best.end} : {verified:true,start:assignment.start,end:assignment.end}
}

async function enrichFromTripPages(assignments:Assignment[]) {
  const urls=[...new Set(assignments.map(a=>a.tripUrl))]
  const pages=await mapLimit(urls,10,async url=>{
    try { return [url,await fetchHtml(url)] as const }
    catch (error) { console.warn('Golfpassi trip sync failed',url,error); return [url,null] as const }
  })
  const pageMap=new Map<string,string|null>(pages)
  return assignments.map(assignment=>{
    const html=pageMap.get(assignment.tripUrl)
    if (!html) return assignment
    const title=pageTitle(html,assignment.tripUrl)
    const body=cleanText(html)
    const verification=verifyRangeFromTripPage(body,assignment)
    const pageLocation=resolveLocation(`${title} ${body.slice(0,5000)}`,assignment.tripUrl)
    const location=pageLocation || {
      place:assignment.place,country:assignment.country,lat:assignment.lat,lon:assignment.lon,accuracy:assignment.locationAccuracy,
    }
    return {
      ...assignment,
      trip:title||assignment.trip,
      start:verification.start,
      end:verification.end,
      tripVerified:verification.verified,
      tripPageChecked:true,
      place:location.place,country:location.country,lat:location.lat,lon:location.lon,
      locationAccuracy:location.accuracy,
      id:`${assignment.leader}|${assignment.tripUrl}|${verification.start}|${verification.end}`,
    }
  })
}

function dayAfter(value:string) {
  const d=new Date(`${value}T00:00:00Z`); d.setUTCDate(d.getUTCDate()+1); return d.toISOString().slice(0,10)
}

function mergeAssignments(items:Assignment[]) {
  const groups=new Map<string,Assignment[]>()
  for (const a of items) {
    const key=`${a.leader}|${a.place}`
    if (!groups.has(key)) groups.set(key,[])
    groups.get(key)!.push(a)
  }
  const merged:Assignment[]=[]
  for (const group of groups.values()) {
    group.sort((a,b)=>a.start.localeCompare(b.start)||a.end.localeCompare(b.end))
    let last:Assignment|null=null
    for (const item of group) {
      if (last && item.start<=dayAfter(last.end)) {
        if (item.end>last.end) last.end=item.end
        if (!last.imageUrl&&item.imageUrl) last.imageUrl=item.imageUrl
        last.tripVerified=last.tripVerified||item.tripVerified
        last.tripPageChecked=last.tripPageChecked||item.tripPageChecked
        if (last.locationAccuracy==='country'&&item.locationAccuracy==='exact') {
          last.locationAccuracy='exact'; last.lat=item.lat; last.lon=item.lon; last.place=item.place; last.country=item.country
        }
        continue
      }
      last={...item,id:`${item.leader}|${item.place}|${item.start}`}
      merged.push(last)
    }
  }
  return merged.sort((a,b)=>a.start.localeCompare(b.start)||a.leader.localeCompare(b.leader,'fi'))
}

function overlaps(a:Assignment,b:Assignment) {
  return a.start<=b.end && b.start<=a.end
}

function auditAssignments(assignments:Assignment[]):AuditReport {
  const unresolvedLocations:AuditIssue[]=[]
  const overlapIssues:AuditIssue[]=[]
  const longAssignments:AuditIssue[]=[]
  const unverifiedAssignments:AuditIssue[]=[]
  const duplicates:AuditIssue[]=[]
  const exactKeys=new Set<string>()

  for (const a of assignments) {
    if (a.locationAccuracy!=='exact') unresolvedLocations.push({
      type:'location',leader:a.leader,trip:a.trip,place:a.place,country:a.country,start:a.start,end:a.end,tripUrl:a.tripUrl,
      detail:`Kohde käyttää maan keskipistettä: ${a.place}`,
    })
    if (!a.tripVerified) unverifiedAssignments.push({
      type:'unverified',leader:a.leader,trip:a.trip,place:a.place,start:a.start,end:a.end,tripUrl:a.tripUrl,
      detail:a.tripPageChecked?'Vetäjän nimeä ei löytynyt matkasivulta':'Matkasivua ei saatu tarkistettua',
    })
    if (daysBetween(a.start,a.end)>45) longAssignments.push({
      type:'long',leader:a.leader,trip:a.trip,place:a.place,start:a.start,end:a.end,tripUrl:a.tripUrl,
      detail:`Poikkeuksellisen pitkä vetäjäjakso (${daysBetween(a.start,a.end)+1} päivää)`,
    })
    const key=`${a.leader}|${a.place}|${a.start}|${a.end}|${a.tripUrl}`
    if (exactKeys.has(key)) duplicates.push({type:'duplicate',leader:a.leader,trip:a.trip,place:a.place,start:a.start,end:a.end,tripUrl:a.tripUrl,detail:'Täsmälleen sama jakso esiintyy useammin kuin kerran'})
    exactKeys.add(key)
  }

  const byLeader=new Map<string,Assignment[]>()
  for (const a of assignments) {
    if (!byLeader.has(a.leader)) byLeader.set(a.leader,[])
    byLeader.get(a.leader)!.push(a)
  }
  for (const [leader,items] of byLeader) {
    const sorted=[...items].sort((a,b)=>a.start.localeCompare(b.start))
    for (let i=0;i<sorted.length;i++) {
      for (let j=i+1;j<sorted.length;j++) {
        if (sorted[j].start>sorted[i].end) break
        if (!overlaps(sorted[i],sorted[j])) continue
        if (sorted[i].place===sorted[j].place) continue
        overlapIssues.push({
          type:'overlap',leader,start:sorted[j].start,end:sorted[i].end<sorted[j].end?sorted[i].end:sorted[j].end,
          detail:`Sama vetäjä kahdessa eri kohteessa: ${sorted[i].place} / ${sorted[j].place}`,
          tripUrl:sorted[j].tripUrl,
        })
      }
    }
  }

  return {
    generatedAt:new Date().toISOString(),
    totalAssignments:assignments.length,
    exactLocations:assignments.filter(a=>a.locationAccuracy==='exact').length,
    tripVerified:assignments.filter(a=>a.tripVerified).length,
    unresolvedLocations,
    overlaps:overlapIssues,
    longAssignments,
    unverifiedAssignments,
    duplicates,
    severeCount:unresolvedLocations.length+overlapIssues.length+duplicates.length,
    warningCount:longAssignments.length+unverifiedAssignments.length,
  }
}

export async function getGolfpassiData() {
  const indexHtml=await fetchHtml(LEADERS_URL)
  const profiles=extractProfiles(indexHtml)
  if (!profiles.length) throw new Error('Matkanjohtajaprofiileja ei löytynyt')

  const profileBatches=await mapLimit(profiles,8,async profile=>{
    try {
      const html=await fetchHtml(profile.profileUrl)
      const imageUrl=extractProfileImage(html,profile)
      return extractTrips(html,profile,imageUrl)
    } catch (error) {
      console.warn('Golfpassi profile sync failed',profile.profileUrl,error)
      return [] as Assignment[]
    }
  })

  const candidates=profileBatches.flat()
  const today=new Date().toISOString().slice(0,10)
  const horizon=new Date(); horizon.setUTCDate(horizon.getUTCDate()+620)
  const horizonIso=horizon.toISOString().slice(0,10)
  const relevant=candidates.filter(a=>a.end>=today && a.start<=horizonIso)
  const enriched=await enrichFromTripPages(relevant)
  const assignments=mergeAssignments(enriched).filter(a=>a.end>=today && a.start<=horizonIso)
  const audit=auditAssignments(assignments)
  return {assignments,audit}
}

export async function getGolfpassiAssignments() {
  return (await getGolfpassiData()).assignments
}

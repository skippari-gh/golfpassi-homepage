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
  type: 'location' | 'overlap' | 'long' | 'unverified' | 'duplicate' | 'source'
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
  sourceCollisions: AuditIssue[]
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
  { pattern: /costa ballena/i, value: exact('Costa Ballena','Espanja',36.674429,-6.407432) },
  { pattern: /lopesan.*costa meloneras|costa meloneras|meloneras resort/i, value: exact('Meloneras, Gran Canaria','Espanja',27.73806,-15.59997) },
  { pattern: /elba sara|fuerteventura golf|caleta de fuste/i, value: exact('Caleta de Fuste, Fuerteventura','Espanja',28.383935,-13.865906) },
  { pattern: /aroeira/i, value: exact('Aroeira','Portugali',38.58,-9.19) },
  { pattern: /camporeal/i, value: exact('CampoReal','Portugali',39.04,-9.24) },
  { pattern: /cascais|quinta da marinha/i, value: exact('Cascais','Portugali',38.70,-9.42) },
  { pattern: /obidos|óbidos|praia d'el rey|praia del rey|royal obidos/i, value: exact('Óbidos','Portugali',39.36,-9.22) },
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
  { pattern: /albarella/i, value: exact('Albarella','Italia',45.074,12.3482) },
  { pattern: /sheraton.*parco|parco de.? medici/i, value: exact('Rooma – Parco de’ Medici','Italia',41.817033,12.40611) },
  { pattern: /akasha|crete golf|kreeta|hersonissos/i, value: exact('Kreeta','Kreikka',35.29056,25.35933) },
  { pattern: /bogogno/i, value: exact('Bogogno','Italia',45.66,8.53) },
  { pattern: /garda|lake garda/i, value: exact('Gardajärvi','Italia',45.57,10.55) },
  { pattern: /konopiste|konopiště/i, value: exact('Konopiště','Tšekki',49.78,14.65) },
  { pattern: /octoberfest|oktoberfest|quellness|baijeri|beckenbauer|penning|bad griesbach|porsche golf/i, value: exact('Bad Griesbach','Saksa',48.45,13.19) },
  { pattern: /otepaa|otepää|supergolf viro/i, value: exact('Otepää','Viro',58.06,26.50) },
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

function normalized(value:string) {
  return cleanText(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/^pro\s+/,'').replace(/[^a-z0-9]+/g,' ').trim()
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
  for (const anchor of extractAnchors(indexHtml)) {
    if (!/\/hyva-tietaa\/matkanjohtajat\/[^/?#]+\/?(?:[?#].*)?$/i.test(anchor.href)) continue
    const profileUrl=absoluteUrl(anchor.href,LEADERS_URL)
    if (!profileUrl || profileUrl.replace(/\/$/,'')===LEADERS_URL.replace(/\/$/,'')) continue
    const name=anchor.text.replace(/^Pro\s+/i,'').replace(/\s+/g,' ').trim()
    if (name.length<3 || name.length>70 || /matkanjohtajat|lue lisää/i.test(name)) continue
    map.set(profileUrl,{name,profileUrl})
  }
  return [...map.values()]
}

function findProfileHeadingEnd(html:string,profile:ProfileRef) {
  const target=normalized(profile.name)
  const targetParts=target.split(' ').filter(part=>part.length>=3)
  const re=/<h[1-4]\b[^>]*>([\s\S]*?)<\/h[1-4]>/gi
  let match:RegExpExecArray|null
  let best:{end:number;score:number}|null=null
  while ((match=re.exec(html))) {
    const text=normalized(match[1])
    if (!text) continue
    let score=0
    if (text===target) score=100
    else if (text.includes(target)) score=85
    else if (targetParts.length>=2 && targetParts.every(part=>text.includes(part))) score=70
    else continue
    if (text.length>target.length+35) score-=15
    if (!best || score>best.score || (score===best.score && re.lastIndex>best.end)) best={end:re.lastIndex,score}
  }
  return best?.end ?? -1
}

function profileTripsSection(html:string,profile:ProfileRef) {
  const headingEnd=findProfileHeadingEnd(html,profile)
  if (headingEnd<0) return ''
  const lower=html.toLowerCase()
  const sectionStart=lower.indexOf('mukana matkoilla',headingEnd)
  if (sectionStart<0) return ''
  const possibleEnds=[lower.indexOf('</main>',sectionStart),lower.indexOf('<footer',sectionStart),lower.indexOf('site-footer',sectionStart),sectionStart+70000].filter(index=>index>sectionStart)
  const sectionEnd=Math.min(...possibleEnds,html.length)
  return html.slice(sectionStart,sectionEnd)
}

function iso(day:number,month:number,year:number) {
  const date=new Date(Date.UTC(year,month-1,day))
  if (date.getUTCFullYear()!==year||date.getUTCMonth()!==month-1||date.getUTCDate()!==day) return null
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
    let match:RegExpExecArray|null
    while ((match=re.exec(text))) {
      let start:string|null=null,end:string|null=null
      if (patternIndex===0) {
        start=iso(+match[1],+match[2],+match[3]); end=iso(+match[4],+match[5],+match[6])
      } else if (patternIndex===1) {
        const endYear=+match[5], startMonth=+match[2], endMonth=+match[4]
        start=iso(+match[1],startMonth,startMonth>endMonth?endYear-1:endYear); end=iso(+match[3],endMonth,endYear)
      } else {
        start=iso(+match[1],+match[3],+match[4]); end=iso(+match[2],+match[3],+match[4])
      }
      if (start&&end&&end>=start) hits.push({start,end,index:match.index,length:match[0].length})
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
    [/kanariansaaret|gran canaria|fuerteventura/i,'Espanja'],[/espanja|\/espanja\//i,'Espanja'],[/portugali|\/portugali\//i,'Portugali'],[/kreikka|\/kreikka\//i,'Kreikka'],
    [/turkki|\/turkki\//i,'Turkki'],[/marokko|\/marokko\//i,'Marokko'],[/mauritius/i,'Mauritius'],[/thaimaa/i,'Thaimaa'],
    [/vietnam/i,'Vietnam'],[/indonesia|bali/i,'Indonesia'],[/skotlanti|scotland/i,'Skotlanti'],[/bulgaria/i,'Bulgaria'],
    [/ranska|paris|pariisi/i,'Ranska'],[/italia/i,'Italia'],[/egypti|hurghada/i,'Egypti'],[/pohjois-kypros/i,'Pohjois-Kypros'],
    [/kypros/i,'Kypros'],[/tšekki|tsekki/i,'Tšekki'],[/saksa|baijeri/i,'Saksa'],[/ruotsi/i,'Ruotsi'],[/suomi/i,'Suomi'],[/viro|otepaa|otepää/i,'Viro']
  ]
  return pairs.find(([re])=>re.test(hay))?.[1]||'Tuntematon'
}

function resolveLocation(primary:string,url:string,secondary=''):Location|null {
  const primaryHay=`${primary} ${url}`
  const primaryExact=locationRules.find(rule=>rule.pattern.test(primaryHay))
  if (primaryExact) return primaryExact.value
  if (secondary) {
    const secondaryExact=locationRules.find(rule=>rule.pattern.test(secondary))
    if (secondaryExact) return secondaryExact.value
  }
  const country=countryFrom(`${primary} ${secondary}`,url)
  const center=countryCenters[country]
  if (!center) return null
  return {place:country,country,lat:center.lat,lon:center.lon,accuracy:'country'}
}

function titleFromAnchor(text:string,url:string) {
  const cleaned=text.replace(/alk\.\s*[\d\s.,]+€.*$/i,' ').replace(/\s+/g,' ').trim()
  if (cleaned.length>=4) return cleaned.slice(0,140)
  try { return decodeURIComponent(new URL(url).pathname.split('/').filter(Boolean).pop()||'Golfpassin matka').replace(/-/g,' ') } catch { return 'Golfpassin matka' }
}

function isUsefulTitle(value:string) {
  const text=value.trim()
  if (text.length<5) return false
  if (/^\d{1,2}\.\s*[–—-]\s*\d{1,2}\./.test(text)||/^\d{1,2}\.\d{1,2}\.?\s*[–—-]/.test(text)) return false
  if (/^(lennot|lisää lähtöjä|lisaa lahtoja|matkan sisältö|matkan sisalto|hinta sisältää|hinta sisaltaa)/i.test(text)) return false
  return /[A-Za-zÅÄÖåäö]{4}/.test(text)
}

function metadataTitle(html:string) {
  const ogA=html.match(/<meta\b[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["'][^>]*>/i)?.[1]
  const ogB=html.match(/<meta\b[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["'][^>]*>/i)?.[1]
  const title=html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]
  const raw=ogA||ogB||title||''
  return cleanText(raw).replace(/\s*[–—|-]\s*Golfpassi\s*$/i,'').trim()
}

function pageTitle(html:string,url:string) {
  const meta=metadataTitle(html)
  if (isUsefulTitle(meta)) return meta.slice(0,160)
  const mainStart=Math.max(0,html.toLowerCase().indexOf('<main'))
  const segment=html.slice(mainStart,Math.min(html.length,mainStart+80000))
  const re=/<h[1-3]\b[^>]*>([\s\S]*?)<\/h[1-3]>/gi
  let match:RegExpExecArray|null
  while ((match=re.exec(segment))) {
    const title=cleanText(match[1])
    if (isUsefulTitle(title)) return title.slice(0,160)
  }
  return titleFromAnchor('',url)
}

function tripContentHtml(html:string) {
  const lower=html.toLowerCase()
  let start=lower.indexOf('<main')
  if (start<0) {
    const h1=lower.indexOf('<h1')
    start=h1>=0?h1:0
  }
  const possibleEnds=[lower.indexOf('</main>',start),lower.indexOf('<footer',start),start+120000].filter(index=>index>start)
  const end=Math.min(...possibleEnds,html.length)
  return html.slice(start,end)
}

function daysBetween(start:string,end:string) {
  return Math.round((Date.parse(`${end}T00:00:00Z`)-Date.parse(`${start}T00:00:00Z`))/86400000)
}

function extractTrips(profileHtml:string,profile:ProfileRef):Assignment[] {
  const section=profileTripsSection(profileHtml,profile)
  if (!section) return []
  const anchors=extractAnchors(section)
  const byUrl=new Map<string,Assignment>()
  for (const anchor of anchors) {
    if (!/(\/pelimatkat\/|\/kurssimatkat\/)/i.test(anchor.href)) continue
    const tripUrl=absoluteUrl(anchor.href,profile.profileUrl)
    if (!tripUrl) continue
    const near=cleanText(section.slice(Math.max(0,anchor.index-220),Math.min(section.length,anchor.index+anchor.html.length+700)))
    const range=dateRange(anchor.text)||dateRange(near)
    if (!range?.start||!range?.end||daysBetween(range.start,range.end)>45) continue
    const location=resolveLocation(anchor.text,tripUrl,near)
    if (!location) continue
    const trip=titleFromAnchor(anchor.text,tripUrl)
    const candidate:Assignment={
      id:`${profile.name}|${tripUrl}|${range.start}|${range.end}`,
      leader:profile.name,place:location.place,country:location.country,trip,
      start:range.start,end:range.end,lat:location.lat,lon:location.lon,
      profile:profile.profileUrl,tripUrl,imageUrl:null,tripVerified:false,tripPageChecked:false,
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
  async function run(){ while(true){ const index=cursor++; if(index>=items.length)return; results[index]=await worker(items[index]) } }
  await Promise.all(Array.from({length:Math.min(limit,items.length)},run))
  return results
}

function leaderVariants(name:string) {
  const parts=name.toLowerCase().split(/\s+/).filter(Boolean)
  const surname=parts[parts.length-1]||''
  const variants=new Set<string>([name.toLowerCase(),surname])
  if (surname.endsWith('nen')) variants.add(`${surname.slice(0,-3)}sen`)
  if (surname.endsWith('e')) variants.add(`${surname}n`)
  if (surname.endsWith('o')||surname.endsWith('a')||surname.endsWith('ä')) variants.add(`${surname}n`)
  return [...variants].filter(value=>value.length>=4)
}

function partialDateWithin(day:number,month:number,assignment:Assignment) {
  const startYear=Number(assignment.start.slice(0,4))
  const endYear=Number(assignment.end.slice(0,4))
  const years=[...new Set([startYear,endYear,startYear-1,endYear+1])]
  for (const year of years) {
    const value=iso(day,month,year)
    if (value && value>=assignment.start && value<=assignment.end) return value
  }
  return null
}

function verifyRangeFromTripPage(bodyText:string,assignment:Assignment) {
  const lower=bodyText.toLowerCase()
  const variants=leaderVariants(assignment.leader)
  const mentions:Array<{index:number;variant:string}>=[]
  for (const variant of variants) {
    let position=lower.indexOf(variant)
    while (position>=0) {
      mentions.push({index:position,variant})
      position=lower.indexOf(variant,position+variant.length)
    }
  }
  if (!mentions.length) return {verified:false,start:assignment.start,end:assignment.end}

  let best:{start:string;end:string;score:number}|null=null
  for (const mention of mentions) {
    const from=Math.max(0,mention.index-260)
    const to=Math.min(bodyText.length,mention.index+mention.variant.length+380)
    const snippet=bodyText.slice(from,to)
    const relativeMention=mention.index-from
    for (const hit of extractDateHits(snippet)) {
      if (hit.start<assignment.start || hit.end>assignment.end) continue
      const midpoint=hit.index+hit.length/2
      const distance=Math.abs(midpoint-relativeMention)
      const score=distance+(daysBetween(hit.start,hit.end)*0.25)
      if (!best||score<best.score) best={start:hit.start,end:hit.end,score}
    }
    if (best) continue

    const until=snippet.match(/(\d{1,2})\.(\d{1,2})\.?\s*(?:asti|saakka)/i)
    if (until) {
      const end=partialDateWithin(+until[1],+until[2],assignment)
      if (end) best={start:assignment.start,end,score:25}
    }
    const fromDate=snippet.match(/(\d{1,2})\.(\d{1,2})\.?\s*(?:alkaen|lähtien)/i)
    if (!best&&fromDate) {
      const start=partialDateWithin(+fromDate[1],+fromDate[2],assignment)
      if (start) best={start,end:assignment.end,score:25}
    }
  }
  return best ? {verified:true,start:best.start,end:best.end} : {verified:true,start:assignment.start,end:assignment.end}
}

async function enrichFromTripPages(assignments:Assignment[]) {
  const urls=[...new Set(assignments.map(assignment=>assignment.tripUrl))]
  const pages=await mapLimit(urls,10,async url=>{
    try { return [url,await fetchHtml(url)] as const }
    catch (error) { console.warn('Golfpassi trip sync failed',url,error); return [url,null] as const }
  })
  const pageMap=new Map<string,string|null>(pages)
  return assignments.map(assignment=>{
    const html=pageMap.get(assignment.tripUrl)
    if (!html) return assignment
    const title=pageTitle(html,assignment.tripUrl)
    const body=cleanText(tripContentHtml(html))
    const verification=verifyRangeFromTripPage(body,assignment)
    const pageLocation=resolveLocation(`${title} ${assignment.trip}`,assignment.tripUrl,body.slice(0,12000))
    const location=pageLocation || {place:assignment.place,country:assignment.country,lat:assignment.lat,lon:assignment.lon,accuracy:assignment.locationAccuracy}
    return {
      ...assignment,
      trip:isUsefulTitle(title)?title:assignment.trip,
      start:verification.start,end:verification.end,tripVerified:verification.verified,tripPageChecked:true,
      place:location.place,country:location.country,lat:location.lat,lon:location.lon,locationAccuracy:location.accuracy,
      id:`${assignment.leader}|${assignment.tripUrl}|${verification.start}|${verification.end}`,
    }
  })
}

function dayAfter(value:string) {
  const date=new Date(`${value}T00:00:00Z`); date.setUTCDate(date.getUTCDate()+1); return date.toISOString().slice(0,10)
}

function mergeAssignments(items:Assignment[]) {
  const groups=new Map<string,Assignment[]>()
  for (const assignment of items) {
    const key=`${assignment.leader}|${assignment.place}`
    if (!groups.has(key)) groups.set(key,[])
    groups.get(key)!.push(assignment)
  }
  const merged:Assignment[]=[]
  for (const group of groups.values()) {
    group.sort((a,b)=>a.start.localeCompare(b.start)||a.end.localeCompare(b.end))
    let last:Assignment|null=null
    for (const item of group) {
      if (last && item.start<=dayAfter(last.end)) {
        if (item.end>last.end) last.end=item.end
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

function overlaps(a:Assignment,b:Assignment) { return a.start<=b.end && b.start<=a.end }

function auditAssignments(assignments:Assignment[]):AuditReport {
  const unresolvedLocations:AuditIssue[]=[]
  const overlapIssues:AuditIssue[]=[]
  const longAssignments:AuditIssue[]=[]
  const unverifiedAssignments:AuditIssue[]=[]
  const duplicates:AuditIssue[]=[]
  const sourceCollisions:AuditIssue[]=[]
  const exactKeys=new Set<string>()

  for (const assignment of assignments) {
    if (assignment.locationAccuracy!=='exact') unresolvedLocations.push({type:'location',leader:assignment.leader,trip:assignment.trip,place:assignment.place,country:assignment.country,start:assignment.start,end:assignment.end,tripUrl:assignment.tripUrl,detail:`Kohde käyttää maan keskipistettä: ${assignment.place}`})
    if (!assignment.tripVerified) unverifiedAssignments.push({type:'unverified',leader:assignment.leader,trip:assignment.trip,place:assignment.place,start:assignment.start,end:assignment.end,tripUrl:assignment.tripUrl,detail:assignment.tripPageChecked?'Vetäjän nimeä ei löytynyt matkasivulta':'Matkasivua ei saatu tarkistettua'})
    if (daysBetween(assignment.start,assignment.end)>45) longAssignments.push({type:'long',leader:assignment.leader,trip:assignment.trip,place:assignment.place,start:assignment.start,end:assignment.end,tripUrl:assignment.tripUrl,detail:`Poikkeuksellisen pitkä vetäjäjakso (${daysBetween(assignment.start,assignment.end)+1} päivää)`})
    const key=`${assignment.leader}|${assignment.place}|${assignment.start}|${assignment.end}|${assignment.tripUrl}`
    if (exactKeys.has(key)) duplicates.push({type:'duplicate',leader:assignment.leader,trip:assignment.trip,place:assignment.place,start:assignment.start,end:assignment.end,tripUrl:assignment.tripUrl,detail:'Täsmälleen sama jakso esiintyy useammin kuin kerran'})
    exactKeys.add(key)
  }

  const byLeader=new Map<string,Assignment[]>()
  for (const assignment of assignments) {
    if (!byLeader.has(assignment.leader)) byLeader.set(assignment.leader,[])
    byLeader.get(assignment.leader)!.push(assignment)
  }
  for (const [leader,items] of byLeader) {
    const sorted=[...items].sort((a,b)=>a.start.localeCompare(b.start))
    for (let i=0;i<sorted.length;i++) {
      for (let j=i+1;j<sorted.length;j++) {
        if (sorted[j].start>sorted[i].end) break
        if (!overlaps(sorted[i],sorted[j])||sorted[i].place===sorted[j].place) continue
        const overlapStart=sorted[i].start>sorted[j].start?sorted[i].start:sorted[j].start
        const overlapEnd=sorted[i].end<sorted[j].end?sorted[i].end:sorted[j].end
        if (overlapStart===overlapEnd) continue
        overlapIssues.push({type:'overlap',leader,start:overlapStart,end:overlapEnd,detail:`Sama vetäjä kahdessa eri kohteessa: ${sorted[i].place} / ${sorted[j].place}`,tripUrl:sorted[j].tripUrl})
      }
    }
  }

  const byTrip=new Map<string,Assignment[]>()
  for (const assignment of assignments) {
    if (!byTrip.has(assignment.tripUrl)) byTrip.set(assignment.tripUrl,[])
    byTrip.get(assignment.tripUrl)!.push(assignment)
  }
  for (const [tripUrl,items] of byTrip) {
    const leaders=[...new Set(items.map(item=>item.leader))]
    const verifiedLeaders=new Set(items.filter(item=>item.tripVerified).map(item=>item.leader))
    if (leaders.length>=5 && verifiedLeaders.size<Math.ceil(leaders.length/2)) sourceCollisions.push({type:'source',trip:items[0]?.trip,place:items[0]?.place,tripUrl,detail:`Sama matkalinkki päätyi epäilyttävästi ${leaders.length} vetäjälle: ${leaders.slice(0,8).join(', ')}${leaders.length>8?'…':''}`})
  }

  for (const assignment of assignments) {
    if (daysBetween(assignment.start,assignment.end)>60 && !assignment.tripVerified) sourceCollisions.push({type:'source',leader:assignment.leader,trip:assignment.trip,place:assignment.place,start:assignment.start,end:assignment.end,tripUrl:assignment.tripUrl,detail:'Yli 60 päivän jaksoa ei voitu vahvistaa matkasivulta'})
  }

  return {
    generatedAt:new Date().toISOString(),totalAssignments:assignments.length,
    exactLocations:assignments.filter(assignment=>assignment.locationAccuracy==='exact').length,
    tripVerified:assignments.filter(assignment=>assignment.tripVerified).length,
    unresolvedLocations,overlaps:overlapIssues,longAssignments,unverifiedAssignments,duplicates,sourceCollisions,
    severeCount:unresolvedLocations.length+overlapIssues.length+duplicates.length+sourceCollisions.length,
    warningCount:longAssignments.length+unverifiedAssignments.length,
  }
}

export async function getGolfpassiData() {
  const indexHtml=await fetchHtml(LEADERS_URL)
  const profiles=extractProfiles(indexHtml)
  if (!profiles.length) throw new Error('Matkanjohtajaprofiileja ei löytynyt')

  const profileBatches=await mapLimit(profiles,8,async profile=>{
    try { return extractTrips(await fetchHtml(profile.profileUrl),profile) }
    catch (error) { console.warn('Golfpassi profile sync failed',profile.profileUrl,error); return [] as Assignment[] }
  })

  const candidates=profileBatches.flat()
  const today=new Date().toISOString().slice(0,10)
  const horizon=new Date(); horizon.setUTCDate(horizon.getUTCDate()+620)
  const horizonIso=horizon.toISOString().slice(0,10)
  const relevant=candidates.filter(assignment=>assignment.end>=today && assignment.start<=horizonIso)
  const enriched=await enrichFromTripPages(relevant)
  const assignments=mergeAssignments(enriched).filter(assignment=>assignment.end>=today && assignment.start<=horizonIso)
  return {assignments,audit:auditAssignments(assignments)}
}

export async function getGolfpassiAssignments() { return (await getGolfpassiData()).assignments }

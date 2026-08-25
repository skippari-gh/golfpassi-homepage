const BASE = 'https://golfpassi.fi'
const LEADERS_URL = `${BASE}/hyva-tietaa/matkanjohtajat/`
const REVALIDATE_SECONDS = 60 * 60 * 6

type ProfileRef = { name: string; profileUrl: string }
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
}

type Location = { place: string; country: string; lat: number; lon: number }

const locationRules: Array<{ pattern: RegExp; value: Location }> = [
  { pattern: /costa navarino|westin costa|w costa/i, value: { place:'Costa Navarino', country:'Kreikka', lat:36.96, lon:21.70 } },
  { pattern: /rio real/i, value: { place:'Rio Real', country:'Espanja', lat:36.52, lon:-4.84 } },
  { pattern: /fairplay|benalup/i, value: { place:'Fairplay', country:'Espanja', lat:36.34, lon:-5.81 } },
  { pattern: /la sella|denia marriott/i, value: { place:'La Sella', country:'Espanja', lat:38.80, lon:0.07 } },
  { pattern: /montecastillo/i, value: { place:'Montecastillo', country:'Espanja', lat:36.71, lon:-6.03 } },
  { pattern: /mar menor/i, value: { place:'Mar Menor', country:'Espanja', lat:37.74, lon:-0.91 } },
  { pattern: /el rompido/i, value: { place:'El Rompido', country:'Espanja', lat:37.22, lon:-7.12 } },
  { pattern: /infinitum|blaumar/i, value: { place:'Infinitum', country:'Espanja', lat:41.08, lon:1.16 } },
  { pattern: /calahonda|doña lola|dona lola/i, value: { place:'Calahonda', country:'Espanja', lat:36.49, lon:-4.71 } },
  { pattern: /san roque/i, value: { place:'San Roque', country:'Espanja', lat:36.21, lon:-5.38 } },
  { pattern: /la finca/i, value: { place:'La Finca', country:'Espanja', lat:38.06, lon:-0.80 } },
  { pattern: /tecina|la gomera/i, value: { place:'La Gomera', country:'Espanja', lat:28.03, lon:-17.21 } },
  { pattern: /aroeira/i, value: { place:'Aroeira', country:'Portugali', lat:38.58, lon:-9.19 } },
  { pattern: /camporeal/i, value: { place:'CampoReal', country:'Portugali', lat:39.04, lon:-9.24 } },
  { pattern: /belek|sirene|titanic deluxe/i, value: { place:'Belek', country:'Turkki', lat:36.86, lon:31.05 } },
  { pattern: /marrakech|tikida palmeraie/i, value: { place:'Marrakech', country:'Marokko', lat:31.63, lon:-8.00 } },
  { pattern: /tamarina|mauritius/i, value: { place:'Mauritius', country:'Mauritius', lat:-20.28, lon:57.38 } },
  { pattern: /hua hin/i, value: { place:'Hua Hin', country:'Thaimaa', lat:12.57, lon:99.96 } },
  { pattern: /ho tram/i, value: { place:'Ho Tram', country:'Vietnam', lat:10.47, lon:107.37 } },
  { pattern: /wafaifo|hoi an/i, value: { place:'Hoi An', country:'Vietnam', lat:15.88, lon:108.34 } },
  { pattern: /nusa dua|handara|bali|merusaka/i, value: { place:'Bali', country:'Indonesia', lat:-8.55, lon:115.17 } },
  { pattern: /st andrews/i, value: { place:'St Andrews', country:'Skotlanti', lat:56.34, lon:-2.80 } },
  { pattern: /pirin golf/i, value: { place:'Pirin Golf', country:'Bulgaria', lat:41.83, lon:23.48 } },
  { pattern: /le national|pariis|paris/i, value: { place:'Le National, Pariisi', country:'Ranska', lat:48.75, lon:2.08 } },
  { pattern: /somabay|soma bay|hurghada/i, value: { place:'Somabay', country:'Egypti', lat:26.85, lon:33.99 } },
  { pattern: /korineum|pohjois-kypros/i, value: { place:'Korineum', country:'Pohjois-Kypros', lat:35.34, lon:33.57 } },
  { pattern: /bogogno/i, value: { place:'Bogogno', country:'Italia', lat:45.66, lon:8.53 } },
  { pattern: /konopiste/i, value: { place:'Konopiště', country:'Tšekki', lat:49.78, lon:14.65 } },
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
    signal:AbortSignal.timeout(12000),
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
  const attrs=['data-lazy-src','data-src','src']
  for (const attr of attrs) {
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
  const bgRe=/background(?:-image)?\s*:\s*url\(["']?([^)'"\s]+)["']?\)/gi
  while ((m=bgRe.exec(segment))) {
    const url=absoluteUrl(m[1],profile.profileUrl)
    if (url && /wp-content\/uploads/i.test(url)) candidates.push({url,score:5})
  }
  candidates.sort((a,b)=>b.score-a.score)
  return candidates[0] && candidates[0].score>=5 ? candidates[0].url : null
}

function iso(day:number,month:number,year:number) {
  const d=new Date(Date.UTC(year,month-1,day))
  if (d.getUTCFullYear()!==year||d.getUTCMonth()!==month-1||d.getUTCDate()!==day) return null
  return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`
}

function dateRange(textValue:string) {
  const text=decodeHtml(textValue).replace(/\.\.\.+/g,'–').replace(/\s+/g,' ')
  let m=text.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})\s*[–—-]\s*(\d{1,2})\.(\d{1,2})\.(\d{4})/)
  if (m) return {start:iso(+m[1],+m[2],+m[3]),end:iso(+m[4],+m[5],+m[6])}
  m=text.match(/(\d{1,2})\.(\d{1,2})\.\s*[–—-]\s*(\d{1,2})\.(\d{1,2})\.(\d{4})/)
  if (m) {
    const endYear=+m[5], startMonth=+m[2], endMonth=+m[4]
    const startYear=startMonth>endMonth?endYear-1:endYear
    return {start:iso(+m[1],startMonth,startYear),end:iso(+m[3],endMonth,endYear)}
  }
  m=text.match(/(\d{1,2})\.\s*[–—-]\s*(\d{1,2})\.(\d{1,2})\.(\d{4})/)
  if (m) return {start:iso(+m[1],+m[3],+m[4]),end:iso(+m[2],+m[3],+m[4])}
  return null
}

function countryFrom(text:string,url:string) {
  const hay=`${text} ${url}`
  const pairs:Array<[RegExp,string]> = [
    [/espanja|\/espanja\//i,'Espanja'],[/portugali|\/portugali\//i,'Portugali'],[/kreikka|\/kreikka\//i,'Kreikka'],
    [/turkki|\/turkki\//i,'Turkki'],[/marokko|\/marokko\//i,'Marokko'],[/mauritius/i,'Mauritius'],[/thaimaa/i,'Thaimaa'],
    [/vietnam/i,'Vietnam'],[/bali|indonesia/i,'Indonesia'],[/skotlanti/i,'Skotlanti'],[/bulgaria/i,'Bulgaria'],[/ranska/i,'Ranska'],
    [/italia/i,'Italia'],[/egypti|hurghada/i,'Egypti'],[/pohjois-kypros/i,'Pohjois-Kypros'],[/kypros/i,'Kypros'],[/tšekki|tsekki/i,'Tšekki'],
    [/saksa/i,'Saksa'],[/ruotsi/i,'Ruotsi'],[/suomi/i,'Suomi'],[/viro/i,'Viro']
  ]
  return pairs.find(([re])=>re.test(hay))?.[1]||'Tuntematon'
}

function resolveLocation(text:string,url:string):Location|null {
  const hay=`${text} ${url}`
  const exact=locationRules.find(r=>r.pattern.test(hay))
  if (exact) return exact.value
  const country=countryFrom(text,url)
  const center=countryCenters[country]
  if (!center) return null
  return {place:country,country,lat:center.lat,lon:center.lon}
}

function titleFromAnchor(text:string,url:string) {
  let t=text.replace(/alk\.\s*[\d\s.,]+€.*$/i,' ').replace(/\d{1,2}\.\d{1,2}\.?(?:\d{4})?\s*[–—-].*$/,' ').replace(/\s+/g,' ').trim()
  if (t.length>=4) return t.slice(0,140)
  try { return decodeURIComponent(new URL(url).pathname.split('/').filter(Boolean).pop()||'Golfpassin matka').replace(/-/g,' ') } catch { return 'Golfpassin matka' }
}

function extractTrips(profileHtml:string,profile:ProfileRef,imageUrl:string|null):Assignment[] {
  const sectionIndex=profileHtml.toLowerCase().indexOf('mukana matkoilla')
  const html=sectionIndex>=0?profileHtml.slice(sectionIndex):profileHtml
  const anchors=extractAnchors(html)
  const out:Assignment[]=[]
  for (const a of anchors) {
    if (!/(\/pelimatkat\/|\/kurssimatkat\/)/i.test(a.href)) continue
    const tripUrl=absoluteUrl(a.href,profile.profileUrl)
    if (!tripUrl) continue
    const near=cleanText(html.slice(Math.max(0,a.index-250),Math.min(html.length,a.index+a.html.length+800)))
    const range=dateRange(a.text)||dateRange(near)
    if (!range?.start||!range?.end) continue
    const location=resolveLocation(`${a.text} ${near}`,tripUrl)
    if (!location) continue
    const trip=titleFromAnchor(a.text,tripUrl)
    out.push({
      id:`${profile.name}|${tripUrl}|${range.start}|${range.end}`,
      leader:profile.name,place:location.place,country:location.country,trip,
      start:range.start,end:range.end,lat:location.lat,lon:location.lon,
      profile:profile.profileUrl,tripUrl,imageUrl
    })
  }
  return out
}

async function mapLimit<T,R>(items:T[],limit:number,worker:(item:T)=>Promise<R>):Promise<R[]> {
  const results=new Array<R>(items.length)
  let cursor=0
  async function run(){ while(true){ const i=cursor++; if(i>=items.length)return; results[i]=await worker(items[i]) } }
  await Promise.all(Array.from({length:Math.min(limit,items.length)},run))
  return results
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
    for (const item of group) {
      const last=merged[merged.length-1]
      if (last && last.leader===item.leader && last.place===item.place && item.start<=dayAfter(last.end)) {
        if (item.end>last.end) last.end=item.end
        if (!last.imageUrl&&item.imageUrl) last.imageUrl=item.imageUrl
        continue
      }
      merged.push({...item,id:`${item.leader}|${item.place}|${item.start}`})
    }
  }
  return merged.sort((a,b)=>a.start.localeCompare(b.start)||a.leader.localeCompare(b.leader,'fi'))
}

export async function getGolfpassiAssignments() {
  const indexHtml=await fetchHtml(LEADERS_URL)
  const profiles=extractProfiles(indexHtml)
  if (!profiles.length) throw new Error('Matkanjohtajaprofiileja ei löytynyt')
  const batches=await mapLimit(profiles,8,async profile=>{
    try {
      const html=await fetchHtml(profile.profileUrl)
      const imageUrl=extractProfileImage(html,profile)
      return extractTrips(html,profile,imageUrl)
    } catch (error) {
      console.warn('Golfpassi profile sync failed',profile.profileUrl,error)
      return [] as Assignment[]
    }
  })
  const all=batches.flat()
  const today=new Date().toISOString().slice(0,10)
  const horizon=new Date(); horizon.setUTCDate(horizon.getUTCDate()+620)
  const horizonIso=horizon.toISOString().slice(0,10)
  return mergeAssignments(all).filter(a=>a.end>=today && a.start<=horizonIso)
}

const BASE='https://golfpassi.fi'
const CATALOG_URLS=[`${BASE}/pelimatkat/`,`${BASE}/kurssimatkat/`,`${BASE}/teemamatkat/`]
const REVALIDATE_SECONDS=60*60*6

type Accuracy='exact'|'country'
export type Destination={id:string;place:string;country:string;lat:number;lon:number;accuracy:Accuracy;tripCount:number;sampleTripUrl:string}
type Location={place:string;country:string;lat:number;lon:number;accuracy:Accuracy}

const exact=(place:string,country:string,lat:number,lon:number):Location=>({place,country,lat,lon,accuracy:'exact'})

const rules:Array<{pattern:RegExp;value:Location}>=[
  {pattern:/pirin/i,value:exact('Pirin Golf','Bulgaria',41.83,23.48)},
  {pattern:/somabay|soma bay|hurghada/i,value:exact('Somabay','Egypti',26.85,33.99)},
  {pattern:/donnington valley/i,value:exact('Donnington Valley','Englanti',51.42,-1.32)},
  {pattern:/almerimar/i,value:exact('Almerimar','Espanja',36.70,-2.79)},
  {pattern:/la sella|denia marriott/i,value:exact('La Sella','Espanja',38.80,0.07)},
  {pattern:/costa ballena/i,value:exact('Costa Ballena','Espanja',36.674429,-6.407432)},
  {pattern:/elba estepona|estepona/i,value:exact('Estepona','Espanja',36.43,-5.15)},
  {pattern:/fairplay|benalup/i,value:exact('Fairplay','Espanja',36.34,-5.81)},
  {pattern:/la finca/i,value:exact('La Finca','Espanja',38.06,-0.80)},
  {pattern:/hipotels flamenco|cala millor|mallorca/i,value:exact('Cala Millor, Mallorca','Espanja',39.60,3.38)},
  {pattern:/infinitum|blaumar/i,value:exact('Infinitum','Espanja',41.08,1.16)},
  {pattern:/san roque|inmood/i,value:exact('San Roque','Espanja',36.21,-5.38)},
  {pattern:/calahonda|doña lola|dona lola/i,value:exact('Calahonda','Espanja',36.49,-4.71)},
  {pattern:/la torre resort/i,value:exact('La Torre, Murcia','Espanja',37.82,-1.00)},
  {pattern:/oliva nova/i,value:exact('Oliva Nova','Espanja',38.89,-0.07)},
  {pattern:/mar menor/i,value:exact('Mar Menor','Espanja',37.74,-0.91)},
  {pattern:/rio real/i,value:exact('Rio Real','Espanja',36.52,-4.84)},
  {pattern:/montecastillo/i,value:exact('Montecastillo','Espanja',36.71,-6.03)},
  {pattern:/el rompido/i,value:exact('El Rompido','Espanja',37.22,-7.12)},
  {pattern:/tecina|la gomera/i,value:exact('La Gomera','Espanja',28.03,-17.21)},
  {pattern:/lopesan.*costa meloneras|costa meloneras/i,value:exact('Meloneras, Gran Canaria','Espanja',27.74,-15.60)},
  {pattern:/elba sara|elba palace|fuerteventura|caleta de fuste/i,value:exact('Fuerteventura','Espanja',28.39,-13.86)},
  {pattern:/kapkaupunki|cape town/i,value:exact('Kapkaupunki','Etelä-Afrikka',-33.93,18.42)},
  {pattern:/merusaka|nusa dua/i,value:exact('Nusa Dua, Bali','Indonesia',-8.80,115.23)},
  {pattern:/handara/i,value:exact('Handara, Bali','Indonesia',-8.24,115.16)},
  {pattern:/albarella/i,value:exact('Albarella','Italia',45.074,12.348)},
  {pattern:/sheraton.*parco|parco de.? medici/i,value:exact('Rooma – Parco de’ Medici','Italia',41.817,12.406)},
  {pattern:/nairobi|safari/i,value:exact('Nairobi','Kenia',-1.286,36.817)},
  {pattern:/akasha|crete golf|kreeta|hersonissos/i,value:exact('Kreeta','Kreikka',35.29,25.36)},
  {pattern:/costa navarino|westin costa|hotelli w/i,value:exact('Costa Navarino','Kreikka',36.96,21.70)},
  {pattern:/aphrodite hills|pafos|paphos/i,value:exact('Aphrodite Hills','Kypros',34.68,32.61)},
  {pattern:/agadir|tikida dunas/i,value:exact('Agadir','Marokko',30.42,-9.60)},
  {pattern:/marrakech|tikida palmeraie/i,value:exact('Marrakech','Marokko',31.63,-8.00)},
  {pattern:/tamarina|mauritius/i,value:exact('Mauritius','Mauritius',-20.28,57.38)},
  {pattern:/korineum|pohjois-kypros/i,value:exact('Korineum','Pohjois-Kypros',35.34,33.57)},
  {pattern:/aroeira/i,value:exact('Aroeira','Portugali',38.58,-9.19)},
  {pattern:/camporeal/i,value:exact('CampoReal','Portugali',39.04,-9.24)},
  {pattern:/vilamoura|hilton vilamoura|dom pedro/i,value:exact('Vilamoura','Portugali',37.09,-8.12)},
  {pattern:/pestana resort,? carvoeiro|carvoeiro/i,value:exact('Carvoeiro','Portugali',37.10,-8.47)},
  {pattern:/pestana valley nature/i,value:exact('Pestana Valley','Portugali',37.13,-8.45)},
  {pattern:/quinta da marinha|cascais/i,value:exact('Cascais','Portugali',38.70,-9.42)},
  {pattern:/le national|pariisi|paris/i,value:exact('Le National, Pariisi','Ranska',48.75,2.08)},
  {pattern:/oktoberfest|quellness|baijeri|bad griesbach|beckenbauer/i,value:exact('Bad Griesbach','Saksa',48.45,13.19)},
  {pattern:/st andrews/i,value:exact('St Andrews','Skotlanti',56.34,-2.80)},
  {pattern:/tahko/i,value:exact('Tahko','Suomi',63.29,28.04)},
  {pattern:/hua hin/i,value:exact('Hua Hin','Thaimaa',12.57,99.96)},
  {pattern:/belek|sirene|titanic deluxe|sueno/i,value:exact('Belek','Turkki',36.86,31.05)},
  {pattern:/konopiste|konopiště/i,value:exact('Konopiště','Tšekki',49.78,14.65)},
  {pattern:/ho tram/i,value:exact('Ho Tram','Vietnam',10.47,107.37)},
  {pattern:/wafaifo|hoi an/i,value:exact('Hoi An','Vietnam',15.88,108.34)},
  {pattern:/otepaa|otepää|supergolf viro/i,value:exact('Otepää','Viro',58.06,26.50)},
]

const countryCenters:Record<string,{lat:number;lon:number}>={
  Bulgaria:{lat:42.7,lon:25.5},Egypti:{lat:26.8,lon:30.8},Englanti:{lat:52.5,lon:-1.5},Espanja:{lat:40.1,lon:-3.7},
  'Etelä-Afrikka':{lat:-30.6,lon:22.9},Indonesia:{lat:-2.5,lon:118},Italia:{lat:42.8,lon:12.8},Kenia:{lat:0.2,lon:37.9},
  Kreikka:{lat:39,lon:22},Kypros:{lat:35.1,lon:33.4},Marokko:{lat:31.8,lon:-7.1},Mauritius:{lat:-20.2,lon:57.5},
  'Pohjois-Kypros':{lat:35.3,lon:33.4},Portugali:{lat:39.5,lon:-8},Ranska:{lat:46.2,lon:2.2},Saksa:{lat:51.2,lon:10.5},
  Skotlanti:{lat:56.5,lon:-4.2},Suomi:{lat:64,lon:26},Thaimaa:{lat:15.8,lon:100.9},Turkki:{lat:39,lon:35},
  Tšekki:{lat:49.8,lon:15.5},Vietnam:{lat:16,lon:107.8},Viro:{lat:58.6,lon:25}
}

function decodeHtml(value:string){return value.replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#039;|&apos;/gi,"'").replace(/&ndash;|&#8211;/gi,'–').replace(/&mdash;|&#8212;/gi,'—').replace(/&auml;/gi,'ä').replace(/&ouml;/gi,'ö').replace(/&aring;/gi,'å').replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n)))}
function cleanText(value:string){return decodeHtml(value.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim()}
function absoluteUrl(value:string,base:string){try{return new URL(decodeHtml(value),base).toString()}catch{return null}}
async function fetchHtml(url:string){const r=await fetch(url,{headers:{'user-agent':'Golfpassi-Maailmalla/1.0','accept':'text/html,application/xhtml+xml'},next:{revalidate:REVALIDATE_SECONDS},signal:AbortSignal.timeout(15000)});if(!r.ok)throw new Error(`Golfpassi ${r.status}: ${url}`);return r.text()}
function anchors(html:string){const out:Array<{href:string;text:string}>=[];const re=/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;let m:RegExpExecArray|null;while((m=re.exec(html)))out.push({href:m[1],text:cleanText(m[2])});return out}
function isTripUrl(url:string){try{const p=new URL(url).pathname;return /^\/(?:pelimatkat|kurssimatkat)\/[^/]+\/[^/]+\/?$/i.test(p)&&!p.includes('/matkatyypit/')}catch{return false}}
function titleScore(text:string){let s=Math.min(text.length,100);if(/hotel|resort|golf|stay|nairobi|hua hin|st andrews|kapkaupunki|tahko/i.test(text))s+=60;if(/laadukas|resortloma|puolihoito|uutuus|alkaen|alk\.|€|golf \+ ranta/i.test(text))s-=80;return s}
function countryFromUrl(url:string){try{const slug=new URL(url).pathname.split('/').filter(Boolean)[1]||'';const map:Record<string,string>={bulgaria:'Bulgaria',egypti:'Egypti',englanti:'Englanti',espanja:'Espanja','etela-afrikka':'Etelä-Afrikka',indonesia:'Indonesia',italia:'Italia',kenia:'Kenia',kreikka:'Kreikka',kypros:'Kypros',marokko:'Marokko',mauritius:'Mauritius','pohjois-kypros':'Pohjois-Kypros',portugali:'Portugali',ranska:'Ranska',saksa:'Saksa',skotlanti:'Skotlanti',suomi:'Suomi',thaimaa:'Thaimaa',turkki:'Turkki','tsekki':'Tšekki',vietnam:'Vietnam',viro:'Viro',kanariansaaret:'Espanja'};return map[slug]||''}catch{return''}}
function resolveLocations(text:string,url:string){const hay=`${text} ${decodeURIComponent(url)}`;const found=rules.filter(r=>r.pattern.test(hay)).map(r=>r.value);const unique=new Map(found.map(v=>[`${v.place}|${v.country}`,v]));if(unique.size)return [...unique.values()];const country=countryFromUrl(url);const c=countryCenters[country];return c?[{place:country,country,lat:c.lat,lon:c.lon,accuracy:'country' as const}]:[]}

export async function getGolfpassiDestinations():Promise<Destination[]>{
  const pages=await Promise.all(CATALOG_URLS.map(async url=>{try{return await fetchHtml(url)}catch(error){console.warn('Destination catalog failed',url,error);return''}}))
  const trips=new Map<string,{title:string;score:number}>()
  for(let i=0;i<pages.length;i++)for(const a of anchors(pages[i])){const url=absoluteUrl(a.href,CATALOG_URLS[i]);if(!url||!isTripUrl(url)||a.text.length<4)continue;const score=titleScore(a.text);const prev=trips.get(url);if(!prev||score>prev.score)trips.set(url,{title:a.text,score})}
  const byPlace=new Map<string,Destination>()
  for(const [url,meta] of trips){for(const loc of resolveLocations(meta.title,url)){const key=`${loc.place}|${loc.country}`;const prev=byPlace.get(key);if(prev)prev.tripCount+=1;else byPlace.set(key,{id:key,place:loc.place,country:loc.country,lat:loc.lat,lon:loc.lon,accuracy:loc.accuracy,tripCount:1,sampleTripUrl:url})}}
  return [...byPlace.values()].sort((a,b)=>a.country.localeCompare(b.country,'fi')||a.place.localeCompare(b.place,'fi'))
}

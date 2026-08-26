export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function allowed(url:URL) {
  return ['golfpassi.fi','www.golfpassi.fi'].includes(url.hostname)
}

function normalize(value:string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'')
}

function absolute(value:string,base:string) {
  try { return new URL(value.replace(/&amp;/g,'&'),base) } catch { return null }
}

function findProfileImage(html:string,profileUrl:string,name:string) {
  const tokens=name.toLowerCase().split(/\s+/).map(normalize).filter(t=>t.length>=3)
  const profileSlug=normalize(new URL(profileUrl).pathname.split('/').filter(Boolean).pop()||'')
  const candidates:Array<{url:URL;score:number}>=[]

  const add=(raw:string,baseScore=0)=>{
    const url=absolute(raw,profileUrl)
    if(!url||!allowed(url)) return
    if(!/\.(?:jpe?g|png|webp)(?:$|\?)/i.test(url.toString())) return
    const hay=normalize(decodeURIComponent(url.toString()))
    let score=baseScore
    if(/wp-content\/uploads/i.test(url.toString())) score+=5
    if(tokens.some(t=>hay.includes(t))) score+=35
    if(profileSlug&&hay.includes(profileSlug)) score+=45
    if(/(?:800x800|480x480|600x600|portrait|profile)/i.test(url.toString())) score+=5
    if(/logo|header|banner|golfpassi|korineum|costa-navarino|placeholder|icon/i.test(url.toString())) score-=25
    candidates.push({url,score})
  }

  const bg=/url\(\s*["']?([^)'"\s]+)["']?\s*\)/gi
  let m:RegExpExecArray|null
  while((m=bg.exec(html))) add(m[1],8)

  const img=/<img\b[^>]*(?:src|data-src|data-lazy-src)=["']([^"']+)["'][^>]*>/gi
  while((m=img.exec(html))) add(m[1],3)

  const raw=/https?:\/\/[^\s"'<>]+\.(?:jpe?g|png|webp)(?:\?[^\s"'<>]*)?/gi
  while((m=raw.exec(html))) add(m[0],1)

  candidates.sort((a,b)=>b.score-a.score)
  return candidates[0]?.score>=20 ? candidates[0].url : null
}

async function resolveTarget(requestUrl:URL) {
  const value=requestUrl.searchParams.get('url')
  if(value) {
    try {
      const direct=new URL(value)
      if(allowed(direct)) return direct
    } catch {}
  }

  const profile=requestUrl.searchParams.get('profile')
  const name=requestUrl.searchParams.get('name')||''
  if(!profile||!name) return null

  let profileUrl:URL
  try { profileUrl=new URL(profile) } catch { return null }
  if(!allowed(profileUrl)||!/\/hyva-tietaa\/matkanjohtajat\//i.test(profileUrl.pathname)) return null

  const response=await fetch(profileUrl.toString(),{
    headers:{'user-agent':'Golfpassi-Maailmalla/1.0','accept':'text/html,application/xhtml+xml'},
    next:{revalidate:86400},
    signal:AbortSignal.timeout(12000),
  })
  if(!response.ok) return null
  return findProfileImage(await response.text(),profileUrl.toString(),name)
}

export async function GET(request: Request) {
  const requestUrl=new URL(request.url)
  try {
    const target=await resolveTarget(requestUrl)
    if(!target) return new Response('Image unavailable',{status:404})

    const response=await fetch(target.toString(),{
      headers:{'user-agent':'Golfpassi-Maailmalla/1.0','accept':'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'},
      next:{revalidate:86400},
      signal:AbortSignal.timeout(12000),
    })
    if(!response.ok) return new Response('Image unavailable',{status:response.status})
    const contentType=response.headers.get('content-type')||'image/jpeg'
    if(!contentType.startsWith('image/')) return new Response('Image unavailable',{status:502})
    const bytes=await response.arrayBuffer()
    return new Response(bytes,{headers:{'Content-Type':contentType,'Cache-Control':'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800'}})
  } catch(error) {
    console.error('Avatar proxy failed',error)
    return new Response('Image unavailable',{status:502})
  }
}

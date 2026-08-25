export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const value = requestUrl.searchParams.get('url')
  if (!value) return new Response('Missing url',{status:400})

  let target: URL
  try { target = new URL(value) } catch { return new Response('Invalid url',{status:400}) }
  if (!['golfpassi.fi','www.golfpassi.fi'].includes(target.hostname)) return new Response('Forbidden',{status:403})

  try {
    const response = await fetch(target.toString(),{
      headers:{'user-agent':'Golfpassi-Maailmalla/1.0','accept':'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'},
      next:{revalidate:86400},
      signal:AbortSignal.timeout(12000),
    })
    if (!response.ok) return new Response('Image unavailable',{status:response.status})
    const contentType=response.headers.get('content-type')||'image/jpeg'
    const bytes=await response.arrayBuffer()
    return new Response(bytes,{headers:{'Content-Type':contentType,'Cache-Control':'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800'}})
  } catch {
    return new Response('Image unavailable',{status:502})
  }
}

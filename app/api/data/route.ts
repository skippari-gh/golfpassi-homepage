import { getGolfpassiData } from '../../../lib/golfpassi'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET() {
  try {
    const { assignments, audit } = await getGolfpassiData()
    return Response.json(
      { ok:true, source:'golfpassi.fi', updatedAt:new Date().toISOString(), assignments, audit },
      { headers:{ 'Cache-Control':'public, s-maxage=21600, stale-while-revalidate=86400' } }
    )
  } catch (error) {
    console.error('Golfpassi data sync failed', error)
    return Response.json(
      { ok:false, source:'fallback', updatedAt:new Date().toISOString(), assignments:[], audit:null, error:'Golfpassi-dataa ei saatu päivitettyä juuri nyt.' },
      { status:503, headers:{ 'Cache-Control':'no-store' } }
    )
  }
}

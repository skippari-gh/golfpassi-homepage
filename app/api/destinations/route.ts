import { getGolfpassiDestinations } from '../../../lib/destinations'

export const runtime='nodejs'
export const dynamic='force-dynamic'
export const maxDuration=60

export async function GET(){
  try{
    const destinations=await getGolfpassiDestinations()
    return Response.json({ok:true,source:'golfpassi.fi/pelimatkat',updatedAt:new Date().toISOString(),destinations},{headers:{'Cache-Control':'public, s-maxage=21600, stale-while-revalidate=86400'}})
  }catch(error){
    console.error('Golfpassi destination sync failed',error)
    return Response.json({ok:false,destinations:[],error:'Golfpassin kohteita ei saatu päivitettyä.'},{status:503,headers:{'Cache-Control':'no-store'}})
  }
}

import WorldMap from '@/app/components/WorldMap'
import {getWorldMapData} from '@/lib/data'
function helsinkiDate(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Helsinki',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
export default async function Home(){const assignments=await getWorldMapData();return <main className="page-shell"><WorldMap assignments={assignments} initialDate={helsinkiDate()}/></main>}

import {demoAssignments} from '@/lib/demo-data'
import {hasSupabaseConfig,supabaseAdmin} from '@/lib/supabase-admin'
import type {MapAssignment} from '@/lib/types'
export async function getWorldMapData():Promise<MapAssignment[]>{if(!hasSupabaseConfig())return demoAssignments;const s=supabaseAdmin();const {data,error}=await s.from('map_assignments').select('*').order('assignment_start',{ascending:true});if(error){console.error(error);return demoAssignments}return (data??[]) as MapAssignment[]}

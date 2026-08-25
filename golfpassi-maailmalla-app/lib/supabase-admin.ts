import {createClient} from '@supabase/supabase-js'
export function hasSupabaseConfig(){return Boolean(process.env.SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY)}
export function supabaseAdmin(){const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)throw new Error('Supabase environment variables are missing');return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})}

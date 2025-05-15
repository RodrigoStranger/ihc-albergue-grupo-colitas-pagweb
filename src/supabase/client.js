import { createClient } from '@supabase/supabase-js';

// Cargar variables de entorno directamente desde .env
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const client = createClient(supabaseUrl, supabaseAnonKey);

export default client;
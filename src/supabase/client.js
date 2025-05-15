import { createClient } from '@supabase/supabase-js';

// Cargar variables de entorno directamente desde .env
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://edvhcblegytbfbneujae.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkdmhjYmxlZ3l0YmZibmV1amFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMTM2NjYsImV4cCI6MjA2Mjg4OTY2Nn0.AoZGKDoTzBxl_kzBAV-C_QLCJ9eUzOISKqgEWm2zdmw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
import { createClient } from '@supabase/supabase-js'

// Récupère l'URL et la clé anonyme depuis les variables d'environnement
// Le VITE_ prefix est important pour que Vite expose ces variables au client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Crée et exporte le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

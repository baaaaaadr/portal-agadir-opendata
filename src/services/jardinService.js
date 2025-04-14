import { supabase } from '../supabaseClient';

/**
 * Récupère tous les jardins depuis Supabase.
 * @returns {Promise<{data: Array|null, error: Object|null}>} Un objet avec les données ou une erreur.
 */
export async function fetchJardins() {
  console.log('Attempting to fetch jardins...');
  const { data, error } = await supabase
    .from('jardins')
    .select('*');

  if (error) {
    console.error('Error fetching jardins:', error);
  } else {
    console.log('Jardins fetched successfully:', data);
  }

  return { data, error };
}

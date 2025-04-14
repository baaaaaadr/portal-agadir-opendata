import { supabase } from '../supabaseClient';

/**
 * Récupère toutes les lignes de bus depuis Supabase.
 * @returns {Promise<{data: Array|null, error: Object|null}>} Un objet avec les données ou une erreur.
 */
export async function fetchLignesBus() {
  console.log('Attempting to fetch lignes_bus...');
  const { data, error } = await supabase
    .from('lignes_bus')
    .select('*')
    .order('numero_ligne', { ascending: true });

  if (error) {
    console.error('Error fetching lignes_bus:', error);
  } else {
    console.log('Lignes de bus fetched successfully:', data);
  }

  return { data, error };
}

import { supabase } from '../supabaseClient'; // Importe le client Supabase configuré

/**
 * Récupère tous les équipements sportifs depuis Supabase.
 * @returns {Promise<{data: Array|null, error: Object|null}>} Un objet avec les données ou une erreur.
 */
export async function fetchEquipements() {
  console.log('Attempting to fetch equipements...'); // Log pour débogage
  const { data, error } = await supabase
    .from('equipements_sportifs') // Nom de votre table
    .select('*'); // Sélectionne toutes les colonnes

  if (error) {
    console.error('Error fetching equipements:', error); // Log l'erreur
  } else {
    console.log('Equipements fetched successfully:', data); // Log les données reçues
  }

  return { data, error };
}

// Vous pourrez ajouter d'autres fonctions ici plus tard (ex: fetchEquipementById)

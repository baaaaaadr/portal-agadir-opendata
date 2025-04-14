// src/services/hotelService.js
import { supabase } from '../supabaseClient'; // Importe le client Supabase configuré

/**
 * Récupère tous les hôtels depuis Supabase.
 * @returns {Promise<{data: Array|null, error: Object|null}>} Un objet avec les données ou une erreur.
 */
export async function fetchHotels() {
  console.log('Attempting to fetch hotels...'); // Log pour débogage
  const { data, error } = await supabase
    .from('hotels') // Nom de la nouvelle table
    .select('*'); // Sélectionne toutes les colonnes (incluant nom, classement, geom, etc.)

  if (error) {
    console.error('Error fetching hotels:', error); // Log l'erreur
  } else {
    console.log('Hotels fetched successfully:', data); // Log les données reçues
  }

  return { data, error };
}

// Vous pourrez ajouter d'autres fonctions ici plus tard (ex: fetchHotelById)

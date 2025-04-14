import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchJardins } from '../services/jardinService';
import JardinsMap from '../components/maps/JardinsMap';
import MetadataBlock from '../components/datasets/MetadataBlock';
import Tabs, { Tab, TabPanel } from '../components/ui/Tabs'; // Importer Tabs
import { FiList, FiMap } from 'react-icons/fi'; // Importer les icônes
import jardinGenericCardUrl from '../assets/jardin-generic-card.jpg'; // <-- Importer l'image générique
import jardinsBannerUrl from '../assets/jardins-banner.jpg'; // <-- Importer la bannière

// Helper to parse equipements string (reste inchangé)
const parseEquipements = (equipementsString) => {
    if (!equipementsString) return [];
    return equipementsString.split('\n').map(e => e.trim()).filter(e => e);
};

function JardinsPage({ theme }) { // theme n'est pas utilisé ici mais gardé pour cohérence
  // --- États --- 
  const [jardins, setJardins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuartier, setSelectedQuartier] = useState(''); // Nouvel état pour le filtre

  // --- Chargement des données --- 
  useEffect(() => {
    async function loadJardins() {
      setIsLoading(true);
      setError(null);
      const { data, error: fetchError } = await fetchJardins();
      if (fetchError) {
        setError(fetchError.message);
        setJardins([]);
      } else {
        // Nettoyage simple des données au chargement si nécessaire
        const cleanData = (data || []).map(j => ({ ...j, quartier: j.quartier?.trim() }));
        setJardins(cleanData);
      }
      setIsLoading(false);
    }
    loadJardins();
  }, []);

  // --- Options de quartier pour le filtre --- 
  const quartierOptions = useMemo(() => {
    const quartiers = new Set(jardins.map(j => j.quartier).filter(Boolean)); // Récupère les quartiers uniques non vides
    return ['', ...Array.from(quartiers).sort()];
  }, [jardins]);

  // --- Logique de filtrage --- 
  const filteredJardins = useMemo(() => {
    return jardins.filter(jardin => {
      const quartierMatch = selectedQuartier === '' || jardin.quartier === selectedQuartier;
      return quartierMatch;
    });
  }, [jardins, selectedQuartier]);

  // --- Rendu des filtres (pour Sidebar et mobile) --- 
  const renderFilters = () => (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold font-heading text-neutral-text-light dark:text-neutral-text-dark border-b pb-2 mb-3 border-neutral-light-sand dark:border-neutral-bg-alt-dark">
        Filtres
      </h3>
      <div>
        <label htmlFor="filter-quartier" className="block text-sm font-medium text-neutral-text-muted-light dark:text-neutral-text-muted-dark mb-1">
          Filtrer par quartier :
        </label>
        <select
          id="filter-quartier"
          value={selectedQuartier}
          onChange={(e) => setSelectedQuartier(e.target.value)}
          className="w-full p-2 rounded border bg-neutral-bg-light dark:bg-neutral-bg-dark border-neutral-medium-gray dark:border-neutral-bg-alt-dark focus:ring-primary focus:border-primary text-sm text-neutral-text-light dark:text-neutral-text-dark"
        >
          {quartierOptions.map(quartier => (
            <option key={quartier} value={quartier}>
              {quartier === '' ? 'Tous les quartiers' : quartier}
            </option>
          ))}
        </select>
      </div>
      <div className="pt-3 text-right">
          <button 
              onClick={() => { setSelectedQuartier(''); }} 
              disabled={!selectedQuartier}
              className="text-xs text-secondary dark:text-secondary-light hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
              Réinitialiser
          </button>
      </div>
    </div>
  );

  // --- Rendu des cartes (pour TabPanel 'Liste') ---
  const renderCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredJardins.map(jardin => {
        // Utilise l'image spécifique si elle existe (ex: jardin.image_url), sinon la générique
        const imageUrl = jardin.image_url || jardinGenericCardUrl; // <-- Logique d'image

        return (
          // Structure de la carte MODIFIÉE pour inclure <img>
          <div key={jardin.id || jardin.nom} className="bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-200 border border-neutral-light-sand dark:border-neutral-bg-alt-dark">
            {/* Section Image */}
            <img
              src={imageUrl}
              alt={`Vue de ${jardin.nom || 'Jardin'}`} // Texte alternatif plus descriptif
              className="w-full h-48 object-cover" // Style pour l'image (hauteur fixe, couvre l'espace)
            />
            {/* Card Body */}
            <div className="p-4 flex flex-col flex-grow">
              <h4 className="text-lg font-heading font-bold text-primary dark:text-primary-light mb-2">{jardin.nom}</h4>
              <p className="text-sm font-body text-neutral-text-light dark:text-neutral-text-dark mb-3 flex-grow">
                {jardin.description}
              </p>
              {/* Details Section */} 
              <div className="text-xs border-t border-neutral-light-sand dark:border-neutral-bg-alt-dark pt-3 mt-auto space-y-1 text-neutral-text-muted-light dark:text-neutral-text-muted-dark">
                <p><strong className="font-semibold text-neutral-text-light dark:text-neutral-text-dark">Quartier:</strong> {jardin.quartier || 'N/A'}</p>
                <p><strong className="font-semibold text-neutral-text-light dark:text-neutral-text-dark">Horaires:</strong> {jardin.horaires || 'N/A'}</p>
                {parseEquipements(jardin.equipements).length > 0 && (
                  <div>
                    <strong className="font-semibold text-neutral-text-light dark:text-neutral-text-dark">Équipements:</strong>
                    <ul className="list-disc list-inside pl-2">
                      {parseEquipements(jardin.equipements).map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // --- Structure Principale de la Page --- 
  return (
    <div className="max-w-full mx-auto px-0 sm:px-0 lg:px-0 py-8 flex"> {/* Full width, flex container */}

      {/* Sidebar (Gauche) */} 
      <aside className="w-1/4 xl:w-1/5 hidden md:block border-r border-neutral-light-sand dark:border-neutral-bg-alt-dark pr-6">
        {/* Contenu Sidebar */} 
        {isLoading ? (
          <div className="p-4 text-center">Chargement des filtres...</div>
        ) : error ? (
           <div className="p-4 text-center text-red-500">Erreur chargement filtres</div>
        ) : (
            <>
                <div className="sticky top-4"> {/* Make filters sticky */} 
                    {renderFilters()}
                     <p className="text-xs text-neutral-text-muted-light dark:text-neutral-text-muted-dark p-4 italic">
                        {filteredJardins.length} jardin(s) affiché(s).
                    </p>
                </div>
            </>
        )}
      </aside>

      {/* Main Content (Droite) */} 
      <div className="w-full md:w-3/4 xl:w-4/5 md:pl-6">

        {/* Metadonnées */} 
        <MetadataBlock
          title="Jardins Publics"
          description="Localisation et informations sur les parcs et jardins publics accessibles à Agadir, incluant description et équipements."
          source="Commune d'Agadir - Service des Espaces Verts"
          dateMaj="2024-02-20"
          licence="Licence Ouverte v2.0"
          tags={['parc', 'jardin', 'vert', 'espace public', 'nature', 'loisir']}
        />

        {/* Bannière Image */}
        <div className="my-6 rounded-lg overflow-hidden shadow-md">
            <img
                src={jardinsBannerUrl}
                alt="Bannière jardins Agadir"
                className="w-full h-40 sm:h-56 object-cover"
            />
        </div>

        {/* Affichage conditionnel pendant le chargement ou erreur */} 
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center p-6 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-lg font-body">Erreur lors du chargement: {error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 inline-block bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200">
              Réessayer
            </button>
          </div>
        ) : !jardins || jardins.length === 0 ? (
            <div className="text-center py-10 text-neutral-text-muted-light dark:text-neutral-text-muted-dark">
                Aucune donnée de jardin disponible pour le moment.
            </div>
        ) : (
          <>
            {/* Section pour les filtres sur mobile/tablette (masquée sur md et plus) */} 
            <details className="md:hidden mb-4 p-4 bg-neutral-bg-alt-light dark:bg-neutral-surface-dark rounded shadow">
                 <summary className="cursor-pointer font-semibold text-neutral-text-light dark:text-neutral-text-dark">Afficher/Masquer les Filtres</summary>
                 {renderFilters()}
                 <p className="text-xs text-neutral-text-muted-light dark:text-neutral-text-muted-dark p-4 italic">
                    {filteredJardins.length} jardin(s) affiché(s).
                 </p>
             </details>

            {/* Onglets pour les visualisations */} 
            <Tabs>
              {/* Définition des onglets */} 
              <Tab label="Liste (Cartes)" icon={<FiList className="inline-block w-4 h-4 mr-1" />} />
              <Tab label="Carte" icon={<FiMap className="inline-block w-4 h-4 mr-1" />} />

              {/* Panneau 1: Cartes */} 
              <TabPanel>
                {filteredJardins.length > 0 ? (
                  renderCards()
                ) : (
                  <p className="text-center py-10 text-neutral-text-muted-light dark:text-neutral-text-muted-dark">
                    Aucun jardin ne correspond aux filtres sélectionnés.
                  </p>
                )}
              </TabPanel>

              {/* Panneau 2: Carte */} 
              <TabPanel>
                {filteredJardins.length > 0 ? (
                  <JardinsMap jardins={filteredJardins} />
                ) : (
                  <p className="text-center py-10 text-neutral-text-muted-light dark:text-neutral-text-muted-dark">
                    Aucun jardin à afficher sur la carte avec les filtres actuels.
                  </p>
                )}
              </TabPanel>
            </Tabs>
          </>
        )}

        {/* Lien Retour Catalogue */} 
        <div className="mt-10 text-left">
            <Link to="/catalogue" className="inline-block bg-secondary hover:bg-secondary-light text-neutral-charcoal font-semibold px-6 py-2 rounded-lg transition-colors duration-200 text-sm">
                ← Retour au Catalogue
            </Link>
        </div>
      </div>
    </div>
  );
}

export default JardinsPage;

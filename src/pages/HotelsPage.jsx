import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchHotels } from '../services/hotelService';
import HotelsParClassementChart from '../components/visualizations/HotelsParClassementChart';
import HotelsMap from '../components/maps/HotelsMap';
import MetadataBlock from '../components/datasets/MetadataBlock';
import Tabs, { Tab, TabPanel } from '../components/ui/Tabs'; // Importer Tabs
import { FiTable, FiMap, FiBarChart2 } from 'react-icons/fi'; // Importer les icônes
import hotelsBannerUrl from '../assets/hotels-banner.jpg'; // Importer la bannière

function HotelsPage({ theme }) {
  // --- États --- 
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassement, setSelectedClassement] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'nom', direction: 'ascending' });

  // --- Chargement des données --- 
  useEffect(() => {
    async function loadHotels() {
      setIsLoading(true);
      setError(null);
      const { data, error: fetchError } = await fetchHotels();
      if (fetchError) {
        setError(fetchError.message);
        setHotels([]);
      } else {
        setHotels(data || []);
      }
      setIsLoading(false);
    }
    loadHotels();
  }, []);

  // --- Options de classement --- 
  const classementOptions = useMemo(() => {
    const classements = new Set(hotels.map(h => h.classement || 'Non spécifié'));
    // Tri spécifique pour les étoiles (simple pour l'instant)
    return ['', ...Array.from(classements).sort((a, b) => {
      if (a === 'Non spécifié') return 1;
      if (b === 'Non spécifié') return -1;
      return a.localeCompare(b, undefined, { numeric: true });
    })];
  }, [hotels]);

  // --- Logique de filtrage et tri --- 
  const sortedAndFilteredHotels = useMemo(() => {
    let filtered = hotels.filter(hotel => {
      const nameMatch = hotel.nom && hotel.nom.toLowerCase().includes(searchTerm.toLowerCase());
      const actualClassement = hotel.classement || 'Non spécifié';
      const classementMatch = selectedClassement === '' || actualClassement === selectedClassement;
      return nameMatch && classementMatch;
    });

    if (sortConfig.key !== null) {
      filtered.sort((a, b) => {
        const valA = a[sortConfig.key] || '';
        const valB = b[sortConfig.key] || '';
        let comparison = 0;
        if (typeof valA === 'string' && typeof valB === 'string') {
          comparison = valA.localeCompare(valB, 'fr', { sensitivity: 'base' });
        } else {
          if (valA < valB) { comparison = -1; }
          if (valA > valB) { comparison = 1; }
        }
        return sortConfig.direction === 'descending' ? (comparison * -1) : comparison;
      });
    }
    return filtered;
  }, [hotels, searchTerm, selectedClassement, sortConfig]);

  // --- Fonctions de tri --- 
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) { return <span className="opacity-30 ml-1">↕</span>; }
    return sortConfig.direction === 'ascending' ? <span className="opacity-80 ml-1">▲</span> : <span className="opacity-80 ml-1">▼</span>;
  };

  // --- Rendu des filtres (pour Sidebar et mobile) --- 
  const renderFilters = () => (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold font-heading text-neutral-text-light dark:text-neutral-text-dark border-b pb-2 mb-3 border-neutral-light-sand dark:border-neutral-bg-alt-dark">
        Filtres
      </h3>
      <div>
        <label htmlFor="search-hotel" className="block text-sm font-medium text-neutral-text-muted-light dark:text-neutral-text-muted-dark mb-1">
          Rechercher par nom :
        </label>
        <input
          type="text"
          id="search-hotel"
          placeholder="Nom de l'hôtel..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 rounded border bg-neutral-bg-light dark:bg-neutral-bg-dark border-neutral-medium-gray dark:border-neutral-bg-alt-dark focus:ring-primary focus:border-primary text-sm text-neutral-text-light dark:text-neutral-text-dark placeholder-neutral-text-muted-light dark:placeholder-neutral-text-muted-dark"
        />
      </div>
      <div>
        <label htmlFor="filter-classement" className="block text-sm font-medium text-neutral-text-muted-light dark:text-neutral-text-muted-dark mb-1">
          Filtrer par classement :
        </label>
        <select
          id="filter-classement"
          value={selectedClassement}
          onChange={(e) => setSelectedClassement(e.target.value)}
          className="w-full p-2 rounded border bg-neutral-bg-light dark:bg-neutral-bg-dark border-neutral-medium-gray dark:border-neutral-bg-alt-dark focus:ring-primary focus:border-primary text-sm text-neutral-text-light dark:text-neutral-text-dark"
        >
          {classementOptions.map(classement => (
            <option key={classement} value={classement}>
              {classement === '' ? 'Tous les classements' : classement}
            </option>
          ))}
        </select>
      </div>
      <div className="pt-3 text-right">
        <button 
          onClick={() => { setSearchTerm(''); setSelectedClassement(''); setSortConfig({ key: 'nom', direction: 'ascending' }); }} 
          disabled={!searchTerm && !selectedClassement}
          className="text-xs text-secondary dark:text-secondary-light hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );

  // --- Rendu du tableau (pour TabPanel) ---
  const renderTable = () => (
    <div className="overflow-x-auto bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-neutral-light-sand dark:divide-neutral-bg-alt-dark">
        <thead className="bg-neutral-light-sand dark:bg-neutral-bg-alt-dark">
          <tr>
            <th scope="col" className="py-3 px-4 text-left text-xs font-medium font-heading text-neutral-text-light dark:text-neutral-text-muted-dark uppercase tracking-wider w-[40%] cursor-pointer hover:bg-neutral-bg-alt-light dark:hover:bg-neutral-bg-alt-dark" onClick={() => requestSort('nom')}>Nom {getSortIcon('nom')}</th>
            <th scope="col" className="py-3 px-4 text-left text-xs font-medium font-heading text-neutral-text-light dark:text-neutral-text-muted-dark uppercase tracking-wider w-[20%] cursor-pointer hover:bg-neutral-bg-alt-light dark:hover:bg-neutral-bg-alt-dark" onClick={() => requestSort('classement')}>Classement {getSortIcon('classement')}</th>
            <th scope="col" className="py-3 px-4 text-left text-xs font-medium font-heading text-neutral-text-light dark:text-neutral-text-muted-dark uppercase tracking-wider w-[40%]">Adresse</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-bg-alt-light dark:divide-neutral-bg-alt-dark">
          {sortedAndFilteredHotels.map((hotel) => (
            <tr key={hotel.id || hotel.nom} className="hover:bg-neutral-bg-alt-light dark:hover:bg-neutral-bg-alt-dark transition-colors duration-150">
              <td className="py-3 px-4 text-sm font-medium text-neutral-text-light dark:text-neutral-text-dark break-words">{hotel.nom || 'N/A'}</td>
              <td className="py-3 px-4 text-sm text-neutral-text-muted-light dark:text-neutral-text-muted-dark break-words">{hotel.classement || 'N/A'}</td>
              <td className="py-3 px-4 text-sm text-neutral-text-muted-light dark:text-neutral-text-muted-dark break-words">{hotel.adresse || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
                        {sortedAndFilteredHotels.length} hôtel(s) affiché(s).
                    </p>
                </div>
            </>
        )}
      </aside>

      {/* Main Content (Droite) */} 
      <div className="w-full md:w-3/4 xl:w-4/5 md:pl-6">

        {/* Metadonnées */} 
        <MetadataBlock
          title="Hôtels Classés"
          description="Répertoire des hôtels classés sur le territoire d'Agadir, avec leur classement, adresse et coordonnées géographiques."
          source="Commune d'Agadir / Observatoire du Tourisme"
          dateMaj="2024-04-01"
          licence="Licence Ouverte v2.0"
          tags={['hébergement', 'hôtel', 'classement', 'tourisme', 'établissement']}
        />

        {/* Bannière Image */}
        <div className="my-6 rounded-lg overflow-hidden shadow-md">
          <img
            src={hotelsBannerUrl}
            alt="Bannière hôtels Agadir"
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
        ) : !hotels || hotels.length === 0 ? (
             <div className="text-center py-10 text-neutral-text-muted-light dark:text-neutral-text-muted-dark">
                Aucune donnée d'hôtel disponible pour le moment.
             </div>
        ) : (
          <>
            {/* Section pour les filtres sur mobile/tablette (masquée sur md et plus) */} 
            <details className="md:hidden mb-4 p-4 bg-neutral-bg-alt-light dark:bg-neutral-surface-dark rounded shadow">
                 <summary className="cursor-pointer font-semibold text-neutral-text-light dark:text-neutral-text-dark">Afficher/Masquer les Filtres</summary>
                 {renderFilters()}
                 <p className="text-xs text-neutral-text-muted-light dark:text-neutral-text-muted-dark p-4 italic">
                    {sortedAndFilteredHotels.length} hôtel(s) affiché(s).
                 </p>
             </details>

            {/* Onglets pour les visualisations */} 
            <Tabs>
              {/* Définition des onglets */} 
              <Tab label="Tableau" icon={<FiTable className="inline-block w-4 h-4 mr-1" />} />
              <Tab label="Carte" icon={<FiMap className="inline-block w-4 h-4 mr-1" />} />
              <Tab label="Analyse (Classement)" icon={<FiBarChart2 className="inline-block w-4 h-4 mr-1" />} />

              {/* Panneau 1: Tableau */} 
              <TabPanel>
                {sortedAndFilteredHotels.length > 0 ? (
                  renderTable()
                ) : (
                  <p className="text-center py-10 text-neutral-text-muted-light dark:text-neutral-text-muted-dark">
                    Aucun hôtel ne correspond aux filtres sélectionnés.
                  </p>
                )}
              </TabPanel>

              {/* Panneau 2: Carte */} 
              <TabPanel>
                {sortedAndFilteredHotels.length > 0 ? (
                  <HotelsMap hotels={sortedAndFilteredHotels} />
                ) : (
                  <p className="text-center py-10 text-neutral-text-muted-light dark:text-neutral-text-muted-dark">
                    Aucun hôtel à afficher sur la carte avec les filtres actuels.
                  </p>
                )}
              </TabPanel>

              {/* Panneau 3: Graphique */} 
              <TabPanel>
                 <p className="text-xs text-neutral-text-muted-light dark:text-neutral-text-muted-dark mb-2 italic">
                    Note : Le graphique montre la répartition pour les hôtels *actuellement affichés* après filtrage.
                 </p>
                <HotelsParClassementChart hotels={sortedAndFilteredHotels} theme={theme} />
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

export default HotelsPage;

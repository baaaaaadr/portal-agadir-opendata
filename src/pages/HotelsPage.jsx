import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchHotels } from '../services/hotelService';
import HotelsParClassementChart from '../components/visualizations/HotelsParClassementChart';
import HotelsMap from '../components/maps/HotelsMap';

function HotelsPage({ theme }) {
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // New filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassement, setSelectedClassement] = useState('');

  // --- NOUVEL ÉTAT POUR LE TRI ---
  const [sortConfig, setSortConfig] = useState({ key: 'nom', direction: 'ascending' });
  // --- FIN NOUVEL ÉTAT TRI ---

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

  // --- LOGIQUE DE FILTRAGE ET TRI ---
  const sortedAndFilteredHotels = useMemo(() => {
    let filtered = hotels.filter(hotel => {
      const nameMatch = hotel.nom && hotel.nom.toLowerCase().includes(searchTerm.toLowerCase());
      const actualClassement = hotel.classement || 'Non spécifié';
      const classementMatchStrict = selectedClassement === '' || actualClassement === selectedClassement;
      return nameMatch && classementMatchStrict;
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
    console.log("Sorting/Filtering hotels...", { searchTerm, selectedClassement, sortConfig });
    return filtered;
  }, [hotels, searchTerm, selectedClassement, sortConfig]);

  // --- OPTIONS DE CLASSEMENT (reste identique) ---
  const classementOptions = useMemo(() => {
    const classements = new Set(hotels.map(h => h.classement || 'Non spécifié'));
    return ['', ...Array.from(classements).sort()];
  }, [hotels]);

  // --- Fonction pour demander le tri ---
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // --- Fonction pour obtenir l'icône de tri ---
  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <span className="opacity-30 ml-1">↕</span>;
    }
    return sortConfig.direction === 'ascending' ?
      <span className="opacity-80 ml-1">▲</span> :
      <span className="opacity-80 ml-1">▼</span>;
  };

  let content;
  if (isLoading) {
    content = (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  } else if (error) {
    content = (
      <div className="text-center">
        <p className="text-red-500 text-lg font-body">Erreur lors du chargement: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 inline-block bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
        >
          Réessayer
        </button>
      </div>
    );
  } else {
    content = (
      <div className="space-y-10">
        {/* Filters section */}
        <div className="p-4 sm:p-6 bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-lg shadow-md">
          <h3 className="text-xl font-heading font-semibold text-neutral-text-light dark:text-neutral-text-dark mb-4">
            Filtrer les Hôtels
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search field */}
            <div>
              <label htmlFor="search-hotel" className="block text-sm font-medium text-neutral-text-muted-light dark:text-neutral-text-muted-dark mb-1">
                Rechercher par nom :
              </label>
              <input
                type="text"
                id="search-hotel"
                placeholder="Entrez un nom d'hôtel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 rounded border bg-neutral-bg-light dark:bg-neutral-bg-dark border-neutral-medium-gray dark:border-neutral-bg-alt-dark focus:ring-primary focus:border-primary text-sm text-neutral-text-light dark:text-neutral-text-dark placeholder-neutral-text-muted-light dark:placeholder-neutral-text-muted-dark"
              />
            </div>
            {/* Classification filter */}
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
                <option value="">Tous les classements</option>
                {classementOptions.slice(1).map(classement => (
                  <option key={classement} value={classement}>
                    {classement}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Display result count */}
        <p className="text-sm text-neutral-text-muted-light dark:text-neutral-text-muted-dark italic">
          {sortedAndFilteredHotels.length} hôtel(s) trouvé(s).
        </p>

        {/* No results message */}
        {hotels.length > 0 && sortedAndFilteredHotels.length === 0 && (
          <div className="text-center py-10">
            <p className="text-lg font-medium text-neutral-text-light dark:text-neutral-text-dark">Aucun hôtel ne correspond à vos critères.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedClassement(''); }}
              className="mt-4 inline-block text-sm text-primary dark:text-primary-light hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Display components only if there are filtered results */}
        {sortedAndFilteredHotels.length > 0 && (
          <>
            {/* Map section */}
            <div>
              <h3 className="text-2xl font-heading font-semibold text-neutral-text-light dark:text-neutral-text-dark mb-4">
                Carte des Hôtels ({sortedAndFilteredHotels.length})
              </h3>
              <HotelsMap hotels={sortedAndFilteredHotels} />
            </div>

            {/* Chart section */}
            <div>
              <h3 className="text-2xl font-heading font-semibold text-neutral-text-light dark:text-neutral-text-dark mb-4">
                Répartition par Classement ({sortedAndFilteredHotels.length} affichés)
              </h3>
              <HotelsParClassementChart hotels={sortedAndFilteredHotels} theme={theme} />
            </div>

            {/* List section */}
            <div>
              <h3 className="text-2xl font-heading font-semibold text-neutral-text-light dark:text-neutral-text-dark mb-4">
                Liste Détaillée des Hôtels ({sortedAndFilteredHotels.length})
              </h3>
              <div className="overflow-x-auto bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-lg shadow-md">
                <table className="min-w-full divide-y divide-neutral-light-sand dark:divide-neutral-bg-alt-dark table-auto">
                  <thead className="bg-neutral-light-sand dark:bg-neutral-bg-alt-dark">
                    <tr>
                      <th scope="col" className="py-3 px-4 text-left text-xs font-medium font-heading text-neutral-text-light dark:text-neutral-text-muted-dark uppercase tracking-wider cursor-pointer hover:bg-neutral-bg-alt-light dark:hover:bg-neutral-bg-alt-dark"
                          onClick={() => requestSort('nom')}>
                        Nom {getSortIcon('nom')}
                      </th>
                      <th scope="col" className="py-3 px-4 text-left text-xs font-medium font-heading text-neutral-text-light dark:text-neutral-text-muted-dark uppercase tracking-wider cursor-pointer hover:bg-neutral-bg-alt-dark"
                          onClick={() => requestSort('classement')}>
                        Classement {getSortIcon('classement')}
                      </th>
                      <th scope="col" className="py-3 px-4 text-left text-xs font-medium font-heading text-neutral-text-light dark:text-neutral-text-muted-dark uppercase tracking-wider">
                        Adresse
                      </th>
                      <th scope="col" className="py-3 px-4 text-left text-xs font-medium font-heading text-neutral-text-light dark:text-neutral-text-muted-dark uppercase tracking-wider">
                        Téléphone
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-bg-alt-light dark:divide-neutral-bg-alt-dark">
                    {sortedAndFilteredHotels.map((hotel) => (
                      <tr key={hotel.id} className="hover:bg-neutral-bg-alt-light dark:hover:bg-neutral-bg-alt-dark transition-colors duration-150">
                        <td className="py-3 px-4 whitespace-nowrap text-sm font-medium text-neutral-text-light dark:text-neutral-text-dark">
                          {hotel.nom || 'N/A'}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-neutral-text-muted-light dark:text-neutral-text-muted-dark">
                          {hotel.classement || 'Non spécifié'}
                        </td>
                        <td className="py-3 px-4 text-sm text-neutral-text-muted-light dark:text-neutral-text-muted-dark">
                          {hotel.adresse || 'N/A'}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-neutral-text-muted-light dark:text-neutral-text-muted-dark">
                          {hotel.telephone || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-heading font-bold text-neutral-text-light dark:text-neutral-text-dark mb-6">
        Hôtels d'Agadir
      </h2>
      {content}
      <div className="mt-10 text-center">
        <Link
          to="/"
          className="inline-block bg-secondary hover:bg-secondary-light text-neutral-charcoal font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

export default HotelsPage;

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchEquipements } from '../services/equipementService';
import CoutParQuartierChart from '../components/visualizations/CoutParQuartierChart';
import EquipementsMap from '../components/maps/EquipementsMap';

function EquipementsPage({ theme }) {
  const [equipements, setEquipements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartKey, setChartKey] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: 'projet_nom', direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuartier, setSelectedQuartier] = useState('');
  const [minCost, setMinCost] = useState('');
  const [maxCost, setMaxCost] = useState('');

  useEffect(() => {
    async function loadEquipements() {
      setIsLoading(true);
      setError(null);
      const { data, error: fetchError } = await fetchEquipements();

      if (fetchError) {
        setError(fetchError.message);
        setEquipements([]);
      } else {
        const validData = data || [];
        setEquipements(validData);
        setChartKey(prevKey => prevKey + 1);
      }
      setIsLoading(false);
    }
    loadEquipements();
  }, []);

  const quartierOptions = useMemo(() => {
    const quartiers = new Set(equipements.map(e => e.quartier || 'Non spécifié'));
    return ['', ...Array.from(quartiers).sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }))];
  }, [equipements]);

  const filteredAndSortedEquipements = useMemo(() => {
    console.log("Filtering/Sorting Equipements...", { searchTerm, selectedQuartier, minCost, maxCost, sortConfig });

    const minCostValue = minCost === '' ? null : parseFloat(minCost);
    const maxCostValue = maxCost === '' ? null : parseFloat(maxCost);

    let filtered = equipements.filter(equip => {
      const nameMatch = equip.projet_nom && equip.projet_nom.toLowerCase().includes(searchTerm.toLowerCase());
      const actualQuartier = equip.quartier || 'Non spécifié';
      const quartierMatch = selectedQuartier === '' || actualQuartier === selectedQuartier;
      const cost = typeof equip.cout_total === 'number' ? equip.cout_total : null;
      const minCostMatch = minCostValue === null || isNaN(minCostValue) || (cost !== null && cost >= minCostValue);
      const maxCostMatch = maxCostValue === null || isNaN(maxCostValue) || (cost !== null && cost <= maxCostValue);

      return nameMatch && quartierMatch && minCostMatch && maxCostMatch;
    });

    if (sortConfig.key !== null) {
      filtered.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        let comparison = 0;

        if (valA === null || valA === undefined) comparison = -1;
        else if (valB === null || valB === undefined) comparison = 1;
        else if (typeof valA === 'number' && typeof valB === 'number') { comparison = valA - valB; }
        else if (typeof valA === 'string' && typeof valB === 'string') { comparison = valA.localeCompare(valB, 'fr', { sensitivity: 'base' }); }
        else { comparison = String(valA).localeCompare(String(valB), 'fr', { sensitivity: 'base' }); }

        return sortConfig.direction === 'descending' ? (comparison * -1) : comparison;
      });
    }
    return filtered;
  }, [equipements, searchTerm, selectedQuartier, minCost, maxCost, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

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
        <div className="p-4 sm:p-6 bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-lg shadow-md">
          <h3 className="text-xl font-heading font-semibold text-neutral-text-light dark:text-neutral-text-dark mb-4">
            Filtrer les Équipements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search-equipement" className="block text-sm font-medium text-neutral-text-muted-light dark:text-neutral-text-muted-dark mb-1">
                Rechercher par nom :
              </label>
              <input
                type="text"
                id="search-equipement"
                placeholder="Nom du projet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 rounded border bg-neutral-bg-light dark:bg-neutral-bg-dark border-neutral-medium-gray dark:border-neutral-bg-alt-dark focus:ring-primary focus:border-primary text-sm text-neutral-text-light dark:text-neutral-text-dark placeholder-neutral-text-muted-light dark:placeholder-neutral-text-muted-dark"
              />
            </div>
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
            <div className="md:col-span-1 grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="filter-min-cost" className="block text-sm font-medium text-neutral-text-muted-light dark:text-neutral-text-muted-dark mb-1">
                  Coût Min (MAD) :
                </label>
                <input
                  type="number"
                  id="filter-min-cost"
                  placeholder="Min"
                  min="0"
                  value={minCost}
                  onChange={(e) => setMinCost(e.target.value)}
                  className="w-full p-2 rounded border bg-neutral-bg-light dark:bg-neutral-bg-dark border-neutral-medium-gray dark:border-neutral-bg-alt-dark focus:ring-primary focus:border-primary text-sm text-neutral-text-light dark:text-neutral-text-dark placeholder-neutral-text-muted-light dark:placeholder-neutral-text-muted-dark"
                />
              </div>
              <div>
                <label htmlFor="filter-max-cost" className="block text-sm font-medium text-neutral-text-muted-light dark:text-neutral-text-muted-dark mb-1">
                  Coût Max (MAD) :
                </label>
                <input
                  type="number"
                  id="filter-max-cost"
                  placeholder="Max"
                  min="0"
                  value={maxCost}
                  onChange={(e) => setMaxCost(e.target.value)}
                  className="w-full p-2 rounded border bg-neutral-bg-light dark:bg-neutral-bg-dark border-neutral-medium-gray dark:border-neutral-bg-alt-dark focus:ring-primary focus:border-primary text-sm text-neutral-text-light dark:text-neutral-text-dark placeholder-neutral-text-muted-light dark:placeholder-neutral-text-muted-dark"
                />
              </div>
            </div>
          </div>
          <div className="mt-4 text-right">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedQuartier('');
                setMinCost('');
                setMaxCost('');
                setSortConfig({ key: 'projet_nom', direction: 'ascending' });
              }}
              className="text-sm text-secondary dark:text-secondary-light hover:underline font-medium"
              disabled={!searchTerm && !selectedQuartier && !minCost && !maxCost}
            >
              Réinitialiser tous les filtres
            </button>
          </div>
        </div>

        <p className="text-sm text-neutral-text-muted-light dark:text-neutral-text-muted-dark italic">
          {filteredAndSortedEquipements.length} équipement(s) trouvé(s).
        </p>

        {equipements.length === 0 && !isLoading && (
          <div className="text-center py-10">
            <p className="text-lg font-medium text-neutral-text-light dark:text-neutral-text-dark">Aucun équipement trouvé.</p>
          </div>
        )}

        {equipements.length > 0 && filteredAndSortedEquipements.length === 0 && (
          <div className="text-center py-10">
            <p className="text-lg font-medium text-neutral-text-light dark:text-neutral-text-dark">Aucun équipement ne correspond à vos critères.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedQuartier('');
                setMinCost('');
                setMaxCost('');
              }}
              className="mt-4 inline-block text-sm text-primary dark:text-primary-light hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {filteredAndSortedEquipements.length > 0 && (
          <>
            <div>
              <h3 className="text-2xl font-heading font-semibold text-neutral-text-light dark:text-neutral-text-dark mb-4">
                Carte des Équipements ({filteredAndSortedEquipements.length})
              </h3>
              <EquipementsMap equipements={filteredAndSortedEquipements} />
            </div>

            <div>
              <h3 className="text-2xl font-heading font-semibold text-neutral-text-light dark:text-neutral-text-dark mb-4">
                Coût Total par Quartier (Tous)
              </h3>
              <CoutParQuartierChart key={chartKey} equipements={equipements} theme={theme} />
            </div>

            <div>
              <h3 className="text-2xl font-heading font-semibold text-neutral-text-light dark:text-neutral-text-dark mb-4">
                Détails des Équipements ({filteredAndSortedEquipements.length})
              </h3>
              <div className="overflow-x-auto bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-lg shadow-md">
                <table className="min-w-full divide-y divide-neutral-light-sand dark:divide-neutral-bg-alt-dark table-fixed">
                  <thead className="bg-neutral-light-sand dark:bg-neutral-bg-alt-dark">
                    <tr>
                      <th scope="col" className="py-3 px-4 text-left text-xs font-medium font-heading text-neutral-text-light dark:text-neutral-text-muted-dark uppercase tracking-wider w-[30%] sm:w-[25%] cursor-pointer hover:bg-neutral-bg-alt-light dark:hover:bg-neutral-bg-alt-dark"
                          onClick={() => requestSort('projet_nom')}>
                        Nom du Projet {getSortIcon('projet_nom')}
                      </th>
                      <th scope="col" className="py-3 px-4 text-left text-xs font-medium font-heading text-neutral-text-light dark:text-neutral-text-muted-dark uppercase tracking-wider w-[15%] sm:w-[15%] cursor-pointer hover:bg-neutral-bg-alt-light dark:hover:bg-neutral-bg-alt-dark"
                          onClick={() => requestSort('quartier')}>
                        Quartier {getSortIcon('quartier')}
                      </th>
                      <th scope="col" className="py-3 px-4 text-left text-xs font-medium font-heading text-neutral-text-light dark:text-neutral-text-muted-dark uppercase tracking-wider w-[35%] sm:w-[40%]">
                        Composantes
                      </th>
                      <th scope="col" className="py-3 px-4 text-right text-xs font-medium font-heading text-neutral-text-light dark:text-neutral-text-muted-dark uppercase tracking-wider w-[20%] sm:w-[20%] cursor-pointer hover:bg-neutral-bg-alt-light dark:hover:bg-neutral-bg-alt-dark"
                          onClick={() => requestSort('cout_total')}>
                        Coût Total (MAD) {getSortIcon('cout_total')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-bg-alt-light dark:divide-neutral-bg-alt-dark">
                    {filteredAndSortedEquipements.map((equipement) => (
                      <tr key={equipement.id} className="hover:bg-neutral-bg-alt-light dark:hover:bg-neutral-bg-alt-dark transition-colors duration-150">
                        <td className="py-3 px-4 text-sm font-medium text-neutral-text-light dark:text-neutral-text-dark break-words">
                          {equipement.projet_nom || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-sm text-neutral-text-muted-light dark:text-neutral-text-muted-dark break-words">
                          {equipement.quartier || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-sm text-neutral-text-muted-light dark:text-neutral-text-muted-dark break-words">
                          {equipement.composantes ? (
                            equipement.composantes.split('\n').map((line, index) => (
                              <span key={index} className="block">{line.trim()}</span>
                            ))
                          ) : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-sm text-neutral-text-muted-light dark:text-neutral-text-muted-dark text-right">
                          {typeof equipement.cout_total === 'number'
                            ? equipement.cout_total.toLocaleString('fr-MA', { style: 'currency', currency: 'MAD', minimumFractionDigits: 0, maximumFractionDigits: 0 })
                            : equipement.cout_total || 'N/A'}
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
        Équipements Sportifs
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

export default EquipementsPage;

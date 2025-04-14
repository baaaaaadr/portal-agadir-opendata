// src/pages/LignesBusPage.jsx
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchLignesBus } from '../services/busService';

function LignesBusPage({ theme }) {
  const [lignesBus, setLignesBus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'numero_ligne', direction: 'ascending' });

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const { data, error: fetchError } = await fetchLignesBus();
      console.log("Fetched data from Supabase:", data); // Log fetched data
      setLignesBus(data || []);
      setError(fetchError?.message || null);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const filteredAndSortedLignes = useMemo(() => {
    let filtered = lignesBus.filter(ligne => {
      const searchLower = searchTerm.toLowerCase();
      // Using optional chaining and nullish coalescing for safety
      return (
        (ligne?.numero_ligne ?? '').toLowerCase().includes(searchLower) ||
        (ligne?.designation ?? '').toLowerCase().includes(searchLower) ||
        (ligne?.detail_depart ?? '').toLowerCase().includes(searchLower) ||
        (ligne?.detail_arrivee ?? '').toLowerCase().includes(searchLower)
      );
    });

    if (sortConfig.key !== null) {
      const extractLineNumber = (numStr) => parseInt(numStr?.substring(1) || '0', 10);

      filtered.sort((a, b) => {
        const key = sortConfig.key;
        let comparison = 0;

        if (key === 'numero_ligne') {
          comparison = extractLineNumber(a[key]) - extractLineNumber(b[key]);
        } else {
          // Using nullish coalescing for safety
          const valA = a[key] ?? '';
          const valB = b[key] ?? '';
          comparison = valA.localeCompare(valB, 'fr', { sensitivity: 'base' });
        }
        return sortConfig.direction === 'descending' ? (comparison * -1) : comparison;
      });
    }
    // console.log("Data after filter/sort:", filtered); // Optional log
    return filtered;
  }, [lignesBus, searchTerm, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return <span className="opacity-30 ml-1">↕</span>;
    return sortConfig.direction === 'ascending' ? <span className="opacity-80 ml-1">▲</span> : <span className="opacity-80 ml-1">▼</span>;
  };

  let content;
  if (isLoading) {
    content = (
      <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  } else if (error) {
    content = (
      <div className="text-center text-red-500 p-10">
        Erreur: {error}
      </div>
    );
  } else {
    content = (
      <div className="space-y-6">
        {/* Search Bar */}
        <div>
          <label htmlFor="search-ligne" className="block text-sm font-medium text-neutral-text-muted-light dark:text-neutral-text-muted-dark mb-1">
            Rechercher :
          </label>
          <input
            type="text"
            id="search-ligne"
            placeholder="Numéro, désignation, détail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 lg:w-1/3 p-2 rounded border bg-neutral-bg-light dark:bg-neutral-bg-dark border-neutral-medium-gray dark:border-neutral-bg-alt-dark focus:ring-primary focus:border-primary text-sm text-neutral-text-light dark:text-neutral-text-dark placeholder-neutral-text-muted-light dark:placeholder-neutral-text-muted-dark"
          />
        </div>

        {/* Result Count */}
        <p className="text-sm text-neutral-text-muted-light dark:text-neutral-text-muted-dark italic">
          {filteredAndSortedLignes.length} ligne(s) trouvée(s).
        </p>

        {/* No Results Message */}
        {lignesBus.length > 0 && filteredAndSortedLignes.length === 0 && (
          <div className="text-center py-10">
            <p className="text-lg font-medium text-neutral-text-light dark:text-neutral-text-dark">
              Aucune ligne ne correspond à votre recherche.
            </p>
          </div>
        )}

        {/* Table */}
        {filteredAndSortedLignes.length > 0 && (
          <div className="overflow-x-auto bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-neutral-light-sand dark:divide-neutral-bg-alt-dark table-auto">
              <thead className="bg-neutral-light-sand dark:bg-neutral-bg-alt-dark">
                <tr>
                  <th scope="col" className="py-3 px-4 text-left text-xs font-medium font-heading text-neutral-text-light dark:text-neutral-text-muted-dark uppercase tracking-wider cursor-pointer hover:bg-neutral-bg-alt-light dark:hover:bg-neutral-bg-alt-dark"
                      onClick={() => requestSort('numero_ligne')}>
                    Ligne {getSortIcon('numero_ligne')}
                  </th>
                  <th scope="col" className="py-3 px-4 text-left text-xs font-medium font-heading text-neutral-text-light dark:text-neutral-text-muted-dark uppercase tracking-wider cursor-pointer hover:bg-neutral-bg-alt-light dark:hover:bg-neutral-bg-alt-dark"
                      onClick={() => requestSort('designation')}>
                    Désignation {getSortIcon('designation')}
                  </th>
                  <th scope="col" className="py-3 px-4 text-left text-xs font-medium font-heading text-neutral-text-light dark:text-neutral-text-muted-dark uppercase tracking-wider cursor-pointer hover:bg-neutral-bg-alt-light dark:hover:bg-neutral-bg-alt-dark"
                      onClick={() => requestSort('detail_depart')}>
                    Détail Départ {getSortIcon('detail_depart')}
                  </th>
                  <th scope="col" className="py-3 px-4 text-left text-xs font-medium font-heading text-neutral-text-light dark:text-neutral-text-muted-dark uppercase tracking-wider cursor-pointer hover:bg-neutral-bg-alt-light dark:hover:bg-neutral-bg-alt-dark"
                      onClick={() => requestSort('detail_arrivee')}>
                    Détail Arrivée {getSortIcon('detail_arrivee')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-bg-alt-light dark:divide-neutral-bg-alt-dark">
                {filteredAndSortedLignes.map((ligne) => {
                  // --- AJOUT DU CONSOLE LOG POUR DEBUG ---
                  console.log(`Rendering ligne ${ligne.numero_ligne}:`, ligne);
                  // --- FIN CONSOLE LOG ---
                  return ( // Ensure return statement is here
                    <tr key={ligne.numero_ligne} className="hover:bg-neutral-bg-alt-light dark:hover:bg-neutral-bg-alt-dark transition-colors duration-150">
                      <td className="py-3 px-4 whitespace-nowrap text-sm font-semibold text-neutral-text-light dark:text-neutral-text-dark">
                        {ligne.numero_ligne}
                      </td>
                      <td className="py-3 px-4 text-sm text-neutral-text-light dark:text-neutral-text-dark">
                        {/* Using nullish coalescing for safety */}
                        {ligne.designation ?? '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-neutral-text-muted-light dark:text-neutral-text-muted-dark">
                        {ligne.detail_depart ?? '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-neutral-text-muted-light dark:text-neutral-text-muted-dark">
                        {ligne.detail_arrivee ?? '-'}
                      </td>
                    </tr>
                  ); // Ensure closing parenthesis for return is here
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-heading font-bold text-neutral-text-light dark:text-neutral-text-dark mb-6">
        Lignes de Bus d'Agadir
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

export default LignesBusPage;
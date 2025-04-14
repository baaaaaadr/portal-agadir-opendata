// src/pages/LignesBusPage.jsx
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchLignesBus } from '../services/busService';
import MetadataBlock from '../components/datasets/MetadataBlock';
import Tabs, { Tab, TabPanel } from '../components/ui/Tabs'; // Importer Tabs
import { FiTable } from 'react-icons/fi'; // Importer l'icône
import busBannerUrl from '../assets/bus-banner.jpg'; // Importer la bannière

function LignesBusPage({ theme }) { // theme non utilisé mais gardé
  // --- États ---
  const [lignesBus, setLignesBus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'numero_ligne', direction: 'ascending' });

  // --- Chargement des données ---
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);
      const { data, error: fetchError } = await fetchLignesBus();
      // console.log("Fetched data from Supabase:", data); // Log fetched data
      setLignesBus(data || []);
      setError(fetchError?.message || null);
      setIsLoading(false);
    }
    loadData();
  }, []);

  // --- Logique de filtrage et tri ---
  const filteredAndSortedLignes = useMemo(() => {
    let filtered = lignesBus.filter(ligne => {
      const searchLower = searchTerm.toLowerCase();
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
          const valA = a[key] ?? '';
          const valB = b[key] ?? '';
          comparison = valA.localeCompare(valB, 'fr', { sensitivity: 'base' });
        }
        return sortConfig.direction === 'descending' ? (comparison * -1) : comparison;
      });
    }
    return filtered;
  }, [lignesBus, searchTerm, sortConfig]);

  // --- Fonctions de tri ---
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

  // --- Rendu des filtres (Sidebar et mobile) ---
  const renderFilters = () => (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold font-heading text-neutral-text-light dark:text-neutral-text-dark border-b pb-2 mb-3 border-neutral-light-sand dark:border-neutral-bg-alt-dark">
        Filtres
      </h3>
      <div>
        <label htmlFor="search-ligne" className="block text-sm font-medium text-neutral-text-muted-light dark:text-neutral-text-muted-dark mb-1">
          Rechercher :
        </label>
        <input
          type="text"
          id="search-ligne"
          placeholder="N°, désignation, arrêt..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 rounded border bg-neutral-bg-light dark:bg-neutral-bg-dark border-neutral-medium-gray dark:border-neutral-bg-alt-dark focus:ring-primary focus:border-primary text-sm text-neutral-text-light dark:text-neutral-text-dark placeholder-neutral-text-muted-light dark:placeholder-neutral-text-muted-dark"
        />
      </div>
       <div className="pt-3 text-right">
          <button 
              onClick={() => { setSearchTerm(''); setSortConfig({ key: 'numero_ligne', direction: 'ascending' });}} 
              disabled={!searchTerm}
              className="text-xs text-secondary dark:text-secondary-light hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
              Réinitialiser
          </button>
      </div>
    </div>
  );

  // --- Rendu du tableau (TabPanel) ---
  const renderTable = () => (
    <div className="overflow-x-auto bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-neutral-light-sand dark:divide-neutral-bg-alt-dark table-auto">
        <thead className="bg-neutral-light-sand dark:bg-neutral-bg-alt-dark">
          <tr>
            <th scope="col" className="py-3 px-4 text-left text-xs font-medium font-heading text-neutral-text-light dark:text-neutral-text-muted-dark uppercase tracking-wider w-[10%] cursor-pointer hover:bg-neutral-bg-alt-light dark:hover:bg-neutral-bg-alt-dark" onClick={() => requestSort('numero_ligne')}>Ligne {getSortIcon('numero_ligne')}</th>
            <th scope="col" className="py-3 px-4 text-left text-xs font-medium font-heading text-neutral-text-light dark:text-neutral-text-muted-dark uppercase tracking-wider w-[30%] cursor-pointer hover:bg-neutral-bg-alt-light dark:hover:bg-neutral-bg-alt-dark" onClick={() => requestSort('designation')}>Désignation {getSortIcon('designation')}</th>
            <th scope="col" className="py-3 px-4 text-left text-xs font-medium font-heading text-neutral-text-light dark:text-neutral-text-muted-dark uppercase tracking-wider w-[30%] cursor-pointer hover:bg-neutral-bg-alt-light dark:hover:bg-neutral-bg-alt-dark" onClick={() => requestSort('detail_depart')}>Détail Départ {getSortIcon('detail_depart')}</th>
            <th scope="col" className="py-3 px-4 text-left text-xs font-medium font-heading text-neutral-text-light dark:text-neutral-text-muted-dark uppercase tracking-wider w-[30%] cursor-pointer hover:bg-neutral-bg-alt-light dark:hover:bg-neutral-bg-alt-dark" onClick={() => requestSort('detail_arrivee')}>Détail Arrivée {getSortIcon('detail_arrivee')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-bg-alt-light dark:divide-neutral-bg-alt-dark">
          {filteredAndSortedLignes.map((ligne) => (
            <tr key={ligne.numero_ligne} className="hover:bg-neutral-bg-alt-light dark:hover:bg-neutral-bg-alt-dark transition-colors duration-150">
              <td className="py-3 px-4 whitespace-nowrap text-sm font-semibold text-neutral-text-light dark:text-neutral-text-dark">{ligne.numero_ligne}</td>
              <td className="py-3 px-4 text-sm text-neutral-text-light dark:text-neutral-text-dark">{ligne.designation ?? '-'}</td>
              <td className="py-3 px-4 text-sm text-neutral-text-muted-light dark:text-neutral-text-muted-dark">{ligne.detail_depart ?? '-'}</td>
              <td className="py-3 px-4 text-sm text-neutral-text-muted-light dark:text-neutral-text-muted-dark">{ligne.detail_arrivee ?? '-'}</td>
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
                        {filteredAndSortedLignes.length} ligne(s) affichée(s).
                    </p>
                </div>
            </>
        )}
      </aside>

      {/* Main Content (Droite) */} 
      <div className="w-full md:w-3/4 xl:w-4/5 md:pl-6">

        {/* Metadonnées */} 
        <MetadataBlock
          title="Lignes de Bus Urbain"
          description="Tracés et détails des lignes du réseau de bus urbain Alsa desservant Agadir et ses environs."
          source="Alsa Agadir / Commune d'Agadir"
          dateMaj="2023-12-10"
          licence="Licence Spécifique (à vérifier)"
          tags={['bus', 'transport', 'mobilité', 'Alsa', 'urbain', 'réseau']}
        />

        {/* Bannière Image */}
        <div className="my-6 rounded-lg overflow-hidden shadow-md">
          <img
            src={busBannerUrl}
            alt="Bannière bus Agadir"
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
        ) : !lignesBus || lignesBus.length === 0 ? (
            <div className="text-center py-10 text-neutral-text-muted-light dark:text-neutral-text-muted-dark">
                Aucune donnée de ligne de bus disponible pour le moment.
            </div>
        ) : (
          <>
             {/* Section pour les filtres sur mobile/tablette (masquée sur md et plus) */} 
             <details className="md:hidden mb-4 p-4 bg-neutral-bg-alt-light dark:bg-neutral-surface-dark rounded shadow">
                 <summary className="cursor-pointer font-semibold text-neutral-text-light dark:text-neutral-text-dark">Afficher/Masquer les Filtres</summary>
                 {renderFilters()}
                 <p className="text-xs text-neutral-text-muted-light dark:text-neutral-text-muted-dark p-4 italic">
                    {filteredAndSortedLignes.length} ligne(s) affichée(s).
                 </p>
             </details>

            {/* Onglet unique pour le tableau */} 
            <Tabs>
              {/* Définition de l'onglet */} 
              <Tab label="Tableau" icon={<FiTable className="inline-block w-4 h-4 mr-1" />} />

              {/* Panneau Tableau */} 
              <TabPanel>
                {filteredAndSortedLignes.length > 0 ? (
                  renderTable()
                ) : (
                  <p className="text-center py-10 text-neutral-text-muted-light dark:text-neutral-text-muted-dark">
                    Aucune ligne ne correspond à la recherche.
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

export default LignesBusPage;
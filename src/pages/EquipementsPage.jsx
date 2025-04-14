// src/pages/EquipementsPage.jsx
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchEquipements } from '../services/equipementService';
import MetadataBlock from '../components/datasets/MetadataBlock';
import CoutParQuartierChart from '../components/visualizations/CoutParQuartierChart';
import EquipementsMap from '../components/maps/EquipementsMap';
import Tabs, { Tab, TabPanel } from '../components/ui/Tabs'; // Importer le nouveau composant Tabs
import { FiTable, FiMap, FiBarChart2, FiDownload } from 'react-icons/fi'; // Add FiDownload icon
import equipementsBannerUrl from '../assets/equipements-banner.jpg'; // <-- Importer la bannière
// --- Import Export Utils ---
import { exportToCsv, exportToXlsx, exportToPdf } from '../utils/exportUtils'; // Adjust path if needed

function EquipementsPage({ theme }) {
  // --- États (restent les mêmes) ---
  const [equipements, setEquipements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartKey, setChartKey] = useState(0); // Pour forcer la re-render du chart si besoin
  const [sortConfig, setSortConfig] = useState({ key: 'projet_nom', direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuartier, setSelectedQuartier] = useState('');
  const [minCost, setMinCost] = useState('');
  const [maxCost, setMaxCost] = useState('');

  // --- useEffect pour charger les données (reste le même) ---
  useEffect(() => {
    async function loadEquipements() {
      setIsLoading(true);
      setError(null);
      const { data, error: fetchError } = await fetchEquipements();
      if (fetchError) {
        setError(fetchError.message);
        setEquipements([]);
      } else {
        setEquipements(data || []);
        setChartKey(prevKey => prevKey + 1); // Trigger chart update if needed
      }
      setIsLoading(false);
    }
    loadEquipements();
  }, []);

  // --- Options de quartier (reste le même) ---
  const quartierOptions = useMemo(() => {
    const quartiers = new Set(equipements.map(e => e.quartier || 'Non spécifié'));
    return ['', ...Array.from(quartiers).sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }))];
  }, [equipements]);

  // --- Logique de filtrage et tri (reste la même) ---
  const filteredAndSortedEquipements = useMemo(() => {
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
        const valA = a[sortConfig.key]; const valB = b[sortConfig.key];
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

  // --- Fonctions de tri (restent les mêmes) ---
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') { direction = 'descending'; }
    setSortConfig({ key, direction });
  };
  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) { return <span className="opacity-30 ml-1">↕</span>; }
    return sortConfig.direction === 'ascending' ? <span className="opacity-80 ml-1">▲</span> : <span className="opacity-80 ml-1">▼</span>;
  };

  // --- Rendu des filtres (sera utilisé dans la Sidebar) ---
  const renderFilters = () => (
    <div className="p-4 space-y-4">
       <h3 className="text-lg font-semibold font-heading text-neutral-text-light dark:text-neutral-text-dark border-b pb-2 mb-3 border-neutral-light-sand dark:border-neutral-bg-alt-dark">
         Filtres
       </h3>
      <div>
        <label htmlFor="search-equipement" className="block text-sm font-medium text-neutral-text-muted-light dark:text-neutral-text-muted-dark mb-1">
          Rechercher par nom :
        </label>
        <input type="text" id="search-equipement" placeholder="Nom..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-2 rounded border bg-neutral-bg-light dark:bg-neutral-bg-dark border-neutral-medium-gray dark:border-neutral-bg-alt-dark focus:ring-primary focus:border-primary text-sm text-neutral-text-light dark:text-neutral-text-dark placeholder-neutral-text-muted-light dark:placeholder-neutral-text-muted-dark"/>
      </div>
      <div>
        <label htmlFor="filter-quartier" className="block text-sm font-medium text-neutral-text-muted-light dark:text-neutral-text-muted-dark mb-1">
          Filtrer par quartier :
        </label>
        <select id="filter-quartier" value={selectedQuartier} onChange={(e) => setSelectedQuartier(e.target.value)} className="w-full p-2 rounded border bg-neutral-bg-light dark:bg-neutral-bg-dark border-neutral-medium-gray dark:border-neutral-bg-alt-dark focus:ring-primary focus:border-primary text-sm text-neutral-text-light dark:text-neutral-text-dark">
          {quartierOptions.map(quartier => (
            <option key={quartier} value={quartier}>{quartier === '' ? 'Tous les quartiers' : quartier}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-text-muted-light dark:text-neutral-text-muted-dark mb-1">
          Filtrer par coût (MAD) :
        </label>
        <div className="flex space-x-2">
          <input type="number" id="filter-min-cost" placeholder="Min" min="0" value={minCost} onChange={(e) => setMinCost(e.target.value)} className="w-1/2 p-2 rounded border bg-neutral-bg-light dark:bg-neutral-bg-dark border-neutral-medium-gray dark:border-neutral-bg-alt-dark focus:ring-primary focus:border-primary text-sm text-neutral-text-light dark:text-neutral-text-dark placeholder-neutral-text-muted-light dark:placeholder-neutral-text-muted-dark"/>
          <input type="number" id="filter-max-cost" placeholder="Max" min="0" value={maxCost} onChange={(e) => setMaxCost(e.target.value)} className="w-1/2 p-2 rounded border bg-neutral-bg-light dark:bg-neutral-bg-dark border-neutral-medium-gray dark:border-neutral-bg-alt-dark focus:ring-primary focus:border-primary text-sm text-neutral-text-light dark:text-neutral-text-dark placeholder-neutral-text-muted-light dark:placeholder-neutral-text-muted-dark"/>
        </div>
      </div>
      <div className="pt-3 text-right">
        <button onClick={() => { setSearchTerm(''); setSelectedQuartier(''); setMinCost(''); setMaxCost(''); setSortConfig({ key: 'projet_nom', direction: 'ascending' }); }} disabled={!searchTerm && !selectedQuartier && !minCost && !maxCost} className="text-xs text-secondary dark:text-secondary-light hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed">
          Réinitialiser
        </button>
      </div>
    </div>
  );

  // --- Define Headers for Export ---
  // Keys must match the keys in your 'equipements' data objects
  const exportHeaders = ['projet_nom', 'quartier', 'composantes', 'cout_total'];
  // User-friendly titles for the columns
  const exportHeaderTitles = ['Nom du Projet', 'Quartier', 'Composantes', 'Coût Total (MAD)'];

  // --- Rendu du tableau (modified to be simpler here, focus on export) ---
  const renderTable = () => (
    <div className="overflow-x-auto bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-neutral-light-sand dark:divide-neutral-bg-alt-dark table-fixed">
        <thead className="bg-neutral-light-sand dark:bg-neutral-bg-alt-dark">
          <tr>
            <th scope="col" className="py-3 px-4 text-left text-xs font-medium font-heading text-neutral-text-light dark:text-neutral-text-muted-dark uppercase tracking-wider w-[30%] sm:w-[25%] cursor-pointer hover:bg-neutral-bg-alt-light dark:hover:bg-neutral-bg-alt-dark" onClick={() => requestSort('projet_nom')}>Nom {getSortIcon('projet_nom')}</th>
            <th scope="col" className="py-3 px-4 text-left text-xs font-medium font-heading text-neutral-text-light dark:text-neutral-text-muted-dark uppercase tracking-wider w-[15%] sm:w-[15%] cursor-pointer hover:bg-neutral-bg-alt-light dark:hover:bg-neutral-bg-alt-dark" onClick={() => requestSort('quartier')}>Quartier {getSortIcon('quartier')}</th>
            <th scope="col" className="py-3 px-4 text-left text-xs font-medium font-heading text-neutral-text-light dark:text-neutral-text-muted-dark uppercase tracking-wider w-[35%] sm:w-[40%]">Composantes</th>
            <th scope="col" className="py-3 px-4 text-right text-xs font-medium font-heading text-neutral-text-light dark:text-neutral-text-muted-dark uppercase tracking-wider w-[20%] sm:w-[20%] cursor-pointer hover:bg-neutral-bg-alt-light dark:hover:bg-neutral-bg-alt-dark" onClick={() => requestSort('cout_total')}>Coût (MAD) {getSortIcon('cout_total')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-bg-alt-light dark:divide-neutral-bg-alt-dark">
          {filteredAndSortedEquipements.map((equipement) => (
            <tr key={equipement.id} className="hover:bg-neutral-bg-alt-light dark:hover:bg-neutral-bg-alt-dark transition-colors duration-150">
              <td className="py-3 px-4 text-sm font-medium text-neutral-text-light dark:text-neutral-text-dark break-words">{equipement.projet_nom || 'N/A'}</td>
              <td className="py-3 px-4 text-sm text-neutral-text-muted-light dark:text-neutral-text-muted-dark break-words">{equipement.quartier || 'N/A'}</td>
              <td className="py-3 px-4 text-sm text-neutral-text-muted-light dark:text-neutral-text-muted-dark break-words">
                {equipement.composantes ? (equipement.composantes.split('\n').map((line, index) => (<span key={index} className="block">{line.trim()}</span>))) : 'N/A'}
              </td>
              <td className="py-3 px-4 text-sm text-neutral-text-muted-light dark:text-neutral-text-muted-dark text-right">
                {typeof equipement.cout_total === 'number' ? equipement.cout_total.toLocaleString('fr-MA', { style: 'currency', currency: 'MAD', minimumFractionDigits: 0, maximumFractionDigits: 0 }) : equipement.cout_total || 'N/A'}
              </td>
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
           <div className="p-4 text-center text-red-500">Erreur filtres</div>
        ) : (
            <>
                <div className="sticky top-4"> {/* Make filters sticky */}
                    {renderFilters()}
                     <p className="text-xs text-neutral-text-muted-light dark:text-neutral-text-muted-dark p-4 italic">
                        {filteredAndSortedEquipements.length} équipement(s) affiché(s).
                    </p>
                </div>
            </>
        )}
      </aside>

      {/* Main Content (Droite) */}
      <div className="w-full md:w-3/4 xl:w-4/5 md:pl-6">

        {/* Metadonnées */}
        <MetadataBlock
          title="Équipements Sportifs"
          description="Liste géolocalisée des infrastructures sportives publiques de la ville, incluant leur type et coût estimé."
          source="Commune d'Agadir - Service des Sports"
          dateMaj="2024-03-15"
          licence="Licence Ouverte v2.0"
          tags={['sport', 'stade', 'piscine', 'terrain', 'public', 'infrastructure']}
        />

        {/* Bannière Image */}
        <div className="my-6 rounded-lg overflow-hidden shadow-md"> {/* Ajout marge et style */}
          <img
              src={equipementsBannerUrl}
              alt="Bannière équipements sportifs Agadir"
              className="w-full h-40 sm:h-56 object-cover" // Ajuster hauteur si besoin
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
        ) : !equipements || equipements.length === 0 ? (
             <div className="text-center py-10 text-neutral-text-muted-light dark:text-neutral-text-muted-dark">
                Aucune donnée d'équipement disponible pour le moment.
             </div>
        ) : (
          <>
            {/* Section pour les filtres sur mobile/tablette (masquée sur md et plus) */}
            <details className="md:hidden mb-4 p-4 bg-neutral-bg-alt-light dark:bg-neutral-surface-dark rounded shadow">
                 <summary className="cursor-pointer font-semibold text-neutral-text-light dark:text-neutral-text-dark">Afficher/Masquer les Filtres</summary>
                 {renderFilters()}
                 <p className="text-xs text-neutral-text-muted-light dark:text-neutral-text-muted-dark p-4 italic">
                    {filteredAndSortedEquipements.length} équipement(s) affiché(s).
                 </p>
             </details>

            {/* Onglets pour les visualisations */}
            <Tabs>
              {/* Définition des onglets avec icônes */}
              <Tab label="Tableau" icon={<FiTable className="inline-block w-4 h-4 mr-1" />} />
              <Tab label="Carte" icon={<FiMap className="inline-block w-4 h-4 mr-1" />} />
              <Tab label="Analyse" icon={<FiBarChart2 className="inline-block w-4 h-4 mr-1" />} /> {/* Simplifié le label */}

              {/* Panneau 1: Tableau */}
              <TabPanel>
                <div className="my-4 flex flex-wrap gap-2 justify-end">
                  <button
                    onClick={() => exportToCsv(filteredAndSortedEquipements, exportHeaders, exportHeaderTitles, 'equipements_agadir.csv')}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-primary dark:bg-primary-dark rounded shadow hover:bg-primary-light dark:hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-150 ease-in-out disabled:opacity-50"
                    disabled={filteredAndSortedEquipements.length === 0}
                    title="Exporter en CSV"
                  >
                    <FiDownload className="inline-block w-3 h-3 mr-1" /> CSV
                  </button>
                  <button
                    onClick={() => exportToXlsx(filteredAndSortedEquipements, exportHeaders, exportHeaderTitles, 'equipements_agadir.xlsx', 'Équipements')}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 dark:bg-green-700 rounded shadow hover:bg-green-500 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition duration-150 ease-in-out disabled:opacity-50"
                    disabled={filteredAndSortedEquipements.length === 0}
                    title="Exporter en Excel"
                  >
                    <FiDownload className="inline-block w-3 h-3 mr-1" /> XLSX
                  </button>
                  <button
                    onClick={() => exportToPdf(filteredAndSortedEquipements, exportHeaders, exportHeaderTitles, 'equipements_agadir.pdf', 'Liste des Équipements Sportifs - Agadir')}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 dark:bg-red-700 rounded shadow hover:bg-red-500 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition duration-150 ease-in-out disabled:opacity-50"
                    disabled={filteredAndSortedEquipements.length === 0}
                    title="Exporter en PDF"
                  >
                    <FiDownload className="inline-block w-3 h-3 mr-1" /> PDF
                  </button>
                </div>
                {filteredAndSortedEquipements.length > 0 ? (
                  renderTable()
                ) : (
                  <p className="text-center py-10 text-neutral-text-muted-light dark:text-neutral-text-muted-dark">
                    Aucun équipement ne correspond aux filtres sélectionnés.
                  </p>
                )}
              </TabPanel>

              {/* Panneau 2: Carte */}
              <TabPanel>
                {filteredAndSortedEquipements.length > 0 ? (
                  <EquipementsMap equipements={filteredAndSortedEquipements} />
                ) : (
                  <p className="text-center py-10 text-neutral-text-muted-light dark:text-neutral-text-muted-dark">
                    Aucun équipement à afficher sur la carte avec les filtres actuels.
                  </p>
                )}
              </TabPanel>

              {/* Panneau 3: Graphique */}
              <TabPanel>
                 <p className="text-xs text-neutral-text-muted-light dark:text-neutral-text-muted-dark mb-2 italic">
                    Note : Le graphique montre le coût total par quartier pour *tous* les équipements, indépendamment des filtres de coût appliqués.
                 </p>
                <CoutParQuartierChart key={chartKey} equipements={equipements} theme={theme} />
              </TabPanel>
            </Tabs>
          </>
        )}

        {/* Lien Retour Accueil */}
        <div className="mt-10 text-left"> {/* Changé pour text-left */}
            <Link to="/catalogue" className="inline-block bg-secondary hover:bg-secondary-light text-neutral-charcoal font-semibold px-6 py-2 rounded-lg transition-colors duration-200">
                ← Retour au Catalogue
            </Link>
        </div>
      </div>
    </div>
  );
}

export default EquipementsPage;

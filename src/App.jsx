import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import { fetchEquipements } from './services/equipementService';
import ThemeToggle from './components/ThemeToggle';
import CoutParQuartierChart from './components/visualizations/CoutParQuartierChart';

// Créez des composants simples pour les pages
function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-heading font-bold text-neutral-text-light dark:text-neutral-text-dark mb-4">
        Portail des Données Ouvertes d'Agadir
      </h1>
      <p className="text-xl font-body text-neutral-text-muted-light dark:text-neutral-text-muted-dark">
        Découvrez les données ouvertes de la ville d'Agadir
      </p>
      <Link
        to="/equipements"
        className="mt-6 inline-block bg-primary hover:bg-primary-light text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
      >
        Explorer les Équipements
      </Link>
    </div>
  );
}

function EquipementsPage() {
  const [equipements, setEquipements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Add a state variable to trigger chart re-render if needed
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    async function loadEquipements() {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await fetchEquipements(); // Renamed error variable

      if (fetchError) {
        setError(fetchError.message);
        setEquipements([]);
      } else {
        setEquipements(data || []);
        // Update chart key to potentially force re-render after data is loaded
        setChartKey(prevKey => prevKey + 1);
      }
      setIsLoading(false);
    }

    loadEquipements();
  }, []); // Empty dependency array ensures this runs only once on mount

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
          onClick={loadEquipements} // Removed () => loadEquipements() as it's not needed here
          className="mt-4 inline-block bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
        >
          Réessayer
        </button>
      </div>
    );
  } else if (equipements.length === 0) {
    content = (
      <div className="text-center">
        <p className="text-neutral-text-muted-light dark:text-neutral-text-muted-dark text-lg font-body">
          Aucun équipement trouvé.
        </p>
      </div>
    );
  } else {
    content = (
      <>
        <div className="overflow-x-auto">
          {/* Updated table styles */}
          <table className="min-w-full bg-neutral-surface-light dark:bg-neutral-surface-dark border border-secondary-dark dark:border-neutral-medium-gray table-auto">
            {/* Updated thead styles */}
            <thead className="bg-neutral-light-sand dark:bg-neutral-bg-alt-dark">
              <tr>
                {/* Updated th styles */}
                <th className="py-2 px-4 border-b text-left text-sm font-heading text-neutral-text-light dark:text-neutral-text-dark sticky top-0 bg-neutral-light-sand dark:bg-neutral-bg-alt-dark z-10">
                  Nom du Projet
                </th>
                <th className="py-2 px-4 border-b text-left text-sm font-heading text-neutral-text-light dark:text-neutral-text-dark sticky top-0 bg-neutral-light-sand dark:bg-neutral-bg-alt-dark z-10">
                  Quartier
                </th>
                <th className="py-2 px-4 border-b text-left text-sm font-heading text-neutral-text-light dark:text-neutral-text-dark sticky top-0 bg-neutral-light-sand dark:bg-neutral-bg-alt-dark z-10">
                  Composantes
                </th>
                <th className="py-2 px-4 border-b text-right text-sm font-heading text-neutral-text-light dark:text-neutral-text-dark sticky top-0 bg-neutral-light-sand dark:bg-neutral-bg-alt-dark z-10">
                  Coût Total (Dhs)
                </th>
              </tr>
            </thead>
            <tbody>
              {equipements.map((equipement) => (
                // Updated tr styles
                <tr
                  key={equipement.id}
                  className="hover:bg-neutral-bg-alt-light dark:hover:bg-neutral-bg-alt-dark border-b border-secondary-dark dark:border-neutral-medium-gray"
                >
                  {/* Updated td styles */}
                  <td className="py-2 px-4 text-sm font-body text-neutral-text-light dark:text-neutral-text-dark">
                    {equipement.projet_nom || 'N/A'}
                  </td>
                  <td className="py-2 px-4 text-sm font-body text-neutral-text-light dark:text-neutral-text-dark">
                    {equipement.quartier || 'N/A'}
                  </td>
                  <td className="py-2 px-4 text-sm font-body text-neutral-text-light dark:text-neutral-text-dark">
                    {/* Line break handling */}
                    {equipement.composantes ? (
                      equipement.composantes.split('\\n').map((line, index) => (
                        <span key={index} className="block">{line.trim()}</span>
                      ))
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="py-2 px-4 text-sm font-body text-neutral-text-light dark:text-neutral-text-dark text-right">
                    {typeof equipement.cout_total === 'number'
                      ? equipement.cout_total.toLocaleString('fr-MA', { style: 'currency', currency: 'MAD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : equipement.cout_total || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pass key to chart to force re-render */}
        <CoutParQuartierChart key={chartKey} equipements={equipements} />
      </>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-heading font-bold text-neutral-text-light dark:text-neutral-text-dark mb-4">
        Équipements Sportifs
      </h2>
      {content}
      <Link
        to="/"
        className="mt-4 inline-block bg-secondary hover:bg-secondary-light text-neutral-charcoal font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}


function NotFoundPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-heading font-bold text-neutral-text-light dark:text-neutral-text-dark mb-4">
        Page non trouvée
      </h2>
      <p className="text-neutral-text-muted-light dark:text-neutral-text-muted-dark mb-4">
        La page que vous recherchez n'existe pas.
      </p>
      <Link
        to="/"
        className="inline-block bg-primary hover:bg-primary-light text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-bg-light dark:bg-neutral-bg-dark transition-colors duration-200">
        <nav className="bg-primary dark:bg-neutral-surface-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link
                  to="/"
                  className="flex items-center text-white hover:text-white font-semibold"
                >
                  <span className="text-xl font-heading">Portail Opendata Agadir</span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/equipements" element={<EquipementsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <footer className="bg-neutral-surface-light dark:bg-neutral-surface-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-neutral-text-muted-light dark:text-neutral-text-muted-dark text-center">
              {new Date().getFullYear()} Portail Opendata Agadir. Tous droits réservés.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
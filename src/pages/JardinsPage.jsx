import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchJardins } from '../services/jardinService';
import JardinsMap from '../components/maps/JardinsMap';

// Helper to parse equipements string
const parseEquipements = (equipementsString) => {
    if (!equipementsString) return [];
    return equipementsString.split('\n').map(e => e.trim()).filter(e => e);
};

function JardinsPage({ theme }) {
  const [jardins, setJardins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadJardins() {
      setIsLoading(true);
      setError(null);
      const { data, error: fetchError } = await fetchJardins();
      if (fetchError) {
        setError(fetchError.message);
        setJardins([]);
      } else {
        setJardins(data || []);
      }
      setIsLoading(false);
    }
    loadJardins();
  }, []);

  const filteredJardins = useMemo(() => {
    return jardins;
  }, [jardins]);

  let content;
  if (isLoading) {
    content = <div className="flex justify-center items-center p-10"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  } else if (error) {
    content = <div className="text-center text-red-500 p-10">Erreur: {error}</div>;
  } else if (filteredJardins.length === 0) {
    content = <div className="text-center text-neutral-text-muted-light dark:text-neutral-text-muted-dark p-10">Aucun jardin trouvé.</div>;
  } else {
    content = (
      <div className="space-y-8">
        {/* Map Display */}
        <div>
          <h3 className="text-2xl font-heading font-semibold text-neutral-text-light dark:text-neutral-text-dark mb-4">
            Carte des Jardins ({filteredJardins.length})
          </h3>
          <JardinsMap jardins={filteredJardins} />
        </div>

        {/* Cards Display */}
        <div>
          <h3 className="text-2xl font-heading font-semibold text-neutral-text-light dark:text-neutral-text-dark mb-4">
            Liste des Jardins ({filteredJardins.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJardins.map(jardin => (
              <div key={jardin.id} className="bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-lg shadow-md overflow-hidden flex flex-col">
                {/* Image */}
                {jardin.image_url && (
                  <img src={jardin.image_url} alt={`Image de ${jardin.nom}`} className="w-full h-48 object-cover" />
                )}
                {/* Card Body */}
                <div className="p-4 flex flex-col flex-grow">
                  <h4 className="text-lg font-heading font-bold text-primary dark:text-primary-light mb-2">{jardin.nom}</h4>
                  <p className="text-sm font-body text-neutral-text-light dark:text-neutral-text-dark mb-3 flex-grow">
                    {jardin.description}
                  </p>
                  {/* Details Section */}
                  <div className="text-xs border-t border-neutral-light-sand dark:border-neutral-bg-alt-dark pt-3 mt-auto space-y-1">
                    <p><strong className="font-semibold">Quartier:</strong> {jardin.quartier || 'N/A'}</p>
                    <p><strong className="font-semibold">Horaires:</strong> {jardin.horaires || 'N/A'}</p>
                    {parseEquipements(jardin.equipements).length > 0 && (
                      <div>
                        <strong className="font-semibold">Équipements:</strong>
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
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-heading font-bold text-neutral-text-light dark:text-neutral-text-dark mb-6">
        Jardins Publics d'Agadir
      </h2>
      {content}
      <div className="mt-10 text-center">
        <Link to="/" className="inline-block bg-secondary hover:bg-secondary-light text-neutral-charcoal font-semibold px-6 py-2 rounded-lg transition-colors duration-200">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

export default JardinsPage;

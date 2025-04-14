import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import DatasetCardCatalog from '../components/datasets/DatasetCardCatalog'; // Importer la carte catalogue

// Données simulées pour les datasets (sera remplacé par des données dynamiques plus tard)
// Ces métadonnées sont juste des exemples pour remplir les cartes
const allDatasets = [
  {
    id: 1,
    title: 'Équipements Sportifs',
    description: 'Liste géolocalisée des infrastructures sportives publiques de la ville, incluant leur type et coût.',
    theme: 'Infrastructures',
    keywords: ['sport', 'stade', 'piscine', 'terrain', 'public'],
    lastUpdated: '2024-03-15',
    views: { table: true, map: true, chart: true }, // Indique les vues disponibles
    linkTo: '/equipements',
  },
  {
    id: 2,
    title: 'Hôtels Classés',
    description: 'Répertoire des hôtels classés sur le territoire d\'Agadir, avec leur classement, adresse et coordonnées.',
    theme: 'Tourisme',
    keywords: ['hébergement', 'hôtel', 'classement', 'tourisme'],
    lastUpdated: '2024-04-01',
    views: { table: true, map: true, chart: true },
    linkTo: '/hotels',
  },
  {
    id: 3,
    title: 'Jardins Publics',
    description: 'Localisation et informations sur les parcs et jardins publics accessibles à Agadir.',
    theme: 'Environnement',
    keywords: ['parc', 'jardin', 'vert', 'espace public', 'nature'],
    lastUpdated: '2024-02-20',
    views: { table: false, map: true, chart: false }, // Note: table=false, chart=false
    linkTo: '/jardins',
  },
  {
    id: 4,
    title: 'Lignes de Bus Urbain',
    description: 'Tracés et détails des lignes du réseau de bus urbain Alsa Agadir.',
    theme: 'Transport',
    keywords: ['bus', 'transport', 'mobilité', 'Alsa', 'urbain'],
    lastUpdated: '2023-12-10',
    views: { table: true, map: false, chart: false }, // Note: map=false, chart=false
    linkTo: '/lignes-bus',
  },
  // Ajouter d'autres datasets ici si nécessaire
];

function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrage basique côté client basé sur le terme de recherche
  const filteredDatasets = useMemo(() => {
    if (!searchTerm) {
      return allDatasets;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return allDatasets.filter(dataset =>
      dataset.title.toLowerCase().includes(lowerSearchTerm) ||
      dataset.description.toLowerCase().includes(lowerSearchTerm) ||
      (dataset.keywords && dataset.keywords.some(kw => kw.toLowerCase().includes(lowerSearchTerm)))
    );
  }, [searchTerm]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-heading font-bold text-neutral-text-light dark:text-neutral-text-dark mb-6">
        Catalogue des Jeux de Données
      </h2>

      {/* Barre de recherche */}
      <div className="mb-8">
        <label htmlFor="search-catalog" className="sr-only">Rechercher dans le catalogue</label>
        <input
          type="search"
          id="search-catalog"
          placeholder="Rechercher par titre, description ou mot-clé..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-md border bg-neutral-surface-light dark:bg-neutral-surface-dark border-neutral-medium-gray dark:border-neutral-bg-alt-dark focus:ring-primary focus:border-primary text-base text-neutral-text-light dark:text-neutral-text-dark placeholder-neutral-text-muted-light dark:placeholder-neutral-text-muted-dark"
        />
      </div>

      {/* Affichage du nombre de résultats */}
       <p className="text-sm text-neutral-text-muted-light dark:text-neutral-text-muted-dark mb-6 italic">
         {filteredDatasets.length} jeu(x) de données trouvé(s).
       </p>

      {/* Grille des datasets */}
      {filteredDatasets.length > 0 ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {filteredDatasets.map((dataset) => (
             <DatasetCardCatalog
               key={dataset.id}
               title={dataset.title}
               description={dataset.description}
               theme={dataset.theme}
               keywords={dataset.keywords}
               lastUpdated={dataset.lastUpdated}
               views={dataset.views}
               linkTo={dataset.linkTo}
             />
           ))}
         </div>
       ) : (
         <div className="text-center py-10">
            <p className="text-lg font-medium text-neutral-text-light dark:text-neutral-text-dark">
               Aucun jeu de données ne correspond à votre recherche.
            </p>
         </div>
       )}

       {/* Lien retour accueil */}
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

export default CatalogPage;

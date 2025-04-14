import React from 'react';
import { Link } from 'react-router-dom';
import DatasetCardHome from '../components/datasets/DatasetCardHome'; 
// --- Importer les icônes ---
import { FiDatabase, FiMapPin, FiHome, FiCompass, FiBarChart2, FiInfo, FiLayers, FiUsers, FiEye, FiFileText } from 'react-icons/fi';
import { HiOutlineBuildingOffice2, HiOutlineSparkles, HiOutlineUserGroup, HiOutlineGlobeAlt } from "react-icons/hi2"; // Heroicons v2 Outline

// --- Importer l'image de fond ---
import heroImageUrl from '../assets/agadir-hero.jpg'; // Chemin vers ton image

// Données simulées pour les datasets affichés sur l'accueil
const featuredDatasets = [
  {
    id: 1,
    title: 'Équipements Sportifs',
    icon: <FiCompass />, // Icône pour sport/exploration
    linkTo: '/equipements',
  },
  {
    id: 2,
    title: 'Hôtels Classés',
    icon: <HiOutlineBuildingOffice2 />, // Icône bâtiment/hôtel
    linkTo: '/hotels',
  },
  {
    id: 3,
    title: 'Jardins Publics',
    icon: <FiMapPin />, // Icône localisation/parc
    linkTo: '/jardins',
  },
  {
    id: 4,
    title: 'Lignes de Bus',
    icon: <FiLayers />, // Icône pour réseau/lignes
    linkTo: '/lignes-bus',
  },
  // On pourrait ajouter d'autres datasets ici à l'avenir
];

// Données simulées pour les thèmes
const themes = [
    { id: 'infra', name: 'Infrastructures', icon: <FiHome />, link: '/catalogue?theme=infra' },
    { id: 'tourisme', name: 'Tourisme', icon: <HiOutlineGlobeAlt />, link: '/catalogue?theme=tourisme' },
    { id: 'environnement', name: 'Environnement', icon: <FiMapPin />, link: '/catalogue?theme=env' }, // Réutiliser FiMapPin
    { id: 'transport', name: 'Transport', icon: <FiCompass />, link: '/catalogue?theme=transport' }, // Réutiliser FiCompass
]

function HomePage() {
  return (
    <div className="w-full text-neutral-text-light dark:text-neutral-text-dark">
      {/* Section Héros */}
      <section
        className="relative bg-cover bg-center py-20 sm:py-28 px-4 sm:px-6 lg:px-8 text-center text-white overflow-hidden" // Ajout de classes pour l'image
        style={{ backgroundImage: `url(${heroImageUrl})` }} // Image de fond
      >
        {/* Overlay semi-transparent pour améliorer la lisibilité du texte */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>

         {/* Contenu au-dessus de l'overlay */}
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-shadow-md"> {/* Ajout text-shadow */}
            Portail Open Data d'Agadir
          </h1>
          <p className="text-xl md:text-2xl font-body mb-8 max-w-3xl mx-auto text-shadow-sm"> {/* Ajout text-shadow */}
            Explorez, visualisez et téléchargez les données ouvertes mises à disposition par la Commune d'Agadir.
          </p>
          {/* Barre de recherche */}
          <div className="max-w-xl mx-auto">
            <input
              type="search"
              placeholder="Rechercher un jeu de données..."
              disabled
              className="w-full p-3 rounded-md border border-gray-300 dark:border-neutral-bg-alt-dark bg-white/90 dark:bg-neutral-surface-dark/90 text-neutral-text-light dark:text-neutral-text-dark placeholder-neutral-text-muted-light dark:placeholder-neutral-text-muted-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-accent shadow-lg" // Ajout shadow, ajustement opacité fond
              aria-label="Rechercher un jeu de données (désactivé)"
            />
            <p className="text-xs mt-2 text-white/80">(Recherche globale bientôt disponible)</p>
          </div>
        </div>
      </section>

      {/* Section Chiffres Clés (Simulée) */}
      <section className="py-12 bg-neutral-bg-alt-light dark:bg-neutral-bg-dark px-4 sm:px-6 lg:px-8">
         <h2 className="text-2xl font-heading font-semibold text-center mb-8 text-neutral-text-light dark:text-neutral-text-dark">
           Le portail en chiffres
         </h2>
         <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
           <div className="p-4 bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-lg shadow">
             <FiDatabase className="mx-auto text-3xl text-primary dark:text-primary-light mb-1" />
             <div className="text-xl font-bold text-neutral-text-light dark:text-neutral-text-dark">4</div>
             <div className="text-xs text-neutral-text-muted-light dark:text-neutral-text-muted-dark mt-1 uppercase tracking-wider">Jeux de données</div>
           </div>
           <div className="p-4 bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-lg shadow">
             <FiLayers className="mx-auto text-3xl text-primary dark:text-primary-light mb-1" />
             <div className="text-xl font-bold text-neutral-text-light dark:text-neutral-text-dark">{themes.length}</div>
             <div className="text-xs text-neutral-text-muted-light dark:text-neutral-text-muted-dark mt-1 uppercase tracking-wider">Thématiques</div>
           </div>
           <div className="p-4 bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-lg shadow">
             <FiEye className="mx-auto text-3xl text-primary dark:text-primary-light mb-1" />
             <div className="text-xl font-bold text-neutral-text-light dark:text-neutral-text-dark">10k+</div>
             <div className="text-xs text-neutral-text-muted-light dark:text-neutral-text-muted-dark mt-1 uppercase tracking-wider">Vues (Simulé)</div>
           </div>
            <div className="p-4 bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-lg shadow">
             <FiFileText className="mx-auto text-3xl text-primary dark:text-primary-light mb-1" />
             <div className="text-xl font-bold text-neutral-text-light dark:text-neutral-text-dark">1</div>
             <div className="text-xs text-neutral-text-muted-light dark:text-neutral-text-muted-dark mt-1 uppercase tracking-wider">Source</div>
           </div>
         </div>
       </section>

      {/* Section Catalogue par Thème (FOND MODIFIÉ + styles carte ajustés) */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-neutral-bg-alt-light dark:bg-neutral-surface-dark">
         <h2 className="text-2xl font-heading font-semibold text-center mb-8 text-neutral-text-light dark:text-neutral-text-dark">
           Explorer par Thème
         </h2>
         <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
             {themes.map((theme) => (
                 <Link
                     key={theme.id}
                     to={'/catalogue'}
                     className="block p-6 text-center bg-white dark:bg-neutral-bg-dark rounded-lg shadow hover:shadow-lg transition-shadow duration-200 border border-neutral-light-sand dark:border-neutral-bg-alt-dark"
                     aria-label={`Explorer le thème ${theme.name}`}
                 >
                     {/* Icône plus grande ici */}
                     <div className="text-4xl mb-3 text-primary dark:text-primary-light">{theme.icon}</div>
                     <div className="font-semibold font-body text-neutral-text-light dark:text-neutral-text-dark">{theme.name}</div>
                     {/* On pourrait ajouter le nombre de datasets par thème plus tard */}
                 </Link>
             ))}
         </div>
         <div className="text-center mt-8">
             <Link to="/catalogue" className="inline-block bg-primary hover:bg-primary-light text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200">
                 Voir tout le catalogue
             </Link>
         </div>
      </section>


      {/* Section Nos Jeux de Données */}
      <section className="py-12 bg-neutral-bg-alt-light dark:bg-neutral-bg-dark px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-heading font-semibold text-center mb-8 text-neutral-text-light dark:text-neutral-text-dark">
          Nos Jeux de Données en Vedette
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDatasets.map((dataset) => (
            <DatasetCardHome
              key={dataset.id}
              title={dataset.title}
              icon={dataset.icon}
              linkTo={dataset.linkTo}
            />
          ))}
        </div>
      </section>

    </div>
  );
}

export default HomePage;

// src/pages/AboutPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// --- Importer les icônes ---
import { FiInfo, FiTarget, FiMousePointer, FiAward, FiMail, FiHelpCircle } from 'react-icons/fi';
import { HiOutlineNewspaper, HiOutlineSparkles, HiOutlineUserGroup } from 'react-icons/hi2'; // Utiliser HiOutline pour la licence et autres
import aboutIllustrationUrl from '../assets/about-illustration.png'; // <-- Importer l'illustration

function AboutPage() {
  return (
    <div className="bg-neutral-bg-light dark:bg-neutral-bg-dark text-neutral-text-light dark:text-neutral-text-dark">
      {/* Section Héros */}
      <div className="bg-gradient-to-r from-primary to-primary-dark dark:from-neutral-bg-dark dark:to-neutral-surface-dark py-12 sm:py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-heading font-bold text-white mb-4">
          À Propos du Portail Open Data d'Agadir
        </h1>
        <p className="text-lg text-neutral-soft-white max-w-3xl mx-auto font-body">
          Notre engagement pour la transparence, l'innovation et la participation citoyenne à travers le partage des données publiques.
        </p>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">

        {/* Section 1: Qu'est-ce que l'Open Data ? */}
        <section className="flex flex-col md:flex-row items-center gap-8 md:gap-12"> {/* Augmenté gap */}
          <div className="md:w-2/3">
            <h2 className="flex items-center text-3xl font-heading font-semibold text-primary dark:text-primary-light mb-4">
              <FiInfo className="w-7 h-7 mr-3 flex-shrink-0" /> Qu'est-ce que l'Open Data ? {/* Ajouté flex-shrink-0 */}
            </h2>
            <div className="space-y-4 font-body text-base md:text-lg leading-relaxed">
              <p>
                L'Open Data, ou donnée ouverte, désigne la pratique de rendre accessibles et réutilisables les données produites ou collectées par une organisation (ici, la Commune d'Agadir), sans restriction technique, juridique ou financière.
              </p>
              <p>
                Il s'agit d'une démarche de transparence qui permet à chacun – citoyens, entreprises, chercheurs, développeurs – de consulter, d'analyser et de créer de nouveaux services ou connaissances à partir de ces informations publiques. Les données sont généralement partagées dans des formats standards et sous des licences ouvertes qui en autorisent la libre réutilisation.
              </p>
            </div>
          </div>
          {/* Remplacement de l'icône par l'image importée */}
          <div className="md:w-1/3 text-center flex items-center justify-center mt-6 md:mt-0">
            <img
              src={aboutIllustrationUrl}
              alt="Illustration conceptuelle de données ouvertes connectées"
              className="w-full max-w-[250px] sm:max-w-xs mx-auto rounded-lg object-contain" // Ajusté max-width et ajouté object-contain
            />
          </div>
        </section>

        {/* Section 2: Nos Objectifs */}
         <section className="bg-neutral-bg-alt-light dark:bg-neutral-surface-dark p-8 rounded-lg shadow-lg">
           <h2 className="flex items-center justify-center text-3xl font-heading font-semibold text-primary dark:text-primary-light mb-6 text-center">
             <FiTarget className="w-7 h-7 mr-3" /> Nos Objectifs pour Agadir
           </h2>
           <div className="grid md:grid-cols-3 gap-6 text-center">
             <div className="p-4">
               <FiHelpCircle className="mx-auto text-4xl text-accent dark:text-accent-light mb-3" /> {/* Transparence / Information */}
               <h3 className="text-xl font-semibold font-heading mb-2">Transparence Accrue</h3>
               <p className="text-sm font-body text-neutral-text-muted-light dark:text-neutral-text-muted-dark">
                 Rendre compte de l'action municipale et permettre aux citoyens de mieux comprendre le fonctionnement de leur ville.
               </p>
             </div>
             <div className="p-4">
                <HiOutlineSparkles className="mx-auto text-4xl text-accent dark:text-accent-light mb-3" /> {/* Innovation */}
               <h3 className="text-xl font-semibold font-heading mb-2">Innovation & Développement</h3>
               <p className="text-sm font-body text-neutral-text-muted-light dark:text-neutral-text-muted-dark">
                 Stimuler la création de nouveaux services, applications et opportunités économiques basés sur les données locales.
               </p>
             </div>
             <div className="p-4">
                <HiOutlineUserGroup className="mx-auto text-4xl text-accent dark:text-accent-light mb-3" /> {/* Participation */}
               <h3 className="text-xl font-semibold font-heading mb-2">Participation Citoyenne</h3>
               <p className="text-sm font-body text-neutral-text-muted-light dark:text-neutral-text-muted-dark">
                 Fournir aux habitants les informations nécessaires pour contribuer activement au débat public et à la vie locale.
               </p>
             </div>
           </div>
         </section>

        {/* Section 3: Comment Utiliser ce Portail ? */}
        <section>
          <h2 className="flex items-center text-3xl font-heading font-semibold text-primary dark:text-primary-light mb-6">
            <FiMousePointer className="w-7 h-7 mr-3" /> Comment Utiliser ce Portail ?
          </h2>
          <div className="space-y-4 font-body text-base md:text-lg leading-relaxed">
            <p>
              Ce portail est conçu pour être simple et intuitif. Voici comment vous pouvez interagir avec les données :
            </p>
            <ul className="list-disc list-outside space-y-2 pl-6 marker:text-primary dark:marker:text-primary-light">
              <li>
                <strong>Explorer le Catalogue :</strong> Parcourez la <Link to="/catalogue" className="text-primary dark:text-primary-light font-medium hover:underline">page Catalogue</Link> pour découvrir tous les jeux de données disponibles. Utilisez la barre de recherche pour trouver des données spécifiques par mots-clés.
              </li>
              <li>
                <strong>Consulter les Détails :</strong> Cliquez sur un jeu de données pour accéder à sa page dédiée. Vous y trouverez une description complète, les métadonnées (source, date, licence) et différentes options d'exploration.
              </li>
              <li>
                <strong>Visualiser :</strong> La plupart des jeux de données proposent des visualisations intégrées :
                <ul className='list-[circle] list-outside pl-6 mt-1 space-y-1 text-sm'>
                    <li><span className="font-semibold">Tableau :</span> Consultez les données brutes dans un tableau interactif avec tri et filtres.</li>
                    <li><span className="font-semibold">Carte :</span> Visualisez les données géolocalisées sur une carte interactive (si applicable).</li>
                    <li><span className="font-semibold">Graphique :</span> Explorez des analyses visuelles comme des répartitions ou des évolutions (si applicable).</li>
                </ul>
              </li>
              <li>
                <strong>Télécharger (Prochainement) :</strong> Bientôt, vous pourrez télécharger les données dans différents formats (CSV, JSON) pour une utilisation hors ligne.
              </li>
               <li>
                <strong>API (Prochainement) :</strong> Un accès programmatique via API sera mis à disposition pour les développeurs souhaitant intégrer ces données dans leurs propres applications.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4: Licence d'Utilisation */}
        <section className="bg-neutral-surface-light dark:bg-neutral-surface-dark p-8 rounded-lg shadow border border-secondary dark:border-neutral-bg-alt-dark">
          <h2 className="flex items-center text-2xl font-heading font-semibold text-primary dark:text-primary-light mb-4">
            <HiOutlineNewspaper className="w-6 h-6 mr-3" /> Licence d'Utilisation
          </h2>
          <div className="space-y-3 font-body text-sm">
            <p>
              Sauf mention contraire spécifiée sur la page du jeu de données, les informations publiées sur ce portail sont mises à disposition sous les termes de la <a href="https://www.etalab.gouv.fr/licence-ouverte-open-licence/" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline text-primary-dark dark:text-secondary-light">Licence Ouverte v2.0 d'Etalab</a>.
            </p>
            <p>
              Cette licence vous autorise à réutiliser librement les données, y compris à des fins commerciales, sous réserve de mentionner la source ("Commune d'Agadir" et la date de mise à jour des données). Nous vous encourageons vivement à partager vos réutilisations !
            </p>
             <p className="text-xs italic text-neutral-text-muted-light dark:text-neutral-text-muted-dark">
                Note : Certains jeux de données spécifiques pourraient être soumis à d'autres licences. Vérifiez toujours les métadonnées associées.
             </p>
          </div>
        </section>

        {/* Section 5: Contact & Contribution */}
        <section className="text-center">
          <h2 className="flex items-center justify-center text-3xl font-heading font-semibold text-primary dark:text-primary-light mb-6">
            <FiMail className="w-7 h-7 mr-3" /> Contact & Contribution
          </h2>
          <div className="space-y-4 font-body max-w-2xl mx-auto">
            <p>
              Ce portail est en constante évolution. Vos retours, suggestions ou questions sont précieux !
            </p>
            <p>
              Si vous identifiez une erreur, souhaitez suggérer l'ouverture d'un nouveau jeu de données, ou avez besoin d'aide, n'hésitez pas à nous contacter (méthode de contact à définir).
            </p>
            {/* Placeholder pour un bouton ou lien de contact */}
            <div className="pt-4">
                 <button disabled className="bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 disabled:opacity-60">
                    Formulaire de Contact (Bientôt)
                 </button>
            </div>
          </div>
        </section>

      </div>

        {/* Lien retour Catalogue */}
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 text-center">
         <Link
            to="/catalogue"
            className="inline-block bg-secondary hover:bg-secondary-light text-neutral-charcoal font-semibold px-6 py-2 rounded-lg transition-colors duration-200 text-sm"
         >
            ← Explorer le Catalogue
         </Link>
       </div>

    </div>
  );
}

export default AboutPage;

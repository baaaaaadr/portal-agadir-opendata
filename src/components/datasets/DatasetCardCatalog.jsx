import React from 'react';
import { Link } from 'react-router-dom';
import { FiTable, FiMap, FiBarChart2 } from 'react-icons/fi';

function DatasetCardCatalog({ title, description, theme, keywords, lastUpdated, views, linkTo }) {
  // Contenu simple pour l'instant
  return (
    <div className="p-4 border rounded-lg shadow bg-neutral-surface-light dark:bg-neutral-surface-dark flex flex-col h-full hover:shadow-md transition-shadow duration-200">
      <h3 className="text-lg font-semibold font-heading mb-2 text-neutral-text-light dark:text-neutral-text-dark">{title}</h3>
      <p className="text-sm text-neutral-text-muted-light dark:text-neutral-text-muted-dark mb-3 flex-grow">
        {description}
      </p>
      {/* Placeholder pour les métadonnées et icônes */}
      <div className="text-xs text-neutral-text-muted-light dark:text-neutral-text-muted-dark mt-auto pt-2 border-t border-neutral-light-sand dark:border-neutral-bg-alt-dark">
        <p>Thème: {theme || 'N/A'} | Maj: {lastUpdated || 'N/A'}</p>
        {/* Afficher les icônes des vues disponibles */}
        <div className="mt-2 flex items-center space-x-2 pt-1">
          <span className="font-medium text-[11px]">Vues:</span>
          {views?.table && <FiTable className="w-4 h-4" title="Tableau disponible" />}
          {views?.map && <FiMap className="w-4 h-4" title="Carte disponible" />}
          {views?.chart && <FiBarChart2 className="w-4 h-4" title="Graphique disponible" />}
        </div>
      </div>
      <Link
        to={linkTo}
        className="inline-block mt-3 text-sm font-medium text-primary dark:text-primary-light hover:underline self-start"
      >
        Voir les détails
      </Link>
    </div>
  );
}

export default DatasetCardCatalog;

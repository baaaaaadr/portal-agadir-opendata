import React from 'react';
import { Link } from 'react-router-dom'; 
import { FiDatabase } from 'react-icons/fi'; 

function DatasetCardHome({ title, icon, linkTo }) {
  // Contenu simple pour l'instant
  return (
    // Assurer l'utilisation de surface-light/dark, border, et shadow
    <div className="p-4 border border-neutral-light-sand dark:border-neutral-bg-alt-dark rounded-lg shadow bg-neutral-surface-light dark:bg-neutral-surface-dark hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      {/* Utiliser l'icône passée en prop ou l'icône par défaut */}
      <div className="text-3xl mb-3 text-primary dark:text-primary-light">
        {icon ? icon : <FiDatabase />}
      </div>
      <h3 className="text-lg font-semibold font-heading mb-2 text-neutral-text-light dark:text-neutral-text-dark flex-grow">{title}</h3>
      <Link
        to={linkTo}
        className="inline-block text-sm font-medium text-primary dark:text-primary-light hover:underline"
      >
        Explorer
      </Link>
    </div>
  );
}

export default DatasetCardHome;

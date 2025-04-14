import React from 'react';

function MetadataBlock({ title, description, source, dateMaj, licence, tags }) {
  // Contenu simple pour l'instant
  return (
    <div className="p-4 sm:p-6 border border-secondary dark:border-neutral-bg-alt-dark rounded-lg shadow-sm bg-neutral-bg-alt-light dark:bg-neutral-surface-dark mb-8"> 
      <h2 className="text-2xl md:text-3xl font-bold font-heading mb-3 text-neutral-text-light dark:text-neutral-text-dark">{title}</h2>
      <p className="text-base font-body mb-4 text-neutral-text-light dark:text-neutral-text-dark">{description}</p> 
      <div className="text-sm space-y-1 text-neutral-text-muted-light dark:text-neutral-text-muted-dark border-t border-secondary-dark dark:border-neutral-bg-alt-dark pt-3">
        <p><strong>Source:</strong> {source || 'N/A'}</p>
        <p><strong>Dernière mise à jour:</strong> {dateMaj || 'N/A'}</p>
        <p><strong>Licence:</strong> {licence || 'Licence Ouverte (Simulation)'}</p> 
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
             <strong>Tags:</strong>
             {tags.map(tag => (
                 <span key={tag} className="ml-1 px-2 py-0.5 bg-secondary dark:bg-neutral-bg-dark text-neutral-charcoal dark:text-secondary-light rounded-full text-xs">
                     {tag}
                 </span>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MetadataBlock;

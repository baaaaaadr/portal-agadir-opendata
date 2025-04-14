// src/components/ui/Tabs.jsx
import React, { useState } from 'react';

function Tabs({ children, defaultIndex = 0 }) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const tabs = React.Children.toArray(children).filter(
    (child) => child.type === Tab
  );
  const panels = React.Children.toArray(children).filter(
    (child) => child.type === TabPanel
  );

  return (
    <div>
      {/* Tab List */}
      <div className="border-b border-neutral-light-sand dark:border-neutral-bg-alt-dark mb-4">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {tabs.map((tab, index) => (
            <button
              key={tab.props.label}
              onClick={() => setActiveIndex(index)}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-150
                                 ${activeIndex === index
                  ? 'border-primary text-primary dark:border-primary-light dark:text-primary-light'
                  : 'border-transparent text-neutral-text-muted-light dark:text-neutral-text-muted-dark hover:text-neutral-text-light dark:hover:text-neutral-text-dark hover:border-neutral-medium-gray dark:hover:border-neutral-bg-alt-dark'
                }`}
              aria-current={activeIndex === index ? 'page' : undefined}
            >
              {tab.props.icon && <span className="mr-1.5">{tab.props.icon}</span>}
              {tab.props.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Panels */}
      <div>
        {panels.map((panel, index) => (
          <div
            key={index}
            role="tabpanel"
            hidden={activeIndex !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
          >
            {activeIndex === index ? panel : null}
          </div>
        ))}
      </div>
    </div>
  );
}

// Composant pour définir un onglet (utilisé comme enfant de Tabs)
export function Tab({ label, icon }) {
  return null; // Ce composant ne rend rien directement, il sert à passer les props
}

// Composant pour définir le contenu d'un panneau (utilisé comme enfant de Tabs)
export function TabPanel({ children }) {
  return <div>{children}</div>;
}

export default Tabs;

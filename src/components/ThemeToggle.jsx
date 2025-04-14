import React from 'react';

function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button
      onClick={toggleTheme}
      className="relative p-1 rounded-lg hover:bg-neutral-bg-alt-light dark:hover:bg-neutral-bg-alt-dark transition-colors duration-200"
      aria-label="Basculer le thème"
      title="Basculer le thème"
    >
      <svg
        className={`w-6 h-6 transition-transform duration-200 ${theme === 'dark' ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </button>
  );
}

export default ThemeToggle;

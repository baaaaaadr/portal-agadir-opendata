import { useEffect } from 'react';

function ThemeToggle() {
  // Fonction pour basculer le thème
  const toggleTheme = () => {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    
    // Basculer la classe dark
    html.classList.toggle('dark');
    
    // Sauvegarder la préférence dans localStorage
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  };

  // Charger la préférence du thème au montage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <button
      onClick={toggleTheme}
      className="text-white hover:text-white px-4 py-2 flex items-center space-x-2"
      aria-label="Toggle dark mode"
    >
      {document.documentElement.classList.contains('dark') ? (
        <span>☀️</span>
      ) : (
        <span>🌙</span>
      )}
      <span className="text-sm">Mode Sombre</span>
    </button>
  );
}

export default ThemeToggle;

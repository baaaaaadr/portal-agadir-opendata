import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import ThemeToggle from './components/ThemeToggle';
import HomePage from './pages/HomePage';
import EquipementsPage from './pages/EquipementsPage';
import HotelsPage from './pages/HotelsPage';
import NotFoundPage from './pages/NotFoundPage';
import JardinsPage from './pages/JardinsPage';
import LignesBusPage from './pages/LignesBusPage';

function App() {
  // 1. State for theme
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'light';
  });

  // 2. useEffect to apply theme to <html> and save
  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
    console.log(`Theme changed to: ${theme}`);
  }, [theme]);

  // 3. Function to toggle theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-neutral-bg-light dark:bg-neutral-bg-dark transition-colors duration-200">
        <nav className="bg-primary dark:bg-neutral-surface-dark shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link
                  to="/"
                  className="flex items-center text-white hover:text-neutral-soft-white font-semibold"
                  aria-label="Accueil - Portail Opendata Agadir"
                >
                  <span className="text-xl font-heading">Portail Opendata Agadir</span>
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4 items-center">
                <Link to="/" className="text-white hover:bg-primary-light dark:hover:bg-neutral-bg-alt-dark px-3 py-2 rounded-md text-sm font-medium font-body">Accueil</Link>
                <Link to="/equipements" className="text-white hover:bg-primary-light dark:hover:bg-neutral-bg-alt-dark px-3 py-2 rounded-md text-sm font-medium font-body">Équipements</Link>
                <Link to="/hotels" className="text-white hover:bg-primary-light dark:hover:bg-neutral-bg-alt-dark px-3 py-2 rounded-md text-sm font-medium font-body">Hôtels</Link>
                <Link to="/jardins" className="text-white hover:bg-primary-light dark:hover:bg-neutral-bg-alt-dark px-3 py-2 rounded-md text-sm font-medium font-body">Jardins</Link>
                <Link to="/lignes-bus" className="text-white hover:bg-primary-light dark:hover:bg-neutral-bg-alt-dark px-3 py-2 rounded-md text-sm font-medium font-body">Lignes de Bus</Link>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/equipements" element={<EquipementsPage theme={theme} />} />
            <Route path="/hotels" element={<HotelsPage theme={theme} />} />
            <Route path="/jardins" element={<JardinsPage theme={theme} />} />
            <Route path="/lignes-bus" element={<LignesBusPage theme={theme} />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <footer className="bg-neutral-surface-light dark:bg-neutral-surface-dark mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-neutral-text-muted-light dark:text-neutral-text-muted-dark text-center text-sm font-body">
              {new Date().getFullYear()} Portail Opendata Agadir. Tous droits réservés.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
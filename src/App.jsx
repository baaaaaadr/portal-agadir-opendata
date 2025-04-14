import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from 'react-router-dom'; 
import './App.css'; 
import ThemeToggle from './components/ThemeToggle';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage'; 
import AboutPage from './pages/AboutPage'; 
import EquipementsPage from './pages/EquipementsPage';
import HotelsPage from './pages/HotelsPage';
import JardinsPage from './pages/JardinsPage';
import LignesBusPage from './pages/LignesBusPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light'; 
  });

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

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const activeClassName = "bg-primary-dark dark:bg-neutral-bg-alt-dark"; 

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-neutral-bg-light dark:bg-neutral-bg-dark transition-colors duration-200">

        <nav className="bg-primary dark:bg-neutral-surface-dark shadow-md sticky top-0 z-50"> 
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8"> 
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link
                  to="/"
                  className="flex items-center text-white hover:opacity-90"
                  aria-label="Accueil - Portail Opendata Agadir"
                >
                  <span className="text-xl font-bold font-heading">OpenData Agadir</span>
                </Link>
              </div>

              <div className="hidden sm:ml-6 sm:flex sm:space-x-1 items-center">
                 <NavLink
                   to="/"
                   className={({ isActive }) =>
                      `font-body text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-light dark:hover:bg-neutral-bg-dark transition-colors duration-150 ${isActive ? activeClassName : ''}`
                   }
                 >
                   Accueil
                 </NavLink>
                 <NavLink
                    to="/catalogue"
                    className={({ isActive }) =>
                       `font-body text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-light dark:hover:bg-neutral-bg-dark transition-colors duration-150 ${isActive ? activeClassName : ''}`
                    }
                 >
                    Catalogue
                 </NavLink>
                 <NavLink
                    to="/a-propos"
                    className={({ isActive }) =>
                       `font-body text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-light dark:hover:bg-neutral-bg-dark transition-colors duration-150 ${isActive ? activeClassName : ''}`
                    }
                 >
                   À Propos
                 </NavLink>
              </div>

              <div className="flex items-center">
                 <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-grow w-full"> 
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalogue" element={<CatalogPage />} />
            <Route path="/a-propos" element={<AboutPage />} />

            <Route path="/equipements" element={<EquipementsPage theme={theme} />} />
            <Route path="/hotels" element={<HotelsPage theme={theme} />} />
            <Route path="/jardins" element={<JardinsPage theme={theme} />} /> 
            <Route path="/lignes-bus" element={<LignesBusPage theme={theme} />} /> 

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <footer className="bg-neutral-surface-light dark:bg-neutral-surface-dark mt-auto border-t border-neutral-light-sand dark:border-neutral-bg-alt-dark">
          {/* Footer: fond full width, contenu avec padding */}
          <div className="w-full px-4 sm:px-6 lg:px-8 py-6 text-center"> 
            <p className="text-neutral-text-muted-light dark:text-neutral-text-muted-dark text-xs font-body">
              {new Date().getFullYear()} Portail Open Data Agadir - Propulsé par la Commune d'Agadir.
            </p>
          </div>
        </footer>

      </div>
    </Router>
  );
}

export default App;
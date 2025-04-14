import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from 'react-router-dom';
// --- Add Icons ---
import { FiMenu, FiX } from 'react-icons/fi';
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
import logoUrl from './assets/logo.svg'; // Import your logo file

function App() {
  const [theme, setTheme] = useState(() => {
    // ... (theme logic remains the same) ...
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
  });

  // --- State for Mobile Menu ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // ... (theme effect remains the same) ...
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
    // console.log(`Theme changed to: ${theme}`); // Keep if useful for debugging
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // --- Function to close mobile menu ---
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const activeClassName = "bg-primary-dark dark:bg-neutral-bg-alt-dark";
  const mobileLinkClass = "block font-body text-white px-3 py-2 rounded-md text-base font-medium hover:bg-primary-light dark:hover:bg-neutral-bg-dark transition-colors duration-150"; // Base class for mobile links
  const mobileActiveClassName = "bg-primary-dark dark:bg-neutral-bg-alt-dark"; // Active class for mobile


  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-neutral-bg-light dark:bg-neutral-bg-dark transition-colors duration-200">

        {/* --- Sticky Navbar --- */}
        <nav className="bg-primary dark:bg-neutral-surface-dark shadow-md sticky top-0 z-50">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <Link
                  to="/"
                  className="flex items-center text-white hover:opacity-90"
                  aria-label="Accueil - Portail Opendata Agadir"
                  onClick={closeMobileMenu} // Close menu if logo is clicked
                >
                  {/* Use an img tag for the logo */}
                  <img src={logoUrl} alt="OpenData Agadir Logo" className="h-8 w-auto" /> {/* Adjust height (h-8) as needed */}
                </Link>
              </div>

              {/* Desktop Navigation Links */}
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

              {/* Right side items: Mobile Menu Button */}
              <div className="flex items-center">
                 {/* Mobile Menu Button (Visible only on sm screens) */}
                 <div className="sm:hidden">
                    <button
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      type="button"
                      className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      aria-controls="mobile-menu"
                      aria-expanded={isMobileMenuOpen}
                      aria-label={isMobileMenuOpen ? "Fermer le menu principal" : "Ouvrir le menu principal"}
                    >
                      <span className="sr-only">Ouvrir/Fermer menu</span>
                      {isMobileMenuOpen ? (
                        <FiX className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <FiMenu className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </button>
                 </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu, show/hide based on state */}
          {/* Positioned absolutely below the navbar */}
          <div
             className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden absolute top-16 inset-x-0 z-40 bg-primary dark:bg-neutral-surface-dark shadow-lg`}
             id="mobile-menu"
           >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavLink
                to="/"
                className={({ isActive }) => `${mobileLinkClass} ${isActive ? mobileActiveClassName : ''}` }
                onClick={closeMobileMenu} // Close menu on click
              >
                Accueil
              </NavLink>
              <NavLink
                to="/catalogue"
                className={({ isActive }) => `${mobileLinkClass} ${isActive ? mobileActiveClassName : ''}` }
                onClick={closeMobileMenu} // Close menu on click
              >
                Catalogue
              </NavLink>
              <NavLink
                to="/a-propos"
                className={({ isActive }) => `${mobileLinkClass} ${isActive ? mobileActiveClassName : ''}` }
                onClick={closeMobileMenu} // Close menu on click
              >
                À Propos
              </NavLink>
            </div>
          </div>
        </nav>

        {/* --- Main Content --- */}
        <main className="flex-grow w-full">
          <Routes>
            {/* ... Routes remain the same ... */}
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

        {/* --- Footer --- */}
        <footer className="bg-neutral-surface-light dark:bg-neutral-surface-dark mt-auto border-t border-neutral-light-sand dark:border-neutral-bg-alt-dark">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center text-xs">
            {/* Copyright Text */}
            <p className="text-neutral-text-muted-light dark:text-neutral-text-muted-dark font-body">
              {new Date().getFullYear()} Portail Open Data Agadir - Propulsé par la Commune d'Agadir.
            </p>
            {/* Theme Toggle */}
            <div>
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
          </div>
        </footer>

      </div>
    </Router>
  );
}

export default App;
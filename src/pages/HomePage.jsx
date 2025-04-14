import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
      <h1 className="text-4xl md:text-5xl font-heading font-bold text-neutral-text-light dark:text-neutral-text-dark mb-6">
        Bienvenue sur Open Data Agadir
      </h1>
      <p className="text-xl md:text-2xl font-body text-neutral-text-light dark:text-neutral-text-dark mb-12">
        Découvrez et explorez les données ouvertes de la ville d'Agadir.
      </p>
      <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4">
        <Link
          to="/equipements"
          className="inline-block w-full sm:w-auto bg-primary hover:bg-primary-light text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 text-base"
        >
          Explorer les Équipements
        </Link>
        <Link
          to="/hotels"
          className="inline-block w-full sm:w-auto bg-accent hover:bg-accent-dark text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 text-base"
        >
          Découvrir les Hôtels
        </Link>
        <Link
          to="/jardins"
          className="inline-block w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 text-base"
        >
          Visiter les Jardins
        </Link>
        <Link
          to="/lignes-bus"
          className="inline-block w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 text-base"
        >
          Explorer les Lignes de Bus
        </Link>
      </div>
    </div>
  );
}

export default HomePage;

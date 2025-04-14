import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-heading font-bold text-neutral-text-light dark:text-neutral-text-dark mb-4">
        Page non trouvée
      </h2>
      <p className="text-neutral-text-muted-light dark:text-neutral-text-muted-dark mb-4">
        La page que vous recherchez n'existe pas.
      </p>
      <Link
        to="/"
        className="inline-block bg-primary hover:bg-primary-light text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}

export default NotFoundPage;

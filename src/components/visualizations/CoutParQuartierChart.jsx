import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Enregistrer les composants nécessaires de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function CoutParQuartierChart({ equipements }) {
  // 1. Préparer les données pour le graphique
  const dataParQuartier = equipements.reduce((acc, equipement) => {
    const quartier = equipement.quartier || 'Non spécifié';
    // S'assurer que cout_total est un nombre, sinon 0
    const cout = typeof equipement.cout_total === 'number' ? equipement.cout_total : (parseFloat(equipement.cout_total) || 0);

    if (!acc[quartier]) {
      acc[quartier] = 0;
    }
    acc[quartier] += cout;
    return acc;
  }, {});

  // Trier les quartiers par coût décroissant pour un meilleur affichage
  const sortedQuartiers = Object.entries(dataParQuartier)
    .sort(([, coutA], [, coutB]) => coutB - coutA)
    .map(([quartier]) => quartier);

  const sortedCouts = sortedQuartiers.map(quartier => dataParQuartier[quartier]);

  // Ajouter la détection du mode sombre
  const isDarkMode = document.documentElement.classList.contains('dark');
  const titleColor = isDarkMode ? '#F8F9FA' : '#303841'; // Using neutral-text-dark / neutral-text-light hex codes
  const textColor = isDarkMode ? '#F8F9FA' : '#303841'; // For legend and ticks
  const gridColor = isDarkMode ? 'rgba(248, 249, 250, 0.1)' : 'rgba(48, 56, 65, 0.1)'; // Lighter grid for dark, darker for light
  const tooltipBodyColor = isDarkMode ? '#F8F9FA' : '#303841';
  const tooltipTitleColor = isDarkMode ? '#F8F9FA' : '#303841';

  // AJOUTER CETTE LIGNE POUR LE DÉBOGAGE :
  console.log('Données pour le graphique (horizontal):', { labels: sortedQuartiers, data: sortedCouts });

  // 2. Configurer les données pour Chart.js
  // Utilisation des couleurs primaires définies dans Tailwind (via leurs valeurs HEX)
  const chartData = {
    labels: sortedQuartiers, // Noms des quartiers sur l'axe Y maintenant
    datasets: [
      {
        label: 'Coût Total (MAD)',
        data: sortedCouts, // Coûts sur l'axe X maintenant
        backgroundColor: 'rgba(62, 140, 170, 0.6)', // Primary DEFAULT avec transparence
        borderColor: 'rgba(62, 140, 170, 1)', // Primary DEFAULT
        borderWidth: 1,
      },
    ],
  };

  // 3. Configurer les options du graphique
  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
             color: textColor,
             font: {
                family: "'Open Sans', sans-serif"
             }
        }
      },
      title: {
        display: true,
        text: 'Coût Total des Équipements Sportifs par Quartier',
        color: titleColor,
        font: {
            family: "'Playfair Display', serif",
            size: 18
        },
        padding: {
             top: 10,
             bottom: 20
        }
      },
      tooltip: {
         titleColor: tooltipTitleColor,
         bodyColor: tooltipBodyColor,
         callbacks: {
            label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.x !== null) {
                    label += new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(context.parsed.x);
                }
                return label;
            }
         },
         bodyFont: {
             family: "'Open Sans', sans-serif"
         }
      }
    },
    scales: {
        x: {
            beginAtZero: true,
            ticks: {
                color: textColor,
                font: {
                    family: "'Open Sans', sans-serif"
                }
            },
            grid: {
                color: gridColor
            }
        },
        y: {
             ticks: {
                 color: textColor,
                 font: {
                    family: "'Open Sans', sans-serif",
                    size: 12
                 }
             },
             grid: {
                  display: false
             }
        }
    },
  };

  // 4. Rendre le composant Bar de react-chartjs-2
  // Donner une hauteur fixe ou relative au conteneur pour que maintainAspectRatio: false fonctionne bien
  // Increased height to h-[40rem] or more if needed for many labels
  return (
    <div className="my-8 p-4 bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-lg shadow-md relative h-[40rem]">
        <Bar options={chartOptions} data={chartData} />
    </div>
  );
}

export default CoutParQuartierChart;
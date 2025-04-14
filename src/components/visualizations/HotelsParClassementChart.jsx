import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function HotelsParClassementChart({ hotels, theme }) {
  // 1. Préparer les données : compter les hôtels par classement
  const dataParClassement = React.useMemo(() => {
    return hotels.reduce((acc, hotel) => {
      const classement = hotel.classement || 'Non spécifié';
      acc[classement] = (acc[classement] || 0) + 1;
      return acc;
    }, {});
  }, [hotels]);

  const labels = Object.keys(dataParClassement);
  const dataCounts = Object.values(dataParClassement);

  // 2. Détecter le mode sombre et définir les couleurs
  const isDarkMode = theme === 'dark';
  const titleColor = isDarkMode ? '#F8F9FA' : '#303841';
  const legendColor = isDarkMode ? '#ADB5BD' : '#8A959E';
  const tooltipBodyColor = isDarkMode ? '#F8F9FA' : '#303841';
  const tooltipTitleColor = isDarkMode ? '#F8F9FA' : '#303841';

  // Palette de couleurs - Utilise des couleurs distinctes
  const backgroundColors = [
    'rgba(62, 140, 170, 0.7)',  // primary
    'rgba(232, 140, 80, 0.7)',  // accent
    'rgba(226, 209, 181, 0.8)', // secondary
    'rgba(94, 166, 192, 0.7)',  // primary-light
    'rgba(242, 170, 122, 0.7)', // accent-light
  ];
  const borderColors = backgroundColors.map(color => color.replace('0.7', '1').replace('0.8', '1'));

  // 3. Configurer les données pour Chart.js
  const chartData = React.useMemo(() => ({
    labels: labels,
    datasets: [
      {
        label: 'Nombre d\'hôtels',
        data: dataCounts,
        backgroundColor: backgroundColors.slice(0, labels.length),
        borderColor: borderColors.slice(0, labels.length),
        borderWidth: 1,
      },
    ],
  }), [labels, dataCounts]);

  // 4. Configurer les options du graphique
  const chartOptions = React.useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: legendColor,
          font: {
            family: "'Open Sans', sans-serif",
            size: 14
          },
          boxWidth: 15,
          padding: 20
        }
      },
      title: {
        display: true,
        text: 'Répartition des Hôtels par Classement',
        color: titleColor,
        font: {
          family: "'Playfair Display', serif",
          size: 24
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        titleColor: tooltipTitleColor,
        bodyColor: tooltipBodyColor,
        backgroundColor: isDarkMode ? 'rgba(48, 56, 65, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        },
        bodyFont: {
          family: "'Open Sans', sans-serif"
        },
        titleFont: {
          family: "'Open Sans', sans-serif"
        }
      }
    },
  }), [isDarkMode, titleColor, legendColor, tooltipTitleColor, tooltipBodyColor]);

  return (
    <div className="my-8 p-4 bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-lg shadow-md relative h-96 md:h-[450px]">
      <Pie options={chartOptions} data={chartData} />
    </div>
  );
}

export default HotelsParClassementChart;

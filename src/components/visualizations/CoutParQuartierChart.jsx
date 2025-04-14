import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function CoutParQuartierChart({ equipements, theme }) {
  // 1. Prepare chart data
  const isDarkMode = theme === 'dark';
  const titleColor = isDarkMode ? '#F8F9FA' : '#303841';
  const textColor = isDarkMode ? '#ADB5BD' : '#8A959E';
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const tooltipBodyColor = isDarkMode ? '#F8F9FA' : '#303841';
  const tooltipTitleColor = isDarkMode ? '#F8F9FA' : '#303841';
  const barBackgroundColor = isDarkMode ? 'rgba(94, 166, 192, 0.7)' : 'rgba(62, 140, 170, 0.7)';
  const barBorderColor = isDarkMode ? '#65A7C0' : '#3E8CAA';

  const dataParQuartier = React.useMemo(() => {
    console.log("Recalculating chart data...");
    return equipements.reduce((acc, equipement) => {
      const quartier = equipement.quartier || 'Non spécifié';
      const cout = typeof equipement.cout_total === 'number' ? equipement.cout_total : (parseFloat(equipement.cout_total) || 0);

      if (!acc[quartier]) {
        acc[quartier] = 0;
      }
      acc[quartier] += cout;
      return acc;
    }, {});
  }, [equipements]);

  const { sortedQuartiers, sortedCouts } = React.useMemo(() => {
    const sortedEntries = Object.entries(dataParQuartier)
      .sort(([, coutA], [, coutB]) => coutB - coutA);
    const quartiers = sortedEntries.map(([quartier]) => quartier);
    const couts = sortedEntries.map(([, cout]) => cout);
    console.log('Chart data (horizontal):', { labels: quartiers, data: couts });
    return { sortedQuartiers: quartiers, sortedCouts: couts };
  }, [dataParQuartier]);

  // 3. Configure Chart.js data
  const chartData = React.useMemo(() => ({
    labels: sortedQuartiers,
    datasets: [
      {
        label: 'Coût Total (MAD)',
        data: sortedCouts,
        backgroundColor: barBackgroundColor,
        borderColor: barBorderColor,
        borderWidth: 1,
      },
    ],
  }), [sortedQuartiers, sortedCouts, barBackgroundColor, barBorderColor]);

  // 4. Configure chart options
  const chartOptions = React.useMemo(() => ({
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor,
          font: {
            family: "'Open Sans', sans-serif",
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'Coût Total des Équipements Sportifs par Quartier',
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
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.x !== null) {
              label += new Intl.NumberFormat('fr-MA', {
                style: 'currency',
                currency: 'MAD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(context.parsed.x);
            }
            return label;
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
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: textColor,
          font: {
            family: "'Open Sans', sans-serif",
            size: 12
          },
          callback: function(value) {
            if (value >= 1000000) return (value / 1000000) + 'M';
            if (value >= 1000) return (value / 1000) + 'k';
            return value;
          }
        },
        grid: {
          color: gridColor,
          borderColor: gridColor,
        },
        border: {
          color: gridColor
        }
      },
      y: {
        ticks: {
          color: textColor,
          font: {
            family: "'Open Sans', sans-serif",
            size: 12
          },
          autoSkip: false
        },
        grid: {
          display: false
        },
        border: {
          color: gridColor
        }
      }
    },
    animation: false,
  }), [isDarkMode, titleColor, textColor, gridColor, tooltipTitleColor, tooltipBodyColor, barBackgroundColor, barBorderColor]);

  // 5. Render the Bar component
  return (
    <div className="my-8 p-4 bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-lg shadow-md relative h-[600px]">
      <Bar options={chartOptions} data={chartData} />
    </div>
  );
}

export default CoutParQuartierChart;
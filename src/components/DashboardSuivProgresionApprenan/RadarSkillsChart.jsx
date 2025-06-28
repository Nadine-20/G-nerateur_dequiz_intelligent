import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { skillsData } from './FakeData';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

function RadarSkillsChart() {
  const data = {
    labels: skillsData.labels,
    datasets: [
      {
        label: "Compétences",
        data: skillsData.data,
        backgroundColor: "rgba(79, 70, 229, 0.25)", // un peu plus visible
        borderColor: "var(--primary)",
        borderWidth: 3,
        pointBackgroundColor: "var(--primary)",
        pointBorderColor: "#fff",
        pointHoverRadius: 7,
        pointRadius: 6,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(99, 102, 241, 0.3)', // --secondary en transparent
          circular: true,
        },
        angleLines: {
          color: 'rgba(99, 102, 241, 0.4)',
        },
        pointLabels: {
          color: 'var(--text)',
          font: {
            size: 14,
            weight: '600',
          },
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'var(--primary)',
          font: {
            size: 16,
            weight: '700',
          },
        },
      },
      tooltip: {
        backgroundColor: 'var(--primary)',
        titleColor: '#fff',
        bodyColor: '#eee',
        cornerRadius: 6,
        padding: 8,
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '350px', maxWidth: '600px', margin: 'auto' }}>
      <Radar data={data} options={options} />
    </div>
  );
}

export default RadarSkillsChart;


import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";


ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

const LineProgressChart = () => {
  const data = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    datasets: [
      {
        label: "Performance moyenne",
        data: [12, 28, 40, 25, 45, 65, 58, 66, 41, 63, 78, 85],
        fill: false,
        borderColor: "#1e64f0",
        backgroundColor: "#1e64f0",
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw}%`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
          stepSize: 20
        },
        title: {
          display: true,
          text: "Score (%)",
          font: { size: 14 }
        }
      },
      x: {
        title: {
          display: false
        }
      }
    }
  };

  return (
    <div>
      <h3 style={{ textAlign: "left", marginBottom: "10px" }}>
        Performance des élèves
      </h3>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineProgressChart;

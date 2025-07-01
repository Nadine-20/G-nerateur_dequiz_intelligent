import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ScoreDistributionChart = () => {
  const scoreBuckets = [
    { range: "0–49%", count: 5 },
    { range: "50–69%", count: 10 },
    { range: "70–89%", count: 12 },
    { range: "90–100%", count: 3 },
  ];

  const data = {
    labels: scoreBuckets.map((b) => b.range),
    datasets: [
      {
        label: "Nombre d'élèves",
        data: scoreBuckets.map((b) => b.count),
        backgroundColor: "rgba(255, 159, 64, 0.7)", 
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw} élève(s)`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        stepSize: 1,
        title: {
          display: true,
          text: "Nombre d'élèves",
        },
      },
      x: {
        title: {
          display: true,
          text: "Tranches de score",
        },
      },
    },
  };

  return (
    <div>
      <h3 style={{ textAlign: "left", marginBottom: "10px" }}>
        Répartition des scores
      </h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ScoreDistributionChart;

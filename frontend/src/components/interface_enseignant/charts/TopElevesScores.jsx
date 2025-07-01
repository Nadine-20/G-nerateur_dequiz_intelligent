

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);


const allStudents = [
  { name: "Antoine Dubois", score: 95 },
  { name: "Lucas Bernard", score: 92 },
  { name: "Camille Robert", score: 89 },
  { name: "Emilie Lefevre", score: 87 },
  { name: "Sarah Morel", score: 85 },
  { name: "Amine Barka", score: 70 },
  { name: "Salim Youssef", score: 66 },
  { name: "Fatima Zohra", score: 61 },
  { name: "Tarek Gharbi", score: 55 },
  { name: "Aya Ferjani", score: 48 },
  { name: "Rania Hamdi", score: 43 },
  { name: "Yassine Guez", score: 39 },
];

const createChartData = (students) => ({
  labels: students.map((s) => s.name),
  datasets: [
    {
      label: "Score (%)",
      data: students.map((s) => s.score),
      backgroundColor: "rgba(75, 192, 192, 0.8)",
      borderRadius: 6,
    },
  ],
});

const options = {
  indexAxis: "y",
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context) => `${context.raw}%`,
      },
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: (value) => `${value}%`,
      },
      title: {
        display: true,
        text: "Score",
      },
    },
    y: {
      title: {
        display: true,
        text: "Élève",
      },
    },
  },
};

const TopAndLowElevesScores = () => {
  const sorted = [...allStudents].sort((a, b) => b.score - a.score);
  const top5 = sorted.slice(0, 5);
  const low5 = sorted.slice(-5).reverse();

  return (
    <div style={{ display: "flex", gap: "30px", flexWrap: "wrap", justifyContent: "center" }}>
      <div style={{ width: "450px" }}>
        <h3 style={{ textAlign: "center", marginBottom: "10px" }}>Top 5 élèves</h3>
        <Bar data={createChartData(top5)} options={options} />
      </div>

      <div style={{ width: "450px" }}>
        <h3 style={{ textAlign: "center", marginBottom: "10px" }}>Dérniers 5 élèves</h3>
        <Bar data={createChartData(low5)} options={options} />
      </div>
    </div>
  );
};

export default TopAndLowElevesScores;

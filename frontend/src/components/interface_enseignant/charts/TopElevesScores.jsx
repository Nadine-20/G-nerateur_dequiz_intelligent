import React, { useEffect, useState } from "react";
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
      ticks: { callback: (value) => `${value}%` },
      title: { display: true, text: "Score" },
    },
    y: {
      title: { display: true, text: "Élève" },
    },
  },
};

const TopAndLowElevesScores = ({ teacherId }) => {
  const [top5, setTop5] = useState([]);
  const [low5, setLow5] = useState([]);

  useEffect(() => {
    if (!teacherId) return;

    fetch(`http://localhost:5000/api/top_and_low_students/${teacherId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur réseau");
        return res.json();
      })
      .then((data) => {
        setTop5(data.top_5 || []);
        setLow5(data.low_5 || []);
      })
      .catch((err) =>
        console.error("Error fetching student scores", err)
      );
  }, [teacherId]);

  return (
    <div style={{ display: "flex", gap: "30px", flexWrap: "wrap", justifyContent: "center" }}>
      <div style={{ width: "450px" }}>
        <h3 style={{ textAlign: "center", marginBottom: "10px" }}>Top 5 élèves</h3>
        <Bar data={createChartData(top5)} options={options} />
      </div>

      <div style={{ width: "450px" }}>
        <h3 style={{ textAlign: "center", marginBottom: "10px" }}>Derniers 5 élèves</h3>
        <Bar data={createChartData(low5)} options={options} />
      </div>
    </div>
  );
};

export default TopAndLowElevesScores;

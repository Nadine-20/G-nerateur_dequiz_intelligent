import React, { useState, useEffect } from "react";
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

const ScoreDistributionChart = ({ teacherId }) => {
  const [scoreBuckets, setScoreBuckets] = useState([
    { range: "0–49%", count: 0 },
    { range: "50–69%", count: 0 },
    { range: "70–89%", count: 0 },
    { range: "90–100%", count: 0 },
  ]);

  useEffect(() => {
    if (!teacherId) return;

    fetch(`http://localhost:5000/api/score_distribution/${teacherId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur réseau");
        return res.json();
      })
      .then((data) => {
        const buckets = [
          { range: "0–49%", count: data["0-49"] || 0 },
          { range: "50–69%", count: data["50-69"] || 0 },
          { range: "70–89%", count: data["70-89"] || 0 },
          { range: "90–100%", count: data["90-100"] || 0 },
        ];
        setScoreBuckets(buckets);
      })
      .catch((err) =>
        console.error("Error fetching score distribution", err)
      );
  }, [teacherId]);

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
        ticks: {
          stepSize: 1,
        },
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

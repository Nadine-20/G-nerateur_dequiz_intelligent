import React, { useRef, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import dayjs from "dayjs"; // npm install dayjs

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

function LineProgressChart({ userId }) {
  const chartRef = useRef(null);
  const [gradient, setGradient] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);

  // 1. Fetch backend data
  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/apprenant/${userId}/progress`)
      .then((res) => res.json())
      .then((data) => {
        const history = data.progress || [];

        // Grouper par mois
        const monthMap = {};

        history.forEach((entry) => {
          const date = dayjs(entry.date); // format ISO
          const month = date.format("MMMM YYYY"); // ex: "Juillet 2025"
          if (!monthMap[month]) {
            monthMap[month] = [];
          }
          monthMap[month].push(entry.score || 0);
        });

        // Moyenne par mois
        const monthly = Object.keys(monthMap).map((month) => {
          const scores = monthMap[month];
          const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
          return { month, score: Math.round(avg) };
        });

        // Trier par mois
        monthly.sort((a, b) =>
          dayjs(a.month, "MMMM YYYY").isAfter(dayjs(b.month, "MMMM YYYY"))
            ? 1
            : -1
        );

        setMonthlyData(monthly);
      })
      .catch((err) => console.error("Erreur fetch progression:", err));
  }, [userId]);

  // 2. Dégradé
  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.ctx;
    const gradientFill = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradientFill.addColorStop(0, "rgba(99, 102, 241, 0.6)");
    gradientFill.addColorStop(1, "rgba(79, 70, 229, 0.1)");
    setGradient(gradientFill);
  }, [monthlyData]);

  if (monthlyData.length === 0) {
    return <p style={{ textAlign: "center" }}>Pas encore de progression</p>;
  }

  // 3. Préparer les données
  const data = {
    labels: monthlyData.map((item) => item.month),
    datasets: [
      {
        label: "Score mensuel",
        data: monthlyData.map((item) => item.score),
        borderColor: "var(--primary)",
        backgroundColor: gradient,
        tension: 0.3,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: "var(--secondary)",
        pointHoverBackgroundColor: "var(--primary)",
        pointBorderColor: "#fff",
        pointHoverBorderColor: "#fff",
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: {
      duration: 1200,
      easing: "easeOutQuart",
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#E5E7EB",
        },
        ticks: {
          color: "var(--text)",
          font: { size: 14, weight: "500" },
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: "var(--text)",
          font: { size: 14, weight: "500" },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "var(--primary)",
          font: { size: 16, weight: "700" },
        },
      },
      tooltip: {
        backgroundColor: "var(--primary)",
        titleColor: "#fff",
        bodyColor: "#f0f0f0",
        cornerRadius: 6,
        padding: 10,
        displayColors: false,
      },
    },
  };

  return (
    <div>
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
}

export default LineProgressChart;

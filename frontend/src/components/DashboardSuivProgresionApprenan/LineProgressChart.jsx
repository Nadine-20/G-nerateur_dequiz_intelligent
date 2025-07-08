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
import dayjs from "dayjs";

import "./LineProgressChart.css"; // Import du CSS

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
  const [allMonthlyData, setAllMonthlyData] = useState([]);
  const [filteredMonthlyData, setFilteredMonthlyData] = useState([]);
  const [selectedInterval, setSelectedInterval] = useState("Tous");

  // Génération des intervalles (3 mois)
  const generateIntervals = (months) => {
    if (months.length === 0) return [];

    const sortedMonths = months
      .map((m) => dayjs(m, "MMMM YYYY"))
      .sort((a, b) => a - b);

    const intervals = [];
    let startIndex = 0;

    while (startIndex < sortedMonths.length) {
      const startMonth = sortedMonths[startIndex];
      const endMonth = startMonth.add(2, "month");

      const intervalMonths = sortedMonths.filter(
        (m) => m.isSame(startMonth) || (m.isAfter(startMonth) && m.isBefore(endMonth.add(1, "day")))
      );

      const label =
        intervalMonths.length === 1
          ? intervalMonths[0].format("MMMM YYYY")
          : `${intervalMonths[0].format("MMM YYYY")} – ${intervalMonths[intervalMonths.length - 1].format("MMM YYYY")}`;

      intervals.push({
        label,
        start: intervalMonths[0],
        end: intervalMonths[intervalMonths.length - 1],
      });

      startIndex += intervalMonths.length;
    }

    return intervals;
  };

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/apprenant/${userId}/progress`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const history = data.progress || [];

        const monthMap = {};

        history.forEach((entry) => {
          const isoDate = entry.date?.$date;
          if (!isoDate) return;

          const date = dayjs(isoDate);
          const month = date.format("MMMM YYYY");
          if (!monthMap[month]) {
            monthMap[month] = [];
          }
          monthMap[month].push(entry.score || 0);
        });

        const monthly = Object.entries(monthMap).map(([month, scores]) => {
          const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
          return { month, score: Math.round(avg) };
        });

        monthly.sort((a, b) =>
          dayjs(a.month, "MMMM YYYY").isAfter(dayjs(b.month, "MMMM YYYY")) ? 1 : -1
        );

        setAllMonthlyData(monthly);
        setFilteredMonthlyData(monthly);
        setSelectedInterval("Tous");
      })
      .catch((err) => console.error("Erreur fetch progression:", err));
  }, [userId]);

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.ctx;
    const gradientFill = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradientFill.addColorStop(0, "rgba(99, 102, 241, 0.6)");
    gradientFill.addColorStop(1, "rgba(79, 70, 229, 0.1)");
    setGradient(gradientFill);
  }, [filteredMonthlyData]);

  const intervals = generateIntervals(allMonthlyData.map((d) => d.month));

  const handleIntervalClick = (interval) => {
    setSelectedInterval(interval.label);

    if (interval.label === "Tous") {
      setFilteredMonthlyData(allMonthlyData);
    } else {
      const filtered = allMonthlyData.filter(({ month }) => {
        const m = dayjs(month, "MMMM YYYY");
        return (
          m.isSame(interval.start) ||
          m.isSame(interval.end) ||
          (m.isAfter(interval.start) && m.isBefore(interval.end))
        );
      });
      setFilteredMonthlyData(filtered);
    }
  };

  if (allMonthlyData.length === 0) {
    return <p style={{ textAlign: "center" }}>Pas encore de progression</p>;
  }

  const data = {
    labels: filteredMonthlyData.map((item) => item.month),
    datasets: [
      {
        label: "Score mensuel",
        data: filteredMonthlyData.map((item) => item.score),
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
        grid: { color: "#E5E7EB" },
        ticks: { color: "var(--text)", font: { size: 14, weight: "500" } },
      },
      x: {
        grid: { display: false },
        ticks: { color: "var(--text)", font: { size: 14, weight: "500" } },
      },
    },
    plugins: {
      legend: {
        labels: { color: "var(--primary)", font: { size: 16, weight: "700" } },
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
    <div className="chart-container">
      <Line ref={chartRef} data={data} options={options} />

      <div className="months-tabs">
        <button
          onClick={() => handleIntervalClick({ label: "Tous", start: null, end: null })}
          className={selectedInterval === "Tous" ? "selected" : ""}
          type="button"
        >
          Tous
        </button>

        {intervals.map((interval) => (
          <button
            key={interval.label}
            onClick={() => handleIntervalClick(interval)}
            className={selectedInterval === interval.label ? "selected" : ""}
            type="button"
          >
            {interval.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LineProgressChart;

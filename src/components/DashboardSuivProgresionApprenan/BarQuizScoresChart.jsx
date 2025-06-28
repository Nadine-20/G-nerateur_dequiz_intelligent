import React, { useRef, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { quizScores } from "./FakeData";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function BarQuizScoresChart() {
  const chartRef = useRef(null);
  const [gradient, setGradient] = useState(null);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const ctx = chart.ctx;
    const gradientFill = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradientFill.addColorStop(0, "rgba(34, 197, 94, 0.9)"); // Vert vif (var(--accent))
    gradientFill.addColorStop(1, "rgba(99, 102, 241, 0.7)"); // Bleu doux (var(--secondary)

    setGradient(gradientFill);
  }, []);

  const data = {
    labels: quizScores.map((item) => item.quiz),
    datasets: [
      {
        label: "Score par quiz",
        data: quizScores.map((item) => item.score),
        backgroundColor: gradient || "#22C55E",
        borderRadius: 8,
        maxBarThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
    plugins: {
      legend: {
        labels: {
          color: "var(--text)",
          font: {
            size: 14,
            weight: "600",
          },
        },
      },
      tooltip: {
        backgroundColor: "var(--primary)",
        titleColor: "#fff",
        bodyColor: "#f0f0f0",
        cornerRadius: 6,
        padding: 10,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "var(--text)",
          font: { weight: "600" },
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "var(--text)",
          font: { weight: "600" },
          stepSize: 10,
        },
        grid: {
          color: "#E5E7EB",
          borderDash: [5, 5],
        },
      },
    },
  };

  return<> 
  <div>
        <Bar
          ref={chartRef}
          data={data}
          options={options}/>
      </div>
      <br></br>
      <br></br>
      <br></br></>
      
}

export default BarQuizScoresChart;

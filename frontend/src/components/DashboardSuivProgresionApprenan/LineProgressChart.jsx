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
import { monthlyProgress } from "./FakeData";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

function LineProgressChart() {
  const chartRef = useRef(null);
  const [gradient, setGradient] = useState(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.ctx;
    const gradientFill = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradientFill.addColorStop(0, "rgba(99, 102, 241, 0.6)"); // var(--secondary) avec opacité
    gradientFill.addColorStop(1, "rgba(79, 70, 229, 0.1)");  // var(--primary) très clair
    setGradient(gradientFill);
  }, []);

  const data = {
    labels: monthlyProgress.map((item) => item.month),
    datasets: [
      {
        label: "Score mensuel",
        data: monthlyProgress.map((item) => item.score),
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
          font: {
            size: 14,
            weight: "500",
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "var(--text)",
          font: {
            size: 14,
            weight: "500",
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "var(--primary)",
          font: {
            size: 16,
            weight: "700",
          },
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

  return <> 
    <div>
          <Line
            ref={chartRef}
            data={data}
            options={options}/>
        </div>
        <br></br>
        <br></br>
      
        </>;
}

export default LineProgressChart;

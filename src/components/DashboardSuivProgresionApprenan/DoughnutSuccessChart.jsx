import { useRef, useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { successData } from "./FakeData";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutSuccessChart() {
  const chartRef = useRef(null);
  const [gradient, setGradient] = useState(null);
  const { completed, remaining } = successData;

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const ctx = chart.ctx;
    const gradientFill = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradientFill.addColorStop(0, "rgba(34, 197, 94, 0.9)"); // var(--accent)
    gradientFill.addColorStop(1, "rgba(34, 197, 94, 0.5)");

    setGradient(gradientFill);
  }, []);

  if (completed === undefined || remaining === undefined) {
    return <p style={{ textAlign: "center" }}>Données non disponibles</p>;
  }

  const data = {
    labels: ["Complété", "Restant"],
    datasets: [
      {
        data: [completed, remaining],
        backgroundColor: [gradient || "var(--accent)", "#E5E7EB"],
        borderColor: "transparent",
        borderWidth: 0,
        hoverOffset: 20,
        borderRadius: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,  // Important pour remplir le container
    cutout: "70%",
    animation: {
      duration: 1200,
      easing: "easeOutQuart",
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "var(--text)",
          font: { size: 14, weight: "600" },
          padding: 20,
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
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 600,  // largeur max plus grande
        height: 450,    // hauteur plus grande
        margin: "auto",
      }}
    >
      <Doughnut
        ref={chartRef}
        data={data}
        options={options}
        width={600}
        height={450}
      />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
    </div>
    
  );
}

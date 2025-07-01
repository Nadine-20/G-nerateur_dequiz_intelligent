import { useRef, useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutSuccessChart({ userId }) {
  const chartRef = useRef(null);
  const [gradient, setGradient] = useState(null);
  const [completed, setCompleted] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const totalAvailable = 5; // ← Tu peux changer ce nombre selon le nombre total de quiz dispo

  // Récupération des données
  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/apprenant/${userId}/progress`)
      .then((res) => res.json())
      .then((data) => {
        const attempts = data.progress || [];
        const completedCount = attempts.length;
        const remainingCount = Math.max(totalAvailable - completedCount, 0);
        setCompleted(completedCount);
        setRemaining(remainingCount);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des données de progression :", err);
        setCompleted(0);
        setRemaining(totalAvailable);
      });
  }, [userId]);

  // Création du dégradé
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const ctx = chart.ctx;
    const gradientFill = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradientFill.addColorStop(0, "rgba(34, 197, 94, 0.9)");
    gradientFill.addColorStop(1, "rgba(34, 197, 94, 0.5)");

    setGradient(gradientFill);
  }, [completed]);

  if (completed === null || remaining === null) {
    return <p style={{ textAlign: "center" }}>Chargement des données...</p>;
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
    maintainAspectRatio: false,
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
        maxWidth: 600,
        height: 450,
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
    </div>
  );
}

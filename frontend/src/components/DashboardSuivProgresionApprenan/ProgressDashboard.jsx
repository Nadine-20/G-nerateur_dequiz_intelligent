import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";
import "./ProgressDashboard.css";

function ProgressDashboard({ userId }) {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    async function fetchData() {
      try {
        // 1. Récupérer l'historique du user
        const resProgress = await fetch(`http://localhost:5000/api/apprenant/${userId}/progress`);
        const dataProgress = await resProgress.json();
        const history = dataProgress.progress || [];

        if (history.length === 0) {
          setProgressData([]);
          setLoading(false);
          return;
        }

        // 2. Extraire IDs des quizzes
        const quizIds = history.map((entry) => entry.quizId);

        // 3. Récupérer uniquement les quizzes demandés
        const resQuizzes = await fetch(`http://localhost:5000/api/apprenant/quizzes/by-ids`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: quizIds }),
        });
        const quizzes = await resQuizzes.json();

        // 4. Créer un dictionnaire id => titre
        const quizMap = {};
        quizzes.forEach((quiz) => {
          quizMap[quiz._id] = quiz.title;
        });

        // 5. Préparer données pour graphique et liste
        const formattedData = history.map((entry, idx) => ({
          quiz: quizMap[entry.quizId] || `Quiz ${idx + 1}`,
          score: entry.score,
        }));

        setProgressData(formattedData);
      } catch (err) {
        console.error("Erreur récupération progression :", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userId]);

  if (loading) return <div className="progress-dashboard__loading">Chargement...</div>;

  if (progressData.length === 0)
    return <p style={{ textAlign: "center" }}>Aucune donnée de progression disponible.</p>;

  return (
    <div className="progress-dashboard">
      <h2 className="progress-dashboard__title">Suivi de progression</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={progressData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          className="progress-chart"
        >
          <CartesianGrid strokeDasharray="5 5" stroke="var(--secondary)" />
          <XAxis dataKey="quiz" tick={{ fill: "var(--text)", fontWeight: "600" }} />
          <YAxis tick={{ fill: "var(--text)", fontWeight: "600" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#f5f5f5",
              borderRadius: 8,
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
            itemStyle={{ color: "var(--primary)", fontWeight: "700" }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="var(--primary)"
            strokeWidth={3}
            dot={{ r: 6, stroke: "var(--primary)", strokeWidth: 2, fill: "#fff" }}
            activeDot={{ r: 9 }}
            isAnimationActive={true}
            animationDuration={1200}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="progress-dashboard__details">
        <h3>Détails des quiz :</h3>
        <ul>
          {progressData.map((item, idx) => (
            <li key={idx}>
              <strong>{item.quiz}</strong> :{" "}
              <span style={{ color: "var(--accent)" }}>{item.score}%</span>
            </li>
          ))}
        </ul>
      </div>
      <br />
      <br />
    </div>
  );
}

export default ProgressDashboard;

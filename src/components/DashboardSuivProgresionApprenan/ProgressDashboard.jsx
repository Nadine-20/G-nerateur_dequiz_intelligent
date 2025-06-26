import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

import "./ProgressDashboard.css";

function ProgressDashboard() {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = [
      { quiz: "Quiz 1", score: 60 },
      { quiz: "Quiz 2", score: 75 },
      { quiz: "Quiz 3", score: 90 },
    ];

    setProgressData(data);
    setLoading(false);
  }, []);

  if (loading) return <div className="progress-dashboard__loading">Chargement...</div>;

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
            contentStyle={{ backgroundColor: "#f5f5f5", borderRadius: 8, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
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
              <strong>{item.quiz}</strong> : <span style={{ color: "var(--accent)" }}>{item.score}%</span>
            </li>
          ))}
        </ul>
      </div>
      <br></br>
      <br></br> 
    </div>
    
  );
}

export default ProgressDashboard;
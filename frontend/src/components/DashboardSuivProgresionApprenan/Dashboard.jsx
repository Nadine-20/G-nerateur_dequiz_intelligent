import React, { useState, useEffect } from "react";
import LineProgressChart from "./LineProgressChart";
import BarQuizScoresChart from "./BarQuizScoresChart";
// import RadarSkillsChart from "./RadarSkillsChart";
import DoughnutSuccessChart from "./DoughnutSuccessChart";
import ProgressDashboard from "./ProgressDashboard";
import dayjs from "dayjs";
import "./Dashboard.css";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("line");
  const [userId, setUserId] = useState(null);
  const [summaryStats, setSummaryStats] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId") || "user-007";
    if (storedUserId) setUserId(storedUserId);
  }, []);

  // Fetch progress data et calcul des stats résumé
  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/apprenant/${userId}/progress`)
      .then((res) => res.json())
      .then((data) => {
        const history = data.progress || [];

        const totalQuizzes = history.length;

        const sumScores = history.reduce((acc, cur) => acc + (cur.score || 0), 0);
        const averageScore = totalQuizzes > 0 ? Math.round(sumScores / totalQuizzes) : 0;

        const successCount = history.filter((e) => e.score >= 50).length;
        const successRate = totalQuizzes > 0 ? Math.round((successCount / totalQuizzes) * 100) : 0;

        // Dernière connexion si dispo, sinon aujourd'hui (format YYYY-MM-DD)
        // Ici je prends la dernière date dans history (la plus récente)
        const lastDateObj = history.length > 0
          ? history.reduce((max, cur) => {
              const curDate = dayjs(cur.date?.$date);
              return curDate.isAfter(max) ? curDate : max;
            }, dayjs("1900-01-01"))
          : dayjs();

        const lastConnect = lastDateObj.format("DD MMMM YYYY");

        setSummaryStats({ totalQuizzes, averageScore, successRate, lastConnect });
      })
      .catch((err) => console.error("Erreur fetch progression:", err));
  }, [userId]);

  if (!userId) return <p>Chargement du tableau de bord...</p>;

  const tabs = [
    { id: "line", label: "Progression Mensuelle" },
    { id: "bar", label: "Scores Quiz" },
    // { id: "radar", label: "Compétences" },
    { id: "progress", label: "Suivi Progression" },
    { id: "doughnut", label: "Succès" },
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Tableau de bord de progression</h1>
      </header>
      <nav className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="dashboard-grid">
        {activeTab === "line" && (
          <div className="chart-card">
            <LineProgressChart userId={userId} />
          </div>
        )}
        {activeTab === "bar" && (
          <div className="chart-card">
            <BarQuizScoresChart userId={userId} />
          </div>
        )}
        {/* {activeTab === "radar" && (
          <div className="chart-card">
            <RadarSkillsChart userId={userId} />
          </div>
        )} */}
        {activeTab === "progress" && (
          <div className="chart-card">
            <ProgressDashboard userId={userId} />
          </div>
        )}
        {activeTab === "doughnut" && (
          <div className="chart-card">
            <DoughnutSuccessChart userId={userId} />
          </div>
        )}
      </div>

       {/* Section Statistiques Résumées */}
      {summaryStats && (
        <section className="dashboard-summary">
          <div className="stat-card">
            <h3>Total Quizz Passés</h3>
            <p>{summaryStats.totalQuizzes}</p>
          </div>
          <div className="stat-card">
            <h3>Moyenne Générale</h3>
            <p>{summaryStats.averageScore}%</p>
          </div>
          <div className="stat-card">
            <h3>Taux de Réussite</h3>
            <p>{summaryStats.successRate}%</p>
          </div>
          <div className="stat-card">
            <h3>Dernière Connexion</h3>
            <p>{summaryStats.lastConnect}</p>
          </div>
        </section>
      )}

    </div>
  );
}

export default Dashboard;

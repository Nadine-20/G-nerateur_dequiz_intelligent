import React, { useState, useEffect } from "react";
import LineProgressChart from "./LineProgressChart";
import BarQuizScoresChart from "./BarQuizScoresChart";
import RadarSkillsChart from "./RadarSkillsChart";
import DoughnutSuccessChart from "./DoughnutSuccessChart";
import ProgressDashboard from "./ProgressDashboard";
import "./Dashboard.css";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("line");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
   const storedUserId = localStorage.getItem("userId") || "user_004";
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

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

      <div className="dashboard-grid" style={{ justifyContent: "center" }}>
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
     {/*    {activeTab === "radar" && (
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
    </div>
  );
}

export default Dashboard;

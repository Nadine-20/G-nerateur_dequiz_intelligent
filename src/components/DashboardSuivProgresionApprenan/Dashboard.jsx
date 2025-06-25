import React, { useState } from "react";
import LineProgressChart from "./LineProgressChart";
import BarQuizScoresChart from "./BarQuizScoresChart";
import RadarSkillsChart from "./RadarSkillsChart";
import DoughnutSuccessChart from "./DoughnutSuccessChart";
import ProgressDashboard from "./ProgressDashboard";
import "./Dashboard.css";

function Dashboard() {
  // Onglet actif - par défaut "line"
  const [activeTab, setActiveTab] = useState("line");

  // Liste des onglets avec id et label
  const tabs = [
    { id: "line", label: "Progression Mensuelle" },
    { id: "bar", label: "Scores Quiz" },
    { id: "radar", label: "Compétences" },
    { id: "progress", label: "Suivi Progression" },
    { id: "doughnut", label: "Succès" },
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Tableau de bord de progression</h1>
      </header>

      {/* Onglets de navigation */}
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

      {/* Contenu des onglets - afficher uniquement celui sélectionné */}
      <div className="dashboard-grid" style={{ justifyContent: "center" }}>
        {activeTab === "line" && (
          <div className="chart-card">
            <LineProgressChart />
          </div>
        )}
        {activeTab === "bar" && (
          <div className="chart-card">
            <BarQuizScoresChart />
          </div>
        )}
        {activeTab === "radar" && (
          <div className="chart-card">
            <RadarSkillsChart />
          </div>
        )}
        {activeTab === "progress" && (
          <div className="chart-card">
            <ProgressDashboard />
          </div>
        )}
        {activeTab === "doughnut" && (
          <div className="chart-card">
            <DoughnutSuccessChart />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

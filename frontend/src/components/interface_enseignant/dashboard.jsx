import React, { useState } from "react";
import LineProgressChart from "./charts/LineProgressChart";
import TopScores from "./charts/TopElevesScores";
import ScoreDistrubtion from "./charts/ScoreDistributionChart";
import CompetanceEleve from "./charts/CompetanceParEleve";
import "./dashboard.css";
import profilIcon from "./images/profil.png";
import Total_Students from "./data/totalStudents";
import Total_quiz from "./data/totalQuiz";
import SuccessRate from "./data/successRate";
import Last_Activities_Table from "./data/LastActivitiesTable";
import Teacher_Name from "./data/Teacher_Name";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("line");


    const [userInfo, setUser] = useState(() => {
        const storedUser = localStorage.getItem('userInfo');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const teacherId = userInfo ? userInfo._id : null;

    if (!teacherId) {
        return <p>Vous devez vous connecter pour accéder au tableau de bord.</p>;
    }

    return (
        <div id="container">
            <main>
                <header>
                    <h1>
                        Bonjour , Professeur {userInfo ? userInfo.firstName : "Inconnu"}
                    </h1>
                    <img src={profilIcon} alt="Profil" />
                </header>

                <section>
                    <div>
                        <div id="stats_bar">
                            <ul>
                                <li id="total_eleves">
                                    Total des élèves
                                    <br />
                                    <br /> <Total_Students />
                                </li>
                                <li id="nb_cour">
                                    Total des quizzes
                                    <br />
                                    <br />
                                    <Total_quiz teacherId={teacherId} />
                                </li>
                                <li id="tx_reuss">
                                    Taux de réussite
                                    <br />
                                    <br />
                                    <SuccessRate teacherId={teacherId} />
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="tab-buttons">
                        <button onClick={() => setActiveTab("line")}>Statistiques Des élèves</button>
                        <button onClick={() => setActiveTab("bar")}>5 Top & Derniers élèves par Score</button>
                        <button onClick={() => setActiveTab("radar")}>Score Distribution</button>
                        <button onClick={() => setActiveTab("progress")}>Compétence Par élève</button>
                    </div>

                    <div className="dashboard-grid">
                        {activeTab === "line" && (
                            <div className="chart-card">
                                <LineProgressChart teacherId={teacherId} />
                            </div>
                        )}
                        {activeTab === "bar" && (
                            <div className="chart-card">
                                <TopScores teacherId={teacherId} />
                            </div>
                        )}
                        {activeTab === "radar" && (
                            <div className="chart-card">
                                <ScoreDistrubtion teacherId={teacherId} />
                            </div>
                        )}
                        {activeTab === "progress" && (
                            <div className="chart-card">
                                <CompetanceEleve teacherId={teacherId} />
                            </div>
                        )}
                    </div>

                    <Last_Activities_Table teacherId={teacherId} />
                </section>
            </main>
        </div>
    );
};

export default Dashboard;

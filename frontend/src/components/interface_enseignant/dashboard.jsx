import React from "react";
import LineProgressChart from "./charts/LineProgressChart";
import TopScores from "./charts/TopElevesScores";
import ScoreDistrubtion from "./charts/ScoreDistributionChart";
import CompetanceEleve from "./charts/CompetanceParEleve";
import "./dashboard.css";
import profilIcon from "./images/profil.png";
import { useState } from "react";




const dashboard = () => {
    const [activeTab, setActiveTab] = useState("line");
    return (
        <div id="container">
            <main>
                <header>
                    <h1>Bonjour , Professeur Martin</h1>
                    <img src={profilIcon} alt="" />
                </header>
                <section>
                    <div>
                        <div id="stats_bar">
                            <ul>
                                <li id="total_eleves">Total des élèves<br /><br /> 150</li>
                                <li id="nb_cour">Total des cours<br /><br /> 5</li>
                                <li id="tx_reuss">Taux de réussite<br /><br /> 84%</li>
                            </ul>
                        </div>
                    </div>
                    <div className="tab-buttons">
                        <button onClick={() => setActiveTab("line")}>Statistiques Des élèves</button>
                        <button onClick={() => setActiveTab("bar")}>5 Top & Derniers élèves par Score</button>
                        <button onClick={() => setActiveTab("radar")}>Score Distribution</button>
                        <button onClick={() => setActiveTab("progress")}>Competance Par élève</button>
                    </div>

                    <div className="dashboard-grid">
                        {activeTab === "line" && <div className="chart-card"><LineProgressChart /></div>}
                        {activeTab === "bar" && <div className="chart-card"><TopScores /></div>}
                        {activeTab === "radar" && <div className="chart-card"><ScoreDistrubtion /></div>}
                        {activeTab === "progress" && <div className="chart-card"><CompetanceEleve /></div>}
                    </div>


                        <div id="last_activities">
                            <h3>Derniers élèves connectés</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Cours</th>
                                        <th>Score</th>
                                        <th>Dernière activité</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Emilie Lefevre</td>
                                        <td>Mathématique</td>
                                        <td>78%</td>
                                        <td>23 avril</td>
                                    </tr>
                                    <tr>
                                        <td>Antoine Dubois</td>
                                        <td>Physique</td>
                                        <td>92%</td>
                                        <td>22 avril</td>
                                    </tr>
                                    <tr>
                                        <td>Lucas Bernard</td>
                                        <td>Histoire</td>
                                        <td>85%</td>
                                        <td>21 avril</td>
                                    </tr>
                                    <tr>
                                        <td>Camille Robert</td>
                                        <td>Chimie</td>
                                        <td>69%</td>
                                        <td>20 avril</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                </section>
            </main>

        </div >
    );
}

export default dashboard;
import React, { useEffect, useState } from "react";

const TableActivities = ({ teacherId }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teacherId) return;

    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/last_passed_students/${teacherId}`);
        if (!response.ok) throw new Error("Erreur réseau");

        const data = await response.json();
        console.log("Fetched data:", data);

        if (!Array.isArray(data)) {
          console.error("API response is not an array:", data);
          setRows([]);
        } else {
          setRows(data);
        }

        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setRows([]);
        setLoading(false);
      }
    }

    fetchData();
  }, [teacherId]);

  if (loading) return <p>Chargement...</p>;

  return (
    <div id="last_activities">
      <h3>Derniers élèves connectés</h3>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Matière</th>
            <th>Score</th>
            <th>Dernière activité</th>
          </tr>
        </thead>
        <tbody>
          {!Array.isArray(rows) || rows.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                Aucune donnée disponible
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={index}>
                <td>{row.name}</td>
                <td>{row.subject}</td>
                <td>{row.score}</td>
                <td>{row.lastActivity}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableActivities;

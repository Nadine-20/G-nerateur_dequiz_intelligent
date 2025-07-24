import React, { useEffect, useState } from "react";

const Totalquiz = ({ teacherId }) => {
  const [totalquiz, setTotalquiz] = useState(0);

  useEffect(() => {
    if (!teacherId) return;

    fetch(`http://localhost:5000/api/total_quiz/${teacherId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erreur réseau");
        }
        return res.json();
      })
      .then((data) => {
        setTotalquiz(data.total_quiz);
      })
      .catch((error) => {
        console.error("Error fetching total quiz:", error);
      });
  }, [teacherId]);

  return (
    <p style={{ color: "white" }}>{totalquiz}</p>
  );
};

export default Totalquiz;

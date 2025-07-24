import React, { useEffect, useState } from "react";
import axios from "axios";


const TotalStudents = () => {
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:5000/api/total_students`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erreur réseau");
        }
        return res.json();
      })
      .then(data => {
    setTotalStudents(data.total_students);
  })
    .catch(error => {
      console.error("Error fetching total students:", error);
    });
}, [] );

return (
  <p style={{ color: "white" }}>{totalStudents}</p>
);
};

export default TotalStudents;

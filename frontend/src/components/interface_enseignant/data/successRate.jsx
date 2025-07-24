import React, { useEffect, useState } from "react";

const SuccessRate = ({ teacherId }) => {
  const [successRate, setSuccessRate] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teacherId) return;

    setLoading(true);

    fetch(`http://localhost:5000/api/success_rate/${teacherId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success_rate !== undefined) {
          setSuccessRate(data.success_rate);
        } else {
          setError(data.message || "No data available.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching success rate:", error);
        setError("Something went wrong while fetching data.");
        setLoading(false);
      });
  }, [teacherId]);

  if (loading) return <p style={{ color: "white" }}>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <p style={{ color: "white" }}>{successRate}%</p>
  );
};

export default SuccessRate;

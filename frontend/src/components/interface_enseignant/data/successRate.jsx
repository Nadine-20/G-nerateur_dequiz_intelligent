import React, { useEffect, useState } from "react";

const SuccessRate = ({ teacherId }) => {
  const [successRate, setSuccessRate] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teacherId) return;

    const fetchSuccessRate = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/success_rate/${teacherId}`);
        if (!res.ok) throw new Error("Network response was not ok");

        const data = await res.json();
        if (data.success_rate !== undefined) {
          setSuccessRate(data.success_rate);
        } else {
          setError(data.message || "No data available.");
        }
      } catch (err) {
        console.error("Error fetching success rate:", err);
        setError("Something went wrong while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSuccessRate();
  }, [teacherId]);

  if (loading) return <p style={{ color: "white" }}>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <p style={{ color: "white" }}>
      {successRate !== null ? `${successRate}%` : "No success rate available"}
    </p>
  );
};

export default SuccessRate;

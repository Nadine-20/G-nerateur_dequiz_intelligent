import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

const LineProgressChart = ({ teacherId }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    if (!teacherId) return;

    fetch(`http://localhost:5000/api/monthly_performance/${teacherId}`)
      .then(res => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then(result => {
        const monthlyPerformance = result.monthly_performance || [];

        const labels = monthlyPerformance.map(item => item._id);
        const data = monthlyPerformance.map(item => item.count);

        setChartData({
          labels,
          datasets: [
            {
              label: "Performance moyenne",
              data,
              fill: false,
              borderColor: "#1e64f0",
              backgroundColor: "#1e64f0",
              tension: 0.3,
              pointRadius: 5,
              pointHoverRadius: 7,
            }
          ]
        });
      })
      .catch(error => {
        console.error("Error fetching monthly performance:", error);
      });
  }, [teacherId]);


  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw}%`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
          stepSize: 20
        },
        title: {
          display: true,
          text: "Score (%)",
          font: { size: 14 }
        }
      },
      x: {
        title: {
          display: false
        }
      }
    }
  };

  return (
    <div>
      <h3 style={{ textAlign: "left", marginBottom: "10px" }}>
        Performance des élèves
      </h3>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineProgressChart;

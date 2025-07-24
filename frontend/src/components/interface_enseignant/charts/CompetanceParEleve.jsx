import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const QuizBarChartWithRollList = ({ teacherId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState("");

  useEffect(() => {
    if (!teacherId) return;

    fetch(`http://localhost:5000/api/quiz_scores/${teacherId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erreur réseau");
        }
        return res.json();
      })
      .then((quizList) => {
        setQuizzes(quizList);
        if (quizList.length > 0) {
          setSelectedQuizId(quizList[0].quizId);
          setSelectedQuiz(quizList[0]);
          if (quizList[0].scores.length > 0) {
            setSelectedStudentId(quizList[0].scores[0].userId);
          }
        }
      })
      .catch((err) =>
        console.error("Erreur lors du chargement des quiz:", err)
      );
  }, [teacherId]);

  useEffect(() => {
    const quiz = quizzes.find((q) => q.quizId === selectedQuizId);
    setSelectedQuiz(quiz);
    if (quiz && quiz.scores.length > 0) {
      setSelectedStudentId(quiz.scores[0].userId);
    }
  }, [selectedQuizId, quizzes]);

  if (!selectedQuiz || selectedQuiz.scores.length === 0) {
    return <p>Aucune donnée disponible pour ce quiz.</p>;
  }

  const selectedStudent = selectedQuiz.scores.find(
    (s) => s.userId === selectedStudentId
  );

  const chartData = {
    labels: [selectedStudent?.name || "Inconnu"],
    datasets: [
      {
        label: "Score (%)",
        data: [selectedStudent?.percentage || 0],
        backgroundColor:
          selectedStudent?.percentage >= 50
            ? "rgba(75, 192, 192, 0.7)"
            : "rgba(255, 99, 132, 0.7)",
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Score (%)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Élève",
        },
      },
    },
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h3 style={{ marginBottom: "10px" }}>Score d’un élève</h3>

      {/* Quiz Dropdown */}
      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="quiz-select" style={{ fontWeight: "bold" }}>
          Sélectionnez un quiz :
        </label>
        <select
          id="quiz-select"
          value={selectedQuizId}
          onChange={(e) => setSelectedQuizId(e.target.value)}
          style={{ marginLeft: "10px", padding: "6px", borderRadius: "6px" }}
        >
          {quizzes.map((quiz) => (
            <option key={quiz.quizId} value={quiz.quizId}>
              {quiz.title} ({quiz.subject})
            </option>
          ))}
        </select>
      </div>

      {/* Student Dropdown */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="student-select" style={{ fontWeight: "bold" }}>
          Sélectionnez un élève :
        </label>
        <select
          id="student-select"
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
          style={{ marginLeft: "10px", padding: "6px", borderRadius: "6px" }}
        >
          {selectedQuiz.scores.map((student) => (
            <option key={student.userId} value={student.userId}>
              {student.name}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <Bar data={chartData} options={chartOptions} />

      {/* Selected Student Info */}
      <div style={{ marginTop: "30px" }}>
        <h4>Détails de l’élève sélectionné :</h4>
        {selectedStudent ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px",
              borderRadius: "8px",
              backgroundColor:
                selectedStudent.percentage >= 50 ? "#d4edda" : "#f8d7da",
              color:
                selectedStudent.percentage >= 50 ? "#155724" : "#721c24",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            <span>{selectedStudent.name}</span>
            <span>
              {selectedStudent.percentage}%{" "}
              {selectedStudent.percentage >= 50 ? "✅ Réussi" : "❌ Échoué"}
            </span>
          </div>
        ) : (
          <p>Aucun élève sélectionné.</p>
        )}
      </div>
    </div>
  );
};

export default QuizBarChartWithRollList;

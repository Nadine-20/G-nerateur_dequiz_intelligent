import React, { useState } from "react";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";


ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);


const fakeDatabase = {
    "Classe A": {
        "Emilie Lefevre": [82, 70, 78, 65, 85, 74],
        "Antoine Dubois": [60, 90, 68, 72, 80, 60],
    },
    "Classe B": {
        "Lucas Bernard": [45, 55, 50, 60, 40, 70],
        "Camille Robert": [90, 85, 88, 92, 80, 89],
    },
};

const RadarSkillsChart = () => {
    const classList = Object.keys(fakeDatabase);
    const [selectedClass, setSelectedClass] = useState(classList[0]);
    const [selectedStudent, setSelectedStudent] = useState(
        Object.keys(fakeDatabase[classList[0]])[0]
    );

    const handleClassChange = (e) => {
        const newClass = e.target.value;
        const firstStudent = Object.keys(fakeDatabase[newClass])[0];
        setSelectedClass(newClass);
        setSelectedStudent(firstStudent);
    };

    const handleStudentChange = (e) => {
        setSelectedStudent(e.target.value);
    };

    const studentSkills = fakeDatabase[selectedClass][selectedStudent];
    const average = studentSkills.reduce((sum, val) => sum + val, 0) / studentSkills.length;


    const data = {
        labels: [
            "Mathématiques",
            "Langue",
            "Logique",
            "Créativité",
            "Résolution de problèmes",
            "Mémoire",
        ],
        datasets: [
            {
                label: selectedStudent,
                data: studentSkills,
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
                pointBackgroundColor: "rgba(54, 162, 235, 1)",
                borderWidth: 2,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            r: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    stepSize: 20,
                    callback: (value) => `${value}%`,
                },
                pointLabels: {
                    font: {
                        size: 14,
                    },
                },
            },
        },
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.raw}%`,
                },
            },
        },
    };

    return (
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
            <h3 style={{ marginBottom: "10px" }}>Profil de compétences</h3>

            <div style={{ marginBottom: "15px" }}>
                <label htmlFor="class-select" style={{ fontWeight: "bold" }}>
                    Classe :
                </label>
                <select
                    id="class-select"
                    value={selectedClass}
                    onChange={handleClassChange}
                    style={{ margin: "0 10px", padding: "6px", borderRadius: "6px" }}
                >
                    {classList.map((classe) => (
                        <option key={classe} value={classe}>
                            {classe}
                        </option>
                    ))}
                </select>

                <label htmlFor="student-select" style={{ fontWeight: "bold" }}>
                    Élève :
                </label>
                <select
                    id="student-select"
                    value={selectedStudent}
                    onChange={handleStudentChange}
                    style={{ marginLeft: "10px", padding: "6px", borderRadius: "6px" }}
                >
                    {Object.keys(fakeDatabase[selectedClass]).map((student) => (
                        <option key={student} value={student}>
                            {student}
                        </option>
                    ))}
                </select>
            </div>

            <Radar data={data} options={options} /><br />
            <div style={{ textAlign: "center", fontSize: "18px", fontWeight: "bold" }}>
                Moyenne de {selectedStudent} : {average.toFixed(2)}%
            </div>

        </div>
    );
};

export default RadarSkillsChart;




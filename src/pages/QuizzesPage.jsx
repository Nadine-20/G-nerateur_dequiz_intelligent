import React, { useState } from 'react';
import './QuizzesPage.css';

const courses = [
  {
    id: 1,
    title: "Introduction à l’analyse",
    chapters: [
      {
        id: 1,
        quiz: {
          question: "2 + 2 = ?",
          options: ["3", "4", "5", "6"],
          answer: 1
        }
      },
      {
        id: 2,
        quiz: {
          question: "5 * 3 = ?",
          options: ["15", "10", "20", "18"],
          answer: 0
        }
      },
      {
        id: 3,
        quiz: {
          question: "2 * 6 = ?",
          options: ["10", "12", "14", "16"],
          answer: 1
        }
      }
    ]
  },
  {
    id: 2,
    title: "Données et structure",
    chapters: [
      {
        id: 1,
        quiz: {
          question: "Combien de bits dans un octet ?",
          options: ["4", "8", "16", "32"],
          answer: 1
        }
      },
      {
        id: 2,
        quiz: {
          question: "Quel est le type de données pour du texte ?",
          options: ["int", "float", "string", "bool"],
          answer: 2
        }
      }
    ]
  },
  {
    id: 3,
    title: "Structures algorithmiques",
    chapters: [
      {
        id: 1,
        quiz: {
          question: "Quelle structure permet les répétitions ?",
          options: ["if", "while", "switch", "case"],
          answer: 1
        }
      },
      {
        id: 2,
        quiz: {
          question: "Que fait une condition ?",
          options: ["Elle répète du code", "Elle teste une expression", "Elle trie les données", "Elle stocke une valeur"],
          answer: 1
        }
      }
    ]
  }
];

function QuizzesPage() {
  const [currentCourseIndex, setCurrentCourseIndex] = useState(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [unlockedCourses, setUnlockedCourses] = useState([0]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});

  const handleAnswer = (selectedIndex) => {
    const chapterKey = `${currentCourseIndex}-${currentChapterIndex}`;
    if (!answered.includes(chapterKey)) {
      const currentChapter = courses[currentCourseIndex].chapters[currentChapterIndex];
      if (selectedIndex === currentChapter.quiz.answer) {
        setScore(score + 1);
      }
      setAnswered([...answered, chapterKey]);
      setUserAnswers({ ...userAnswers, [chapterKey]: selectedIndex });
    }
  };

  const resetQuiz = () => {
    setScore(0);
    setShowResult(false);
    setCurrentChapterIndex(0);
    setAnswered([]);
    setUserAnswers({});
  };

  const startCourse = (index) => {
    setCurrentCourseIndex(index);
    setCurrentChapterIndex(0);
    setScore(0);
    setShowResult(false);
    setAnswered([]);
    setUserAnswers({});
  };

  const percentage = Math.round(
    (score / courses[currentCourseIndex]?.chapters.length) * 100
  );

  return (
    <div className="container">
      {currentCourseIndex === null ? (
        <>
          <h2>Mes cours</h2>
          {courses.map((course, index) => (
            <div className="course-card" key={course.id}>
              <h3>{course.title}</h3>
              {unlockedCourses.includes(index) ? (
                <button className="button" onClick={() => startCourse(index)}>
                  Commencer le quiz
                </button>
              ) : (
                <span style={{ color: "gray" }}>Verrouillé</span>
              )}
            </div>
          ))}
        </>
      ) : showResult ? (
        <div className="result-screen">
          <div className="score-circle">
            <h1>{percentage}%</h1>
            <p>
              Vous avez obtenu {score} / {courses[currentCourseIndex].chapters.length} bonnes réponses.
            </p>
          </div>

          {courses[currentCourseIndex].chapters.map((chapter, idx) => {
            const chapterKey = `${currentCourseIndex}-${idx}`;
            const userAnswer = userAnswers[chapterKey];
            const correctAnswer = chapter.quiz.answer;

            return (
              <div key={idx} className="question-review">
                <p><strong>Q{idx + 1}:</strong> {chapter.quiz.question}</p>
                <ul>
                  {chapter.quiz.options.map((option, optIndex) => {
                    const isSelected = optIndex === userAnswer;
                    const isCorrect = userAnswer === correctAnswer;

                    let className = "";
                    if (isSelected && isCorrect) className = "selected-correct";
                    else if (isSelected && !isCorrect) className = "selected-wrong";

                    return (
                      <li key={optIndex} className={className}>
                        {option}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}

          {percentage < 70 ? (
            <>
              <p>Sélectionnez Recommencer pour réessayer le quiz.</p>
              <button className="button" onClick={resetQuiz}>🔁 Recommencer</button>
            </>
          ) : (
            <>
              <p>Félicitations ! Vous avez terminé ce quiz.</p>
              {/* Déverrouiller le cours suivant si possible */}
              {currentCourseIndex + 1 < courses.length && !unlockedCourses.includes(currentCourseIndex + 1) && (
                setUnlockedCourses([...unlockedCourses, currentCourseIndex + 1])
              )}
            </>
          )}

          <button
            className="button"
            onClick={() => {
              setCurrentCourseIndex(null);
              setShowResult(false);
              setScore(0);
              setCurrentChapterIndex(0);
              setUserAnswers({});
            }}
          >
            ⬅ Retour à l’accueil
          </button>
        </div>
      ) : (
        <div className="course-card">
          <h3>{courses[currentCourseIndex].title} - Quiz {currentChapterIndex + 1}</h3>
          <p>{courses[currentCourseIndex].chapters[currentChapterIndex].quiz.question}</p>
          <div className="quiz-options">
            {courses[currentCourseIndex].chapters[currentChapterIndex].quiz.options.map((opt, idx) => (
              <button key={idx} className="button" onClick={() => handleAnswer(idx)}>
                {opt}
              </button>
            ))}
          </div>

          <div className="navigation-arrows">
            <button
              className="nav-arrow"
              disabled={currentChapterIndex === 0}
              onClick={() => setCurrentChapterIndex(currentChapterIndex - 1)}
            >
              ⬅ Précédent
            </button>
            {currentChapterIndex < courses[currentCourseIndex].chapters.length - 1 ? (
              <button
                className="nav-arrow"
                onClick={() => setCurrentChapterIndex(currentChapterIndex + 1)}
              >
                Suivant ➡
              </button>
            ) : (
              <button className="nav-arrow" onClick={() => setShowResult(true)}>
                Voir le résultat
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizzesPage;

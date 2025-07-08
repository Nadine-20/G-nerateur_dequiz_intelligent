import React, { useState } from 'react';
import { FaCheck, FaTimes, FaArrowLeft, FaArrowRight, FaRedo, FaLock } from 'react-icons/fa';
import './QuizzesPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const courses = [
  {
    id: 1,
    quizId: "quiz_001",
    title: "Introduction à l'analyse",
    description: "Maîtrisez les bases de l'analyse mathématique avec ce cours complet.",
    chapters: [
      {
        id: 1,
        quiz: {
          question: "Quelle est la valeur de 2 + 2 ?",
          options: ["3", "4", "5", "6"],
          answer: 1
        }
      },
      {
        id: 2,
        quiz: {
          question: "Quel est le résultat de 5 × 3 ?",
          options: ["15", "10", "20", "18"],
          answer: 0
        }
      },
      {
        id: 3,
        quiz: {
          question: "Calculez 2 × 6",
          options: ["10", "12", "14", "16"],
          answer: 1
        }
      }
    ]
  },
  {
    id: 2,
    quizId: "quiz_002",
    title: "Données et structure",
    description: "Apprenez les structures de données fondamentales en informatique.",
    chapters: [
      {
        id: 1,
        quiz: {
          question: "Combien de bits composent un octet ?",
          options: ["4", "8", "16", "32"],
          answer: 1
        }
      },
      {
        id: 2,
        quiz: {
          question: "Quel type de données est utilisé pour représenter du texte ?",
          options: ["int", "float", "string", "bool"],
          answer: 2
        }
      }
    ]
  },
  // Nouveau quiz ajouté : "Structures algorithmiques"
  {
    id: 3,
    quizId: "quiz_003",
    title: "Structures algorithmiques",
    description: "Découvrez les structures de contrôle essentielles en programmation.",
    chapters: [
      {
        id: 1,
        quiz: {
          question: "Quelle structure permet d'exécuter du code de manière répétée ?",
          options: ["if", "while", "switch", "case"],
          answer: 1
        }
      },
      {
        id: 2,
        quiz: {
          question: "Quel est le rôle principal d'une structure conditionnelle ?",
          options: [
            "Répéter du code",
            "Tester une expression booléenne",
            "Trier des données",
            "Stocker une valeur"
          ],
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
  const [selectedOptions, setSelectedOptions] = useState({});
  const [answered, setAnswered] = useState([]);


  const [userInfo, setUser] = useState(() => {
    const storedUser = localStorage.getItem('userInfo');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();

  const handleAnswer = (optionIndex) => {
    const chapterKey = `${currentCourseIndex}-${currentChapterIndex}`;
    if (!answered.includes(chapterKey)) {
      setSelectedOptions({
        ...selectedOptions,
        [chapterKey]: optionIndex
      });
      setAnswered([...answered, chapterKey]);

      const currentChapter = courses[currentCourseIndex].chapters[currentChapterIndex];
      if (optionIndex === currentChapter.quiz.answer) {
        setScore(score + 1);
      }
    }
  };

  const resetQuiz = () => {
    setScore(0);
    setShowResult(false);
    setCurrentChapterIndex(0);
    setSelectedOptions({});
    setAnswered([]);
  };

  const startCourse = (index) => {
    setCurrentCourseIndex(index);
    resetQuiz();
  };

  const percentage = Math.round(
    (score / courses[currentCourseIndex]?.chapters.length) * 100
  );

  const submitResults = () => {
    const chapterKeys = Object.keys(selectedOptions);
    const answers = {};

    chapterKeys.forEach(key => {
      const [_, chapterIndex] = key.split("-");
      const chapter = courses[currentCourseIndex].chapters[parseInt(chapterIndex)];
      const selectedIndex = selectedOptions[key];
      answers[`q${parseInt(chapterIndex) + 1}`] = chapter.quiz.options[selectedIndex];
    });

    const attemptData = {
      userId: "student_001",
      quizId: courses[currentCourseIndex].quizId,
      score: score,
      totalQuestions: courses[currentCourseIndex].chapters.length,
      percentage: percentage,
      submittedAt: new Date().toISOString(),
      answers: answers
    };

    axios.post("http://localhost:5000/api/attempts", attemptData)
      .then(res => {
        console.log("Tentative enregistrée :", res.data);
      })
      .catch(err => console.error("Erreur d’envoi :", err));
  };

  const goToNextChapter = () => {
    if (currentChapterIndex < courses[currentCourseIndex].chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    } else {
      setShowResult(true);
      submitResults();
      if (
        currentCourseIndex + 1 < courses.length &&
        !unlockedCourses.includes(currentCourseIndex + 1) &&
        score / courses[currentCourseIndex].chapters.length >= 0.7
      ) {
        setUnlockedCourses([...unlockedCourses, currentCourseIndex + 1]);
      }
    }
  };

  const goToPrevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };

  const currentChapter = currentCourseIndex !== null
    ? courses[currentCourseIndex].chapters[currentChapterIndex]
    : null;

  if (!userInfo) {
    return navigate("/login");
  }


  return (
    <div className="quizzes-container">
      {currentCourseIndex === null ? (
        <>
          <div className="courses-header">
            <h1>Parcours d'apprentissage</h1>
            <p>Sélectionnez un cours pour commencer votre quiz et tester vos connaissances.</p>
          </div>

          <div className="courses-grid">
            {courses.map((course, index) => (
              <div
                key={course.id}
                className={`course-card ${unlockedCourses.includes(index) ? '' : 'locked'}`}
              >
                <div className="course-image">
                  {index + 1}
                </div>
                <div className="course-content">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  {unlockedCourses.includes(index) ? (
                    <button
                      className="start-btn"
                      onClick={() => startCourse(index)}
                    >
                      Commencer
                    </button>
                  ) : (
                    <div className="locked-badge">
                      <FaLock /> Verrouillé
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : showResult ? (
        <div className="results-screen">
          <h2>Résultats du quiz</h2>
          <div className="result-score">{score}/{courses[currentCourseIndex].chapters.length}</div>
          <div className="result-percentage">{percentage}% de réussite</div>

          {percentage >= 70 ? (
            <div className="result-message success">
              <FaCheck /> Félicitations ! Vous avez réussi ce quiz.
            </div>
          ) : (
            <div className="result-message warning">
              <FaTimes /> Vous pouvez faire mieux ! Essayez à nouveau.
            </div>
          )}

          <div className="question-review">
            {courses[currentCourseIndex].chapters.map((chapter, index) => {
              const chapterKey = `${currentCourseIndex}-${index}`;
              const userAnswer = selectedOptions[chapterKey];
              const isCorrect = userAnswer === chapter.quiz.answer;

              return (
                <div key={index} className="review-item">
                  <div className="review-question">
                    Question {index + 1}: {chapter.quiz.question}
                  </div>
                  <div>
                    Votre réponse: {chapter.quiz.options[userAnswer]}
                    <div className={`review-answer ${isCorrect ? 'correct' : 'incorrect'}`}>
                      {isCorrect ? (
                        <><FaCheck /> Correct!</>
                      ) : (
                        <><FaTimes /> La bonne réponse était: {chapter.quiz.options[chapter.quiz.answer]}</>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="result-actions">
            {percentage < 70 && (
              <button className="action-btn restart-btn" onClick={resetQuiz}>
                <FaRedo /> Recommencer
              </button>
            )}
            <button
              className="action-btn return-btn"
              onClick={() => setCurrentCourseIndex(null)}
            >
              <FaArrowLeft /> Retour aux cours
            </button>
          </div>
        </div>
      ) : (
        <div className="quiz-screen">
          <div className="quiz-header">
            <div className="quiz-title">
              {courses[currentCourseIndex].title}
            </div>
            <div className="quiz-progress">
              Question {currentChapterIndex + 1}/{courses[currentCourseIndex].chapters.length}
            </div>
          </div>

          <div className="quiz-question">
            {currentChapter.quiz.question}
          </div>

          <div className="quiz-options">
            {currentChapter.quiz.options.map((option, index) => {
              const chapterKey = `${currentCourseIndex}-${currentChapterIndex}`;
              const isSelected = selectedOptions[chapterKey] === index;
              let className = 'option-btn';

              if (isSelected) {
                className += ' selected';
                if (answered.includes(chapterKey)) {
                  className += currentChapter.quiz.answer === index ? ' correct' : ' incorrect';
                }
              }

              return (
                <button
                  key={index}
                  className={className}
                  onClick={() => handleAnswer(index)}
                  disabled={answered.includes(chapterKey)}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="quiz-navigation">
            <button
              className="nav-btn prev-btn"
              onClick={goToPrevChapter}
              disabled={currentChapterIndex === 0}
            >
              <FaArrowLeft /> Précédent
            </button>
            <button
              className="nav-btn next-btn"
              onClick={goToNextChapter}
              disabled={!answered.includes(`${currentCourseIndex}-${currentChapterIndex}`)}
            >
              {currentChapterIndex < courses[currentCourseIndex].chapters.length - 1 ? (
                <>Suivant <FaArrowRight /></>
              ) : (
                "Voir les résultats"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizzesPage;

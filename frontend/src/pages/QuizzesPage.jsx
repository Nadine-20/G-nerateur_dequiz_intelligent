import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaArrowLeft, FaArrowRight, FaRedo, FaLock } from 'react-icons/fa';
import './QuizzesPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Redirect from '../components/Redirect';

function QuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [answered, setAnswered] = useState([]);
  const [quizResults, setQuizResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userInfo] = useState(() => {
    const storedUser = localStorage.getItem('userInfo');
    return storedUser ? JSON.parse(storedUser) : null;
  });


  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/quizzes");

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid data format received from server');
        }

        const transformedQuizzes = response.data.map(quiz => ({
          ...quiz,
          questions: quiz.questions.map((q, index) => ({
            id: `q_${index}`,
            questionText: q.question || q.questionText,
            type: 'Qcm',
            options: q.options.map((option, optIndex) => ({
              label: String.fromCharCode(65 + optIndex), // A, B, C, D
              text: option,
              isCorrect: q.correctAnswer === String.fromCharCode(65 + optIndex)
            })),
            answer: q.correctAnswer,
            correctAnswers: [q.correctAnswer]
          }))
        }));

        setQuizzes(transformedQuizzes);
        setLoading(false);
      } catch (err) {
        console.error("Error loading quizzes:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (!userInfo) {
    return <Redirect />;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading quizzes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Quizzes</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  const currentQuiz = currentQuizIndex !== null ? quizzes[currentQuizIndex] : null;
  const currentQuestion = currentQuiz?.questions?.[currentQuestionIndex];

  const handleAnswer = (answer) => {
    const questionId = currentQuestion.id;

    if (answered.includes(questionId)) return;

    const isCorrect = checkCorrectAnswer(currentQuestion, answer);

    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: {
        answer,
        isCorrect,
        timestamp: new Date().toISOString()
      }
    }));

    setAnswered(prev => [...prev, questionId]);
    if (isCorrect) setScore(prev => prev + 1);
  };

  const checkCorrectAnswer = (question, answer) => {
    return question.correctAnswers.includes(answer);
  };

  const getCorrectAnswer = (question) => {
    const correctOption = question.options.find(opt => opt.isCorrect);
    return correctOption?.text;
  };

  const saveAttemptToDatabase = async () => {
    if (!userInfo?._id) {
      alert("You must be logged in to save your results");
      return;
    }

    const percentage = Math.round((score / currentQuiz.questions.length) * 100);
    const attemptData = {
      userId: userInfo._id,
      quizId: currentQuiz._id,
      score: score,
      totalQuestions: currentQuiz.questions.length,
      percentage: percentage,
      submittedAt: new Date().toISOString(),
      answers: Object.entries(selectedAnswers).reduce((acc, [qId, answerData]) => {
        acc[qId] = {
          answer: answerData.answer,
          isCorrect: answerData.isCorrect
        };
        return acc;
      }, {})
    };

    try {
      await axios.post(
        `http://localhost:5000/api/quizzes/${currentQuiz._id}/attempt`,
        attemptData
      );

      setQuizResults(prev => ({
        ...prev,
        [currentQuizIndex]: {
          score,
          total: currentQuiz.questions.length,
          percentage
        }
      }));
    } catch (err) {
      console.error("Failed to save attempt:", err);
    }
  };

  const goToNext = () => {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setInputValue('');
    } else {
      setShowResult(true);
      saveAttemptToDatabase();
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswers({});
    setAnswered([]);
    setShowResult(false);
    setInputValue('');
  };

  const isQuizLocked = (index) => {
    if (index === 0) return false; 

    const previousResult = quizResults[index - 1];
    return !previousResult || previousResult.percentage < 50;
  };

  return (
    <div className="quizzes-container">
      {currentQuizIndex === null ? (
        <>
          <div className="courses-header">
            <h1>Learning Path</h1>
            <p>Select a course to start your quiz and test your knowledge.</p>
          </div>

          <div className="courses-grid">
            {quizzes.map((quiz, index) => (
              <div key={quiz._id} className={`course-card ${isQuizLocked(index) ? 'locked' : ''}`}>
                <div className="course-image">
                  {isQuizLocked(index) ? <FaLock className="lock-icon" /> : index + 1}
                </div>
                <div className="course-content">
                  <h3>{quiz.title}</h3>
                  <p>{quiz.description}</p>
                  {isQuizLocked(index) ? (
                    <div className="lock-message">
                      Score ≥50% in previous quiz to unlock
                      {quizResults[index - 1] && (
                        <span className="previous-score">
                          (Your score: {quizResults[index - 1].percentage}%)
                        </span>
                      )}
                    </div>
                  ) : (
                    <button
                      className="start-btn"
                      onClick={() => setCurrentQuizIndex(index)}
                    >
                      Start
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : showResult ? (
        <div className="results-screen">
          <h2>Quiz Results</h2>
          <div className="result-score">{score}/{currentQuiz.questions.length}</div>
          <div className="result-percentage">{Math.round((score / currentQuiz.questions.length) * 100)}% Success</div>

          <div className={`result-message ${score / currentQuiz.questions.length >= 0.7 ? 'success' : 'warning'}`}>
            {score / currentQuiz.questions.length >= 0.7 ? (
              <><FaCheck /> Congratulations! You passed this quiz.</>
            ) : (
              <><FaTimes /> You need at least 70% to pass.</>
            )}
          </div>

          <div className="question-review">
            {currentQuiz.questions.map((question, index) => {
              const questionId = question.id;
              const userAnswer = selectedAnswers[questionId]?.answer;
              const isCorrect = checkCorrectAnswer(question, userAnswer);

              return (
                <div key={index} className="review-item">
                  <div className="review-question">
                    <strong>Question {index + 1}:</strong> {question.questionText}
                  </div>
                  <div className="review-answer-container">
                    <div>Your answer: {userAnswer || "No answer"}</div>
                    <div className={`review-answer ${isCorrect ? 'correct' : 'incorrect'}`}>
                      {isCorrect ? (
                        <><FaCheck /> Correct!</>
                      ) : (
                        <><FaTimes /> Correct answer: {getCorrectAnswer(question)}</>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="result-actions">
            <button className="action-btn restart-btn" onClick={resetQuiz}>
              <FaRedo /> Restart
            </button>
            <button className="action-btn return-btn" onClick={() => {
              setCurrentQuizIndex(null);
              resetQuiz();
            }}>
              <FaArrowLeft /> Back to courses
            </button>
          </div>
        </div>
      ) : (
        <div className="quiz-screen">
          <div className="quiz-header">
            <div className="quiz-title">{currentQuiz.title}</div>
            <div className="quiz-progress">
              Question {currentQuestionIndex + 1}/{currentQuiz.questions.length}
            </div>
          </div>

          <div className="question-display">
            <h3 className="question-text">{currentQuestion.questionText}</h3>
          </div>

          <div className="quiz-options">
            {currentQuestion.options.map(opt => {
              const isSelected = selectedAnswers[currentQuestion.id]?.answer === opt.label;
              const showFeedback = answered.includes(currentQuestion.id);

              return (
                <button
                  key={opt.label}
                  className={`option-btn ${isSelected ? 'selected' : ''} ${showFeedback ? (opt.isCorrect ? 'correct' : 'incorrect') : ''
                    }`}
                  onClick={() => !answered.includes(currentQuestion.id) && handleAnswer(opt.label)}
                  disabled={answered.includes(currentQuestion.id)}
                >
                  {opt.label}. {opt.text}
                </button>
              );
            })}
          </div>

          <div className="quiz-navigation">
            <button
              className="nav-btn prev-btn"
              onClick={() => {
                setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
                setInputValue('');
              }}
              disabled={currentQuestionIndex === 0}
            >
              <FaArrowLeft /> Previous
            </button>

            <button
              className="nav-btn next-btn"
              onClick={goToNext}
              disabled={!answered.includes(currentQuestion.id)}
            >
              {currentQuestionIndex < currentQuiz.questions.length - 1 ? (
                <>Next <FaArrowRight /></>
              ) : "View Results"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizzesPage;
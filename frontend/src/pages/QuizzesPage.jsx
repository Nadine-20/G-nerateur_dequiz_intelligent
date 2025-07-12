import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaArrowLeft, FaArrowRight, FaRedo } from 'react-icons/fa';
import './QuizzesPage.css';
import axios from 'axios';

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

  useEffect(() => {
    axios.get("http://localhost:5000/api/quizzes")
      .then(res => setQuizzes(res.data))
      .catch(err => console.error("Erreur de chargement des quizzes:", err));
  }, []);

  const currentQuiz = currentQuizIndex !== null ? quizzes[currentQuizIndex] : null;
  const currentQuestion = currentQuiz?.questions?.[currentQuestionIndex];

  const handleAnswer = (answer) => {
    const questionId = currentQuestion.id;
    const isCorrect = checkCorrectAnswer(currentQuestion, answer);

    setSelectedAnswers(prev => ({ ...prev, [questionId]: answer }));
    setAnswered(prev => [...new Set([...prev, questionId])]);
    if (isCorrect) setScore(prev => prev + 1);
  };

  const checkCorrectAnswer = (question, answer) => {
    if (question.type === 'Qcm') {
      const correctOption = question.options.find(opt => opt.isCorrect);
      return correctOption?.label === answer;
    } else if (question.type === 'true/false') {
      return question.answer === answer;
    } else if (question.type === 'open-ended') {
      return question.correctAnswers.includes(answer.trim());
    }
    return false;
  };

  const saveAttemptToDatabase = () => {
    const percentage = Math.round((score / currentQuiz.questions.length) * 100);
    const attemptData = {
      userId: "user_001",
      quizId: currentQuiz._id,
      score: score,
      totalQuestions: currentQuiz.questions.length,
      percentage: percentage,
      submittedAt: new Date().toISOString(),
      answers: selectedAnswers
    };

    axios.post(`http://localhost:5000/api/quizzes/${currentQuiz._id}/attempt`, attemptData)
      .then(res => console.log("Tentative enregistrée :", res.data))
      .catch(err => console.error("Erreur lors de l'enregistrement :", err));

    // Sauvegarde du résultat localement pour verrouillage futur
    setQuizResults(prev => ({
      ...prev,
      [currentQuizIndex]: {
        score,
        total: currentQuiz.questions.length,
        percentage
      }
    }));
  };

  const goToNext = () => {
    if (
      currentQuestion.type === 'open-ended' &&
      !answered.includes(currentQuestion.id)
    ) {
      handleAnswer(inputValue);
      return;
    }

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
    return !previousResult || previousResult.percentage < 70;
  };

  return (
    <div className="quizzes-container">
      {currentQuizIndex === null ? (
        <>
          <div className="courses-header">
            <h1>Parcours d'apprentissage</h1>
            <p>Sélectionnez un cours pour commencer votre quiz et tester vos connaissances.</p>
          </div>

          <div className="courses-grid">
            {quizzes.map((quiz, index) => (
              <div key={quiz._id} className="course-card">
                <div className="course-image">{index + 1}</div>
                <div className="course-content">
                  <h3>{quiz.title}</h3>
                  <p>{quiz.description}</p>
                  <button
                    className="start-btn"
                    onClick={() => !isQuizLocked(index) && setCurrentQuizIndex(index)}
                    disabled={isQuizLocked(index)}
                  >
                    {isQuizLocked(index) ? 'Verrouillé' : 'Commencer'}
                  </button>
                  {isQuizLocked(index) && (
                    <p className="locked-message">
                     
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : showResult ? (
        <div className="results-screen">
          <h2>Résultats du quiz</h2>
          <div className="result-score">{score}/{currentQuiz.questions.length}</div>
          <div className="result-percentage">{Math.round((score / currentQuiz.questions.length) * 100)}% de réussite</div>

          <div className={`result-message ${score / currentQuiz.questions.length >= 0.7 ? 'success' : 'warning'}`}>
            {score / currentQuiz.questions.length >= 0.7 ? (
              <><FaCheck /> Félicitations ! Vous avez réussi ce quiz.</>
            ) : (
              <><FaTimes /> Vous devez obtenir au moins 70% pour réussir.</>
            )}
          </div>

          <div className="question-review">
            {currentQuiz.questions.map((question, index) => {
              const questionId = question.id;
              const userAnswer = selectedAnswers[questionId];
              const isCorrect = checkCorrectAnswer(question, userAnswer);

              return (
                <div key={index} className="review-item">
                  <div className="review-question">
                    Question {index + 1}: {question.questionText}
                  </div>
                  <div>
                    Votre réponse: {userAnswer}
                    <div className={`review-answer ${isCorrect ? 'correct' : 'incorrect'}`}>
                      {isCorrect ? (
                        <><FaCheck /> Correct!</>
                      ) : (
                        <><FaTimes /> La bonne réponse était: {getCorrectAnswer(question)}</>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="result-actions">
            <button className="action-btn restart-btn" onClick={resetQuiz}>
              <FaRedo /> Recommencer
            </button>
            <button className="action-btn return-btn" onClick={() => {
              setCurrentQuizIndex(null);
              resetQuiz();
            }}>
              <FaArrowLeft /> Retour aux cours
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

          <div className="quiz-question">{currentQuestion.questionText}</div>

          <div className="quiz-options">
            {currentQuestion.type === 'Qcm' && currentQuestion.options.map(opt => {
              const isSelected = selectedAnswers[currentQuestion.id] === opt.label;
              const isCorrect = opt.isCorrect;
              const showFeedback = answered.includes(currentQuestion.id);
              let className = 'option-btn';
              if (isSelected) {
                className += ' selected';
                if (showFeedback) className += isCorrect ? ' correct' : ' incorrect';
              }
              return (
                <button
                  key={opt.label}
                  className={className}
                  onClick={() => handleAnswer(opt.label)}
                  disabled={answered.includes(currentQuestion.id)}
                >
                  {opt.label}. {opt.text}
                </button>
              );
            })}

            {currentQuestion.type === 'true/false' && [true, false].map(value => {
              const isSelected = selectedAnswers[currentQuestion.id] === value;
              const isCorrect = currentQuestion.answer === value;
              const showFeedback = answered.includes(currentQuestion.id);
              let className = 'option-btn';
              if (isSelected) {
                className += ' selected';
                if (showFeedback) className += isCorrect ? ' correct' : ' incorrect';
              }
              return (
                <button
                  key={value.toString()}
                  className={className}
                  onClick={() => handleAnswer(value)}
                  disabled={answered.includes(currentQuestion.id)}
                >
                  {value ? 'Vrai' : 'Faux'}
                </button>
              );
            })}

            {currentQuestion.type === 'open-ended' && (
              <input
                type="text"
                placeholder="Votre réponse"
                className="open-ended-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={answered.includes(currentQuestion.id)}
              />
            )}
          </div>

          <div className="quiz-navigation">
            <button
              className="nav-btn prev-btn"
              onClick={() => {
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex(currentQuestionIndex - 1);
                  setInputValue('');
                }
              }}
              disabled={currentQuestionIndex === 0}
            >
              <FaArrowLeft /> Précédent
            </button>

            <button
              className="nav-btn next-btn"
              onClick={goToNext}
              disabled={!answered.includes(currentQuestion.id) && currentQuestion.type !== 'open-ended'}
            >
              {currentQuestionIndex < currentQuiz.questions.length - 1 ? (
                <>Suivant <FaArrowRight /></>
              ) : "Voir les résultats"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function getCorrectAnswer(question) {
  if (question.type === 'Qcm') {
    return question.options.find(opt => opt.isCorrect)?.text;
  } else if (question.type === 'true/false') {
    return question.answer ? 'Vrai' : 'Faux';
  } else {
    return question.correctAnswers.join(' ou ');
  }
}

export default QuizzesPage;

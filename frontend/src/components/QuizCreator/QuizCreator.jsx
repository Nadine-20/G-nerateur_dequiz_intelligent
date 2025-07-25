import React, { useState } from 'react';
import './QuizCreator.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const QuizCreator = () => {


  const [userInfo, setUser] = useState(() => {
    const storedUser = localStorage.getItem('userInfo');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();

  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    createdBy: userInfo ? userInfo._id : 'teacher_002',
    subject: 'mathématiques',
    isPublic: true,
    topics: [],
    difficulty: 'débutant',
    timeLimit: 900,
    maxScore: 100,
    questions: []
  });

  // Current question being edited
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    type: 'multiple-choice',
    options: [],
    correctAnswer: null,
    points: 10 // Default points per question
  });

  const [newOption, setNewOption] = useState('');
  const [activeTab, setActiveTab] = useState('info');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add new option to current question
  const addOption = () => {
    if (newOption.trim() === '') return;

    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, newOption]
    });
    setNewOption('');
  };

  // Remove option from current question
  const removeOption = (index) => {
    const updatedOptions = currentQuestion.options.filter((_, i) => i !== index);
    setCurrentQuestion({
      ...currentQuestion,
      options: updatedOptions,
      correctAnswer: currentQuestion.correctAnswer === index ? null : currentQuestion.correctAnswer
    });
  };

  // Save current question to quiz
  const saveQuestion = () => {
    if (currentQuestion.text.trim() === '') {
      alert('Question text cannot be empty');
      return;
    }

    if (currentQuestion.type === 'multiple-choice' && currentQuestion.options.length < 2) {
      alert('Please add at least 2 options');
      return;
    }

    if (currentQuestion.type === 'multiple-choice' && currentQuestion.correctAnswer === null) {
      alert('Please select the correct answer');
      return;
    }

    setQuiz({
      ...quiz,
      questions: [...quiz.questions, currentQuestion]
    });

    // Reset current question
    setCurrentQuestion({
      text: '',
      type: 'multiple-choice',
      options: [],
      correctAnswer: null,
      points: 10
    });

    setActiveTab('questions');
  };

  // Save entire quiz to backend
  const saveQuiz = async () => {
    if (!userInfo || !userInfo._id) {
      toast.error('You must be logged in to create a quiz.');
      return;
    }

    if (quiz.title.trim() === '') {
      alert('Quiz title cannot be empty');
      return;
    }

    if (quiz.questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    // Make sure createdBy is current user ID (valid ObjectId string)
    const quizToSend = {
      ...quiz,
      createdBy: userInfo._id,
    };

    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:5000/api/create-quiz', quizToSend);
      toast.success('Quiz saved successfully!');

      setQuiz({
        title: '',
        description: '',
        createdBy: userInfo._id,
        subject: 'mathématiques',
        isPublic: true,
        topics: [],
        difficulty: 'débutant',
        timeLimit: 900,
        maxScore: 100,
        questions: []
      });
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast.error(`Failed to save quiz: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };


  const removeQuestion = (index) => {
    const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz({
      ...quiz,
      questions: updatedQuestions
    });
  };

  const handleQuizChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuiz({
      ...quiz,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleQuestionPointsChange = (e) => {
    setCurrentQuestion({
      ...currentQuestion,
      points: parseInt(e.target.value) || 0
    });
  };

  return (
    <div className="quiz-creator-container">
      <header className="creator-header">
        <div className="header-content">
          <h1>Create New Quiz</h1>
          <p className="subtitle">Build engaging quizzes for your audience</p>
        </div>
        <div className="header-actions">
          <button
            className="ai-generate-btn"
            onClick={() => navigate('/teacher/quizzes/create/ai')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
              <path d="M18 8l2 2l4-4"></path>
            </svg>
            AI Generator
          </button>
          <button className="preview-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Preview
          </button>
          <button
            className="save-quiz-btn"
            onClick={saveQuiz}
            disabled={quiz.questions.length === 0 || isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Quiz'}
          </button>
        </div>
      </header>

      <div className="creator-tabs">
        <button
          className={`tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Quiz Info
        </button>
        <button
          className={`tab ${activeTab === 'questions' ? 'active' : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          Questions ({quiz.questions.length})
        </button>
        <button
          className={`tab ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          Add Question
        </button>
      </div>

      <div className="creator-main">
        {/* Quiz Metadata Section - Expanded */}
        {activeTab === 'info' && (
          <section className="quiz-metadata">
            <h2 className="section-title">Quiz Information</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quiz-title">Quiz Title*</label>
                <input
                  type="text"
                  id="quiz-title"
                  name="title"
                  value={quiz.title}
                  onChange={handleQuizChange}
                  placeholder="Enter quiz title"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="quiz-subject">Subject*</label>
                <select
                  id="quiz-subject"
                  name="subject"
                  value={quiz.subject}
                  onChange={handleQuizChange}
                >
                  <option value="mathématiques">Mathématiques</option>
                  <option value="physique">Physique</option>
                  <option value="chimie">Chimie</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="quiz-description">Description</label>
              <textarea
                id="quiz-description"
                name="description"
                value={quiz.description}
                onChange={handleQuizChange}
                rows={4}
                placeholder="Describe what this quiz is about..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quiz-difficulty">Difficulty</label>
                <select
                  id="quiz-difficulty"
                  name="difficulty"
                  value={quiz.difficulty}
                  onChange={handleQuizChange}
                >
                  <option value="débutant">Débutant</option>
                  <option value="intermédiaire">Intermédiaire</option>
                  <option value="avancé">Avancé</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="quiz-timeLimit">Time Limit (minutes)</label>
                <input
                  type="number"
                  id="quiz-timeLimit"
                  name="timeLimit"
                  value={quiz.timeLimit / 60}
                  onChange={(e) => setQuiz({ ...quiz, timeLimit: e.target.value * 60 })}
                  min="1"
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={quiz.isPublic}
                  onChange={handleQuizChange}
                />
                Make this quiz public
              </label>
            </div>
          </section>
        )}

        {/* Question Form Section - Updated with points */}
        {activeTab === 'add' && (
          <section className="question-form">
            <h2 className="section-title">Add New Question</h2>

            <div className="form-group">
              <label htmlFor="question-text">Question Text*</label>
              <input
                type="text"
                id="question-text"
                value={currentQuestion.text}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                placeholder="Enter your question here"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Question Type</label>
                <div className="type-selector">
                  {['multiple-choice', 'true-false'].map((type) => (
                    <button
                      key={type}
                      className={`type-option ${currentQuestion.type === type ? 'active' : ''}`}
                      onClick={() => setCurrentQuestion({
                        ...currentQuestion,
                        type,
                        options: type === 'true-false' ? ['True', 'False'] : [],
                        correctAnswer: null
                      })}
                    >
                      {type === 'multiple-choice' ? 'Multiple Choice' : 'True/False'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="question-points">Points</label>
                <input
                  type="number"
                  id="question-points"
                  value={currentQuestion.points}
                  onChange={handleQuestionPointsChange}
                  min="1"
                />
              </div>
            </div>

            {/* Answer Options Section */}
            {currentQuestion.type === 'multiple-choice' && (
              <div className="options-section">
                <h3>Answer Options*</h3>

                <div className="add-option">
                  <input
                    type="text"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder="Enter option text"
                    onKeyPress={(e) => e.key === 'Enter' && addOption()}
                  />
                  <button className="add-option-btn" onClick={addOption}>
                    Add Option
                  </button>
                </div>

                <ul className="options-list">
                  {currentQuestion.options.map((option, index) => (
                    <li key={index} className="option-item">
                      <label className="option-label">
                        <input
                          type="radio"
                          name="correct-answer"
                          checked={currentQuestion.correctAnswer === index}
                          onChange={() => setCurrentQuestion({
                            ...currentQuestion,
                            correctAnswer: index
                          })}
                        />
                        <span className="option-text">{option}</span>
                      </label>
                      <button
                        className="remove-option-btn"
                        onClick={() => removeOption(index)}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {currentQuestion.type === 'true-false' && (
              <div className="options-section">
                <h3>Select Correct Answer</h3>
                <div className="true-false-options">
                  {['True', 'False'].map((option, index) => (
                    <button
                      key={option}
                      className={`tf-option ${currentQuestion.correctAnswer === index ? 'active' : ''}`}
                      onClick={() => setCurrentQuestion({
                        ...currentQuestion,
                        correctAnswer: index
                      })}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="form-actions">
              <button
                className="save-question-btn"
                onClick={saveQuestion}
              >
                Save Question
              </button>
            </div>
          </section>
        )}

        {/* Saved Questions Section */}
        {activeTab === 'questions' && (
          <section className="saved-questions">
            <div className="questions-header">
              <h2 className="section-title">
                Quiz Questions ({quiz.questions.length})
              </h2>
              <button
                className="add-new-btn"
                onClick={() => setActiveTab('add')}
              >
                Add Question
              </button>
            </div>

            {quiz.questions.length === 0 ? (
              <div className="empty-state">
                <h3>No questions added yet</h3>
                <p>Start by adding your first question</p>
                <button
                  className="add-first-btn"
                  onClick={() => setActiveTab('add')}
                >
                  Add First Question
                </button>
              </div>
            ) : (
              <ul className="question-list">
                {quiz.questions.map((question, index) => (
                  <li key={index} className="question-item">
                    <div className="question-header">
                      <div className="question-number">Q{index + 1}</div>
                      <h3>{question.text}</h3>
                      <div className="question-points">{question.points} pts</div>
                      <button
                        className="remove-question-btn"
                        onClick={() => removeQuestion(index)}
                      >
                        ×
                      </button>
                    </div>
                    <div className="question-meta">
                      <span className="question-type">{question.type.replace('-', ' ')}</span>
                    </div>

                    {question.type === 'multiple-choice' && (
                      <ul className="question-options">
                        {question.options.map((option, optIndex) => (
                          <li
                            key={optIndex}
                            className={`option ${optIndex === question.correctAnswer ? 'correct' : ''}`}
                          >
                            {option}
                            {optIndex === question.correctAnswer && (
                              <span className="correct-badge">Correct</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}

                    {question.type === 'true-false' && (
                      <div className="correct-answer">
                        Correct answer: <strong>{question.options[question.correctAnswer]}</strong>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default QuizCreator;
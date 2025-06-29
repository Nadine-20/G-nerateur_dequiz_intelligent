import React, { useState } from 'react';
import './QuizCreator.css';

const QuizCreator = () => {
  // Main quiz state
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    questions: []
  });

  // Current question being edited
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    type: 'multiple-choice',
    options: [],
    correctAnswer: null
  });

  // New option input
  const [newOption, setNewOption] = useState('');
  const [activeTab, setActiveTab] = useState('info');

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
      correctAnswer: null
    });
    
    setActiveTab('questions');
  };

  // Save entire quiz
  const saveQuiz = () => {
    if (quiz.title.trim() === '') {
      alert('Quiz title cannot be empty');
      return;
    }
    
    if (quiz.questions.length === 0) {
      alert('Please add at least one question');
      return;
    }
    
    // Here you would typically send the quiz data to your backend
    console.log('Saving quiz:', quiz);
    alert('Quiz saved successfully!');
    
    // Reset the form
    setQuiz({
      title: '',
      description: '',
      questions: []
    });
  };

  // Remove question from quiz
  const removeQuestion = (index) => {
    const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz({
      ...quiz,
      questions: updatedQuestions
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
            disabled={quiz.questions.length === 0}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            Save Quiz
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
        {/* Quiz Metadata Section */}
        {activeTab === 'info' && (
          <section className="quiz-metadata">
            <h2 className="section-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              Quiz Information
            </h2>
            <div className="form-group">
              <label htmlFor="quiz-title">Quiz Title*</label>
              <input
                type="text"
                id="quiz-title"
                value={quiz.title}
                onChange={(e) => setQuiz({...quiz, title: e.target.value})}
                placeholder="Enter quiz title"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="quiz-description">Description</label>
              <textarea
                id="quiz-description"
                value={quiz.description}
                onChange={(e) => setQuiz({...quiz, description: e.target.value})}
                rows={4}
                placeholder="Describe what this quiz is about..."
              />
            </div>
          </section>
        )}

        {/* Question Form Section */}
        {activeTab === 'add' && (
          <section className="question-form">
            <h2 className="section-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
              Add New Question
            </h2>
            
            <div className="form-group">
              <label htmlFor="question-text">Question Text*</label>
              <input
                type="text"
                id="question-text"
                value={currentQuestion.text}
                onChange={(e) => setCurrentQuestion({...currentQuestion, text: e.target.value})}
                placeholder="Enter your question here"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Question Type</label>
              <div className="type-selector">
                {['multiple-choice', 'true-false', 'short-answer'].map((type) => (
                  <button
                    key={type}
                    className={`type-option ${currentQuestion.type === type ? 'active' : ''}`}
                    onClick={() => setCurrentQuestion({
                      ...currentQuestion, 
                      type,
                      options: [],
                      correctAnswer: null
                    })}
                  >
                    {type === 'multiple-choice' && 'Multiple Choice'}
                    {type === 'true-false' && 'True/False'}
                    {type === 'short-answer' && 'Short Answer'}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Answer Options Section */}
            {currentQuestion.type === 'multiple-choice' && (
              <div className="options-section">
                <h3>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="9 11 12 14 23 3"></polyline>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                  Answer Options*
                </h3>
                
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
                        aria-label="Remove option"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {currentQuestion.type === 'true-false' && (
              <div className="options-section">
                <h3>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="9 11 12 14 23 3"></polyline>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                  Select Correct Answer
                </h3>
                <div className="true-false-options">
                  <button
                    className={`tf-option ${currentQuestion.correctAnswer === 'true' ? 'active' : ''}`}
                    onClick={() => setCurrentQuestion({
                      ...currentQuestion,
                      correctAnswer: 'true'
                    })}
                  >
                    True
                  </button>
                  <button
                    className={`tf-option ${currentQuestion.correctAnswer === 'false' ? 'active' : ''}`}
                    onClick={() => setCurrentQuestion({
                      ...currentQuestion,
                      correctAnswer: 'false'
                    })}
                  >
                    False
                  </button>
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                Quiz Questions ({quiz.questions.length})
              </h2>
              <button 
                className="add-new-btn"
                onClick={() => setActiveTab('add')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Question
              </button>
            </div>
            
            {quiz.questions.length === 0 ? (
              <div className="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
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
                      <button 
                        className="remove-question-btn"
                        onClick={() => removeQuestion(index)}
                        aria-label="Remove question"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                    <div className="question-meta">
                      <span className="question-type">{question.type.replace('-', ' ')}</span>
                      {question.type === 'multiple-choice' && (
                        <span className="options-count">{question.options.length} options</span>
                      )}
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
                              <span className="correct-badge">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                Correct
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}

                    {question.type === 'true-false' && (
                      <div className="correct-answer">
                        Correct answer: <strong>{question.correctAnswer.toString()}</strong>
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
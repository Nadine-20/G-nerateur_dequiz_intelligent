import React, { useState } from 'react';
import './QuizCreator.css';

const QuestionCard = () => {
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
        <h1>Create New Quiz</h1>
        <div className="header-actions">
          <button className="preview-btn">Preview Quiz</button>
          <button 
            className="save-quiz-btn"
            onClick={saveQuiz}
            disabled={quiz.questions.length === 0}
          >
            Save Quiz
          </button>
        </div>
      </header>

      <div className="creator-main">
        {/* Quiz Metadata Section */}
        <section className="quiz-metadata">
          <h2>Quiz Information</h2>
          <div className="form-group">
            <label htmlFor="quiz-title">Quiz Title*</label>
            <input
              type="text"
              id="quiz-title"
              value={quiz.title}
              onChange={(e) => setQuiz({...quiz, title: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="quiz-description">Description</label>
            <textarea
              id="quiz-description"
              value={quiz.description}
              onChange={(e) => setQuiz({...quiz, description: e.target.value})}
              rows={3}
            />
          </div>
        </section>

        {/* Question Form Section */}
        <section className="question-form">
          <h2>Add New Question</h2>
          
          <div className="form-group">
            <label htmlFor="question-text">Question Text*</label>
            <input
              type="text"
              id="question-text"
              value={currentQuestion.text}
              onChange={(e) => setCurrentQuestion({...currentQuestion, text: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Question Type</label>
            <select
              value={currentQuestion.type}
              onChange={(e) => setCurrentQuestion({
                ...currentQuestion, 
                type: e.target.value,
                options: [],
                correctAnswer: null
              })}
            >
              <option value="multiple-choice">Multiple Choice</option>
              <option value="true-false">True/False</option>
              <option value="short-answer">Short Answer</option>
            </select>
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
                <button onClick={addOption}>Add Option</button>
              </div>
              
              <ul className="options-list">
                {currentQuestion.options.map((option, index) => (
                  <li key={index}>
                    <input
                      type="radio"
                      name="correct-answer"
                      checked={currentQuestion.correctAnswer === index}
                      onChange={() => setCurrentQuestion({
                        ...currentQuestion,
                        correctAnswer: index
                      })}
                    />
                    <span>{option}</span>
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
                <label>
                  <input
                    type="radio"
                    name="true-false"
                    checked={currentQuestion.correctAnswer === 'true'}
                    onChange={() => setCurrentQuestion({
                      ...currentQuestion,
                      correctAnswer: 'true'
                    })}
                  />
                  True
                </label>
                <label>
                  <input
                    type="radio"
                    name="true-false"
                    checked={currentQuestion.correctAnswer === 'false'}
                    onChange={() => setCurrentQuestion({
                      ...currentQuestion,
                      correctAnswer: 'false'
                    })}
                  />
                  False
                </label>
              </div>
            </div>
          )}

          <button 
            className="save-question-btn"
            onClick={saveQuestion}
          >
            Save Question
          </button>
        </section>

        {/* Saved Questions Section */}
        <section className="saved-questions">
          <h2>Quiz Questions ({quiz.questions.length})</h2>
          
          {quiz.questions.length === 0 ? (
            <p className="no-questions">No questions added yet</p>
          ) : (
            <ul className="question-list">
              {quiz.questions.map((question, index) => (
                <li key={index} className="question-item">
                  <div className="question-header">
                    <h3>Question {index + 1}: {question.text}</h3>
                    <button 
                      className="remove-question-btn"
                      onClick={() => removeQuestion(index)}
                    >
                      ×
                    </button>
                  </div>
                  <p className="question-type">Type: {question.type}</p>
                  
                  {question.type === 'multiple-choice' && (
                    <ul className="question-options">
                      {question.options.map((option, optIndex) => (
                        <li 
                          key={optIndex} 
                          className={optIndex === question.correctAnswer ? 'correct-option' : ''}
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
                    <p className="correct-answer">
                      Correct answer: {question.correctAnswer.toString()}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default QuestionCard;
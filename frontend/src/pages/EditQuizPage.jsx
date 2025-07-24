import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './EditQuizPage.css';

const EditQuizPage = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [quiz, setQuiz] = useState({
        title: '',
        description: '',
        subject: '',
        topics: [],
        difficulty: 'medium',
        timeLimit: 1800,
        maxScore: 100,
        questions: []
    });

    const [newTopic, setNewTopic] = useState('');
    const [newQuestion, setNewQuestion] = useState({
        text: '',
        type: 'multiple-choice',
        options: ['', '', '', ''],
        correctAnswer: 0,
        points: 1
    });

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        const fetchQuiz = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/my-quizzes/quiz/${quizId}`
                );

                if (response.data.error) {
                    throw new Error(response.data.error);
                }

                setQuiz(response.data);
            } catch (err) {
                console.error("Fetch quiz error:", err);
                setError(err.response?.data?.error || err.message);

                if (err.response?.status === 404) {
                    toast.error("Quiz not found");
                    navigate('/teacher/quizzes');
                } else {
                    toast.error('Failed to load quiz: ' + (err.response?.data?.error || err.message));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [quizId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setQuiz(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddTopic = () => {
        if (newTopic.trim() && !quiz.topics.includes(newTopic.trim())) {
            setQuiz(prev => ({
                ...prev,
                topics: [...prev.topics, newTopic.trim()]
            }));
            setNewTopic('');
        }
    };

    const handleRemoveTopic = (topicToRemove) => {
        setQuiz(prev => ({
            ...prev,
            topics: prev.topics.filter(topic => topic !== topicToRemove)
        }));
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[index][field] = value;
        setQuiz(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[qIndex].options[oIndex] = value;
        setQuiz(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
    };

    const handleAddQuestion = () => {
        setQuiz(prev => ({
            ...prev,
            questions: [
                ...prev.questions,
                {
                    text: '',
                    type: 'multiple-choice',
                    options: ['', '', '', ''],
                    correctAnswer: 0,
                    points: 1
                }
            ]
        }));
    };

    const handleRemoveQuestion = (index) => {
        const updatedQuestions = [...quiz.questions];
        updatedQuestions.splice(index, 1);
        setQuiz(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await axios.put(`http://localhost:5000/api/my-quizzes/${quizId}`, quiz);
            toast.success('Quiz updated successfully!');
            navigate('/teacher/quizzes');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update quiz');
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading quiz data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">!</div>
                <p className="error-message">{error}</p>
                <button className="btn-retry" onClick={() => window.location.reload()}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="edit-quiz-container">
            <div className="edit-quiz-header">
                <h1>Edit Quiz</h1>
                <button
                    className="btn-cancel"
                    onClick={() => navigate('/teacher/quizzes')}
                >
                    Cancel
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="quiz-form-section">
                    <h2>Basic Information</h2>
                    <div className="form-group">
                        <label>Title*</label>
                        <input
                            type="text"
                            name="title"
                            value={quiz.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={quiz.description}
                            onChange={handleInputChange}
                            rows="3"
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Subject*</label>
                            <input
                                type="text"
                                name="subject"
                                value={quiz.subject}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Difficulty*</label>
                            <select
                                name="difficulty"
                                value={quiz.difficulty}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Time Limit (seconds)*</label>
                            <input
                                type="number"
                                name="timeLimit"
                                value={quiz.timeLimit}
                                onChange={handleInputChange}
                                min="60"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Max Score*</label>
                            <input
                                type="number"
                                name="maxScore"
                                value={quiz.maxScore}
                                onChange={handleInputChange}
                                min="1"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Topics</label>
                        <div className="topics-input-container">
                            <input
                                type="text"
                                value={newTopic}
                                onChange={(e) => setNewTopic(e.target.value)}
                                placeholder="Add a topic"
                            />
                            <button
                                type="button"
                                className="btn-add-topic"
                                onClick={handleAddTopic}
                            >
                                Add
                            </button>
                        </div>
                        <div className="topics-list">
                            {quiz.topics.map((topic, index) => (
                                <span key={index} className="topic-tag">
                                    {topic}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTopic(topic)}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="quiz-form-section">
                    <div className="questions-header">
                        <h2>Questions</h2>
                        <button
                            type="button"
                            className="btn-add-question"
                            onClick={handleAddQuestion}
                        >
                            + Add Question
                        </button>
                    </div>

                    {quiz.questions.length === 0 ? (
                        <div className="no-questions">
                            <p>No questions added yet. Click "Add Question" to get started.</p>
                        </div>
                    ) : (
                        <div className="questions-list">
                            {quiz.questions.map((question, qIndex) => (
                                <div key={qIndex} className="question-card">
                                    <div className="question-header">
                                        <h3>Question {qIndex + 1}</h3>
                                        <button
                                            type="button"
                                            className="btn-remove-question"
                                            onClick={() => handleRemoveQuestion(qIndex)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <div className="form-group">
                                        <label>Question Text*</label>
                                        <input
                                            type="text"
                                            value={question.text}
                                            onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Type*</label>
                                            <select
                                                value={question.type}
                                                onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)}
                                                required
                                            >
                                                <option value="multiple-choice">Multiple Choice</option>
                                                <option value="true-false">True/False</option>
                                                <option value="short-answer">Short Answer</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Points*</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={question.points}
                                                onChange={(e) => handleQuestionChange(qIndex, 'points', parseInt(e.target.value))}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {question.type === 'multiple-choice' && (
                                        <div className="options-container">
                                            <label>Options*</label>
                                            {question.options.map((option, oIndex) => (
                                                <div key={oIndex} className="option-item">
                                                    <input
                                                        type="radio"
                                                        name={`correctAnswer-${qIndex}`}
                                                        checked={question.correctAnswer === oIndex}
                                                        onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)}
                                                    />
                                                    <input
                                                        type="text"
                                                        value={option}
                                                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                        placeholder={`Option ${oIndex + 1}`}
                                                        required
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {question.type === 'true-false' && (
                                        <div className="options-container">
                                            <label>Correct Answer*</label>
                                            <div className="true-false-options">
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name={`correctAnswer-${qIndex}`}
                                                        checked={question.correctAnswer === 0}
                                                        onChange={() => handleQuestionChange(qIndex, 'correctAnswer', 0)}
                                                    />
                                                    True
                                                </label>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name={`correctAnswer-${qIndex}`}
                                                        checked={question.correctAnswer === 1}
                                                        onChange={() => handleQuestionChange(qIndex, 'correctAnswer', 1)}
                                                    />
                                                    False
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {question.type === 'short-answer' && (
                                        <div className="options-container">
                                            <label>Correct Answer*</label>
                                            <input
                                                type="text"
                                                value={question.options[0] || ''}
                                                onChange={(e) => handleOptionChange(qIndex, 0, e.target.value)}
                                                required
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn-save"
                        disabled={saving || quiz.questions.length === 0}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    {quiz.questions.length === 0 && (
                        <p className="validation-error">Please add at least one question</p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default EditQuizPage;
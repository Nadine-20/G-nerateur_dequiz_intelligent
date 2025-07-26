import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './QuizEditPage.css';

const QuizEditPage = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState({
        title: '',
        description: '',
        subject: '',
        difficulty: 'medium',
        timeLimit: 900,
        questions: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await fetch(`http://localhost:5000/quizzes/${quizId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch quiz');
                }
                const data = await response.json();
                setQuiz(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [quizId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setQuiz(prev => ({
            ...prev,
            [name]: value
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

    const handleCorrectAnswerChange = (qIndex, answerIndex) => {
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[qIndex].correctAnswer = answerIndex;
        setQuiz(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(`http://localhost:5000/quizzes/${quizId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(quiz)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update quiz');
            }

            setSuccess(true);
            setTimeout(() => {
                navigate(`/quizzes/${quizId}`);
            }, 1500);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="quiz-loading-spinner"></div>;
    if (error) return <div className="quiz-error-message">Error: {error}</div>;

    return (
        <div className="quiz-edit-container">
            <div className="quiz-edit-header">
                <h1>Edit Quiz</h1>
                <Link to={`/quizzes/${quizId}`} className="quiz-back-btn">
                    Cancel
                </Link>
            </div>

            {success && (
                <div className="quiz-success-message">
                    Quiz updated successfully!
                </div>
            )}

            {error && <div className="quiz-error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="quiz-edit-form">
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={quiz.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={quiz.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Subject</label>
                        <input
                            type="text"
                            name="subject"
                            value={quiz.subject}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Difficulty</label>
                        <select
                            name="difficulty"
                            value={quiz.difficulty}
                            onChange={handleChange}
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Time Limit (minutes)</label>
                        <input
                            type="number"
                            name="timeLimit"
                            value={Math.floor(quiz.timeLimit / 60)}
                            onChange={(e) => handleChange({
                                target: {
                                    name: 'timeLimit',
                                    value: e.target.value * 60
                                }
                            })}
                            min="1"
                            required
                        />
                    </div>
                </div>

                <div className="questions-section">
                    <h3>Questions</h3>
                    {quiz.questions.map((question, qIndex) => (
                        <div key={qIndex} className="question-editor">
                            <div className="form-group">
                                <label>Question {qIndex + 1}</label>
                                <input
                                    type="text"
                                    value={question.question}
                                    onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="options-group">
                                <label>Options</label>
                                {question.options.map((option, oIndex) => (
                                    <div key={oIndex} className="option-input">
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                            required
                                        />
                                        <input
                                            type="radio"
                                            name={`correctAnswer-${qIndex}`}
                                            checked={question.correctAnswer === oIndex}
                                            onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                                        />
                                        <label>Correct</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="form-actions">
                    <button type="submit" className="save-btn">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default QuizEditPage;
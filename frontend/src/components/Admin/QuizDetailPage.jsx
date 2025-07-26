import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './QuizDetailPage.css';

const QuizDetailPage = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this quiz?')) {
            try {
                const response = await fetch(`http://localhost:5000/quizzes/${quizId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error('Failed to delete quiz');
                }

                navigate('/admin/quizzes');
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) return <div className="quiz-loading-spinner"></div>;
    if (error) return <div className="quiz-error-message">Error: {error}</div>;
    if (!quiz) return <div className="quiz-not-found">Quiz not found</div>;

    return (
        <div className="quiz-detail-container">
            <div className="quiz-detail-header">
                <h1>{quiz.title}</h1>
                <div className="quiz-actions">
                    <Link to={`/quizzes/${quizId}/edit`} className="quiz-edit-btn">
                        Edit Quiz
                    </Link>
                    <button onClick={handleDelete} className="quiz-delete-btn">
                        Delete Quiz
                    </button>
                    <Link to="/admin/quizzes" className="quiz-back-btn">
                        Back to List
                    </Link>
                </div>
            </div>

            <div className="quiz-detail-content">
                <div className="quiz-meta">
                    <p><strong>Subject:</strong> {quiz.subject}</p>
                    <p><strong>Difficulty:</strong> <span className={`quiz-difficulty ${quiz.difficulty}`}>{quiz.difficulty}</span></p>
                    <p><strong>Time Limit:</strong> {Math.floor(quiz.timeLimit / 60)} minutes</p>
                    <p><strong>Created:</strong> {new Date(quiz.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="quiz-description">
                    <h3>Description</h3>
                    <p>{quiz.description || 'No description provided'}</p>
                </div>

                <div className="quiz-questions">
                    <h3>Questions ({quiz.questions.length})</h3>
                    {quiz.questions.map((question, index) => (
                        <div key={index} className="question-card">
                            <h4>Question {index + 1}: {question.text}</h4>
                            <ul className="question-options">
                                {question.options.map((option, i) => (
                                    <li key={i} className={i === question.correctAnswer ? 'correct-answer' : ''}>
                                        {option}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuizDetailPage;
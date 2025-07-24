import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './MyQuizzesPage.css';

const MyQuizzesPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [quizToDelete, setQuizToDelete] = useState(null);
    const navigate = useNavigate();

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const fetchQuizzes = async () => {
        setLoading(true);
        try {
            if (!userInfo?._id) {
                throw new Error('Please log in to view your quizzes');
            }

            const response = await axios.get(
                `http://localhost:5000/api/my-quizzes/${userInfo._id}`
            );
            setQuizzes(response.data);
        } catch (err) {
            setError(err.response?.data?.error || err.message);
            toast.error(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, [userInfo?._id]);

    const handleDeleteClick = (quizId) => {
        setQuizToDelete(quizId);
        setShowConfirmModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/my-quizzes/${quizToDelete}`);
            setQuizzes(quizzes.filter(q => q._id !== quizToDelete));
            toast.success('Quiz deleted successfully');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to delete quiz');
        } finally {
            setShowConfirmModal(false);
            setQuizToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowConfirmModal(false);
        setQuizToDelete(null);
    };

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your quizzes...</p>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <div className="error-icon">!</div>
            <p className="error-message">{error}</p>
            <button className="btn-retry" onClick={fetchQuizzes}>
                Try Again
            </button>
        </div>
    );

    return (
        <div className="my-quizzes-container">
            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="confirm-modal-overlay">
                    <div className="confirm-modal">
                        <div className="confirm-modal-header">
                            <h3>Confirm Deletion</h3>
                        </div>
                        <div className="confirm-modal-body">
                            <p>Are you sure you want to delete this quiz? This action cannot be undone.</p>
                        </div>
                        <div className="confirm-modal-actions">
                            <button
                                className="confirm-modal-cancel"
                                onClick={handleDeleteCancel}
                            >
                                Cancel
                            </button>
                            <button
                                className="confirm-modal-delete"
                                onClick={handleDeleteConfirm}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Page Content */}
            <div className="header">
                <div className="header-content">
                    <h1>My Quizzes</h1>
                    <p className="subtitle">Manage and organize your created quizzes</p>
                </div>
                <button
                    className="btn-create"
                    onClick={() => navigate('/teacher/quizzes/create')}
                >
                    <span className="plus-icon">+</span> New Quiz
                </button>
            </div>

            {quizzes.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h3>No quizzes yet</h3>
                    <p>Get started by creating your first quiz</p>
                    <button
                        className="btn-primary"
                        onClick={() => navigate('/teacher/quizzes/create')}
                    >
                        Create First Quiz
                    </button>
                </div>
            ) : (
                <div className="quizzes-grid">
                    {quizzes.map(quiz => (
                        <div key={quiz._id} className="quiz-card">
                            <div className="quiz-header">
                                <h3 className="quiz-title">{quiz.title}</h3>
                                <div className="quiz-meta-header">
                                    <span className={`badge ${quiz.difficulty}`}>
                                        {quiz.difficulty}
                                    </span>
                                    <span className="quiz-date">
                                        {new Date(quiz.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <p className="quiz-description">
                                {quiz.description || 'No description provided'}
                            </p>

                            <div className="quiz-footer">
                                <span className="quiz-subject">
                                    <span className="label">Subject:</span> {quiz.subject}
                                </span>
                                <span className="quiz-questions">
                                    <span className="label">Questions:</span> {quiz.questions?.length || 0}
                                </span>
                            </div>

                            <div className="quiz-actions">
                                <button
                                    className="btn-action btn-edit"
                                    onClick={() => navigate(`/edit-quiz/${quiz._id}`)}
                                >
                                    <span className="action-icon">✏️</span> Edit
                                </button>
                                <button
                                    className="btn-action btn-delete"
                                    onClick={() => handleDeleteClick(quiz._id)}
                                >
                                    <span className="action-icon">🗑️</span> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyQuizzesPage;
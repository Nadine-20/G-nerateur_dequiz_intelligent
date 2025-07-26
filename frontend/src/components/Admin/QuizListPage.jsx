import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './QuizListPage.css';

const QuizListPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await fetch('http://localhost:5000/quizzes');
                if (!response.ok) {
                    throw new Error('Failed to fetch quizzes');
                }
                const data = await response.json();
                setQuizzes(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    const filteredQuizzes = useMemo(() => {
        let filtered = quizzes.filter(quiz =>
            quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quiz.subject.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Sorting logic
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return filtered;
    }, [quizzes, searchTerm, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    if (loading) return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading quizzes...</p>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <div className="error-message">
                <span className="error-icon">⚠️</span>
                <p>Error loading quizzes: {error}</p>
                <button onClick={() => window.location.reload()} className="retry-button">
                    Retry
                </button>
            </div>
        </div>
    );

    return (
        <div className="quiz-list-container">
            <header className="page-header">
                <h1>Quiz Management</h1>
                <Link to="/teacher/quizzes/create" className="create-quiz-button">
                    Create New Quiz
                </Link>
            </header>

            <div className="controls-section">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search by title or subject..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <span className="search-icon">🔍</span>
                </div>

                <div className="sort-options">
                    <span>Sort by:</span>
                    <button
                        onClick={() => requestSort('title')}
                        className={`sort-button ${sortConfig.key === 'title' ? 'active' : ''}`}
                    >
                        Title {getSortIndicator('title')}
                    </button>
                    <button
                        onClick={() => requestSort('subject')}
                        className={`sort-button ${sortConfig.key === 'subject' ? 'active' : ''}`}
                    >
                        Subject {getSortIndicator('subject')}
                    </button>
                    <button
                        onClick={() => requestSort('difficulty')}
                        className={`sort-button ${sortConfig.key === 'difficulty' ? 'active' : ''}`}
                    >
                        Difficulty {getSortIndicator('difficulty')}
                    </button>
                </div>
            </div>

            {filteredQuizzes.length === 0 ? (
                <div className="empty-state">
                    <p>No quizzes found matching your search.</p>
                    <button
                        onClick={() => setSearchTerm('')}
                        className="clear-search-button"
                    >
                        Clear search
                    </button>
                </div>
            ) : (
                <div className="quiz-grid">
                    {filteredQuizzes.map(quiz => (
                        <article key={quiz._id} className="quiz-card">
                            <header className="card-header">
                                <h3>{quiz.title}</h3>
                                <span className={`difficulty-badge ${quiz.difficulty}`}>
                                    {quiz.difficulty}
                                </span>
                            </header>

                            <div className="card-content">
                                <p className="subject">{quiz.subject}</p>
                                <p className="description">{quiz.description || 'No description available'}</p>

                                <div className="meta-info">
                                    <span>
                                        <strong>{quiz.questions?.length || 0}</strong> questions
                                    </span>
                                    <span>
                                        <strong>{Math.floor(quiz.timeLimit / 60)}</strong> min
                                    </span>
                                </div>
                            </div>

                            <footer className="card-footer">
                                <Link
                                    to={`/quizzes/${quiz._id}`}
                                    className="action-button view-button"
                                >
                                    View Details
                                </Link>
                                <Link
                                    to={`/quizzes/${quiz._id}/edit`}
                                    className="action-button edit-button"
                                >
                                    Edit
                                </Link>
                            </footer>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuizListPage;
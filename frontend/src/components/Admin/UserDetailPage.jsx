import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './UserDetailPage.css';

const UserDetailPage = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/users/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user');
                }
                const data = await response.json();
                setUser(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        setIsDeleting(true);
        setError(null);

        try {
            const response = await fetch(`http://127.0.0.1:5000/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete user');
            }

            navigate('/users', { state: { userDeleted: true } });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) return (
        <div className="ud-loading-container">
            <div className="ud-loading-spinner"></div>
            <p>Loading user data...</p>
        </div>
    );

    if (error) return (
        <div className="ud-error-container">
            <div className="ud-error-icon">!</div>
            <div className="ud-error-message">Error: {error}</div>
            <Link to="/users" className="ud-back-button">
                Back to Users
            </Link>
        </div>
    );

    if (!user) return (
        <div className="ud-not-found-container">
            <h2>User not found</h2>
            <p>The requested user could not be found in our system.</p>
            <Link to="/users" className="ud-back-button">
                Back to Users
            </Link>
        </div>
    );

    return (
        <div className="ud-container">
            <div className="ud-header">
                <h1 className="ud-title">User Details</h1>
                <div className="ud-actions">
                    <Link to={`/users/${userId}/edit`} className="ud-action-button ud-edit-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Edit User
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="ud-action-button ud-delete-button"
                        disabled={isDeleting}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                        {isDeleting ? 'Deleting...' : 'Delete User'}
                    </button>
                    <Link to="/users" className="ud-action-button ud-back-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Back to List
                    </Link>
                </div>
            </div>

            {error && (
                <div className="ud-error-message-container">
                    <div className="ud-error-icon">!</div>
                    <div className="ud-error-message">{error}</div>
                </div>
            )}

            <div className="ud-card">
                <div className="ud-avatar">
                    <span>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</span>
                </div>

                <div className="ud-info">
                    <div className="ud-info-section">
                        <h3 className="ud-section-title">Personal Information</h3>
                        <div className="ud-info-row">
                            <span className="ud-info-label">Full Name:</span>
                            <span className="ud-info-value">{user.firstName} {user.lastName}</span>
                        </div>
                        <div className="ud-info-row">
                            <span className="ud-info-label">Email:</span>
                            <span className="ud-info-value">{user.email}</span>
                        </div>
                        <div className="ud-info-row">
                            <span className="ud-info-label">Gender:</span>
                            <span className="ud-info-value">{user.gender || '-'}</span>
                        </div>
                    </div>

                    <div className="ud-info-section">
                        <h3 className="ud-section-title">Account Information</h3>
                        <div className="ud-info-row">
                            <span className="ud-info-label">Role:</span>
                            <span className={`ud-info-value ud-role-badge ud-role-${user.role.toLowerCase()}`}>
                                {user.role}
                            </span>
                        </div>
                        {user.matiere && (
                            <div className="ud-info-row">
                                <span className="ud-info-label">Matiere:</span>
                                <span className="ud-info-value">{user.matiere}</span>
                            </div>
                        )}
                        <div className="ud-info-row">
                            <span className="ud-info-label">Last Connected:</span>
                            <span className="ud-info-value">
                                {new Date(user.lastConnect).toLocaleString()}
                            </span>
                        </div>
                        <div className="ud-info-row">
                            <span className="ud-info-label">Account Created:</span>
                            <span className="ud-info-value">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailPage;
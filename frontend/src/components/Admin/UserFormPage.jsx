import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UserFormPage.css';
import { Link } from 'react-router-dom';

const UserFormPage = ({ editMode = false }) => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'student',
        gender: '',
        matiere: ''
    });
    const [loading, setLoading] = useState(editMode);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (editMode) {
            const fetchUser = async () => {
                try {
                    const response = await fetch(`http://127.0.0.1:5000/users/${userId}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch user');
                    }
                    const data = await response.json();
                    setFormData({
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        password: '',
                        role: data.role,
                        gender: data.gender || '',
                        matiere: data.matiere || ''
                    });
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchUser();
        }
    }, [editMode, userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            const url = editMode
                ? `http://127.0.0.1:5000/users/${userId}`
                : 'http://127.0.0.1:5000/users';
            const method = editMode ? 'PUT' : 'POST';

            // Create payload - don't send password if empty in edit mode
            const payload = editMode
                ? {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    role: formData.role,
                    gender: formData.gender,
                    matiere: formData.matiere,
                    ...(formData.password && { password: formData.password })
                }
                : formData;

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to ${editMode ? 'update' : 'create'} user`);
            }

            setSuccess(true);
            setTimeout(() => {
                navigate(editMode ? `/users/${userId}` : '/users');
            }, 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="uf-loading-container">
            <div className="uf-loading-spinner"></div>
        </div>
    );

    return (
        <div className="uf-container">
            <div className="uf-header">
                <h1 className="uf-title">{editMode ? 'Edit User' : 'Create New User'}</h1>
                <Link to={editMode ? `/users/${userId}` : '/users'} className="uf-back-button">
                    Cancel
                </Link>
            </div>

            {success && (
                <div className="uf-success-message">
                    User {editMode ? 'updated' : 'created'} successfully!
                </div>
            )}

            {error && (
                <div className="uf-error-message">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="uf-form">
                <div className="uf-form-row">
                    <div className="uf-form-group">
                        <label htmlFor="firstName" className="uf-label">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="uf-input"
                            required
                        />
                    </div>

                    <div className="uf-form-group">
                        <label htmlFor="lastName" className="uf-label">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="uf-input"
                            required
                        />
                    </div>
                </div>

                <div className="uf-form-row">
                    <div className="uf-form-group">
                        <label htmlFor="email" className="uf-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="uf-input"
                            required
                        />
                    </div>

                    <div className="uf-form-group">
                        <label htmlFor="password" className="uf-label">
                            Password
                            {editMode && <span className="uf-optional"> (leave blank to keep current)</span>}
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="uf-input"
                            required={!editMode}
                            minLength={!editMode ? "6" : "0"}
                        />
                    </div>
                </div>

                <div className="uf-form-row">
                    <div className="uf-form-group">
                        <label htmlFor="role" className="uf-label">Role</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="uf-select"
                            required
                        >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="uf-form-group">
                        <label htmlFor="gender" className="uf-label">Gender</label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="uf-select"
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                {formData.role === 'teacher' && (
                    <div className="uf-form-row">
                        <div className="uf-form-group">
                            <label htmlFor="matiere" className="uf-label">Matiere</label>
                            <input
                                type="text"
                                id="matiere"
                                name="matiere"
                                value={formData.matiere}
                                onChange={handleChange}
                                className="uf-input"
                                placeholder="Subject taught"
                            />
                        </div>
                    </div>
                )}

                <div className="uf-form-actions">
                    <button
                        type="submit"
                        className="uf-submit-button"
                        disabled={submitting}
                    >
                        {submitting ? (
                            <span className="uf-submit-spinner"></span>
                        ) : (
                            editMode ? 'Update User' : 'Create User'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserFormPage;
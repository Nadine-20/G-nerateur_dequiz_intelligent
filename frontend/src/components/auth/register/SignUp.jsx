import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './signup.css';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student',
        niveau: '',
        gender: '',
        matiere: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.gender) newErrors.gender = 'Gender is required';

        if (formData.role === 'student' && !formData.niveau) {
            newErrors.niveau = 'Grade level is required';
        }
        if (formData.role === 'teacher' && !formData.matiere) {
            newErrors.matiere = 'Specialization is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const response = await axios.post('http://localhost:5000/api/signup', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                role: formData.role,
                gender: formData.gender,
                niveau: formData.niveau,
                matiere: formData.matiere
            });

            toast.success(response.data.message);

            navigate(formData.role === 'student' ? '/student/dashboard' : '/teacher/dashboard');

        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(errorMsg);
            console.error('Registration error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <div className="signup-header">
                    <h2>Create Account</h2>
                    <p>Join our learning community</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={errors.firstName ? 'error' : ''}
                                disabled={isSubmitting}
                            />
                            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={errors.lastName ? 'error' : ''}
                                disabled={isSubmitting}
                            />
                            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'error' : ''}
                            disabled={isSubmitting}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className={errors.password ? 'error' : ''}
                                disabled={isSubmitting}
                            />
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={errors.confirmPassword ? 'error' : ''}
                                disabled={isSubmitting}
                            />
                            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                        </div>
                    </div>

                    <div className="form-group role-group">
                        <label>I am a:</label>
                        <div className="role-options">
                            <label className={formData.role === 'student' ? 'active' : ''}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={formData.role === 'student'}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                />
                                Student
                            </label>
                            <label className={formData.role === 'teacher' ? 'active' : ''}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="teacher"
                                    checked={formData.role === 'teacher'}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                />
                                Teacher
                            </label>
                        </div>
                    </div>

                    {formData.role === 'student' && (
                        <div className="form-group">
                            <select
                                name="niveau"
                                value={formData.niveau}
                                onChange={handleChange}
                                className={errors.niveau ? 'error' : ''}
                                disabled={isSubmitting}
                            >
                                <option value="">Select Grade Level</option>
                                <option value="7eme année">7th Grade</option>
                                <option value="8eme année">8th Grade</option>
                                <option value="9eme année">9th Grade</option>
                            </select>
                            {errors.niveau && <span className="error-message">{errors.niveau}</span>}
                        </div>
                    )}

                    {formData.role === 'teacher' && (
                        <div className="form-group">
                            <select
                                name="matiere"
                                value={formData.matiere}
                                onChange={handleChange}
                                className={errors.matiere ? 'error' : ''}
                                disabled={isSubmitting}
                            >
                                <option value="">Select Your Specialization</option>
                                <option value="Mathematics">Mathematics</option>
                                <option value="Physics">Physics</option>
                                <option value="Chemistry">Chemistry</option>
                                <option value="Biology">Biology</option>
                                <option value="French">French</option>
                                <option value="English">English</option>
                                <option value="History">History</option>
                                <option value="Geography">Geography</option>
                            </select>
                            {errors.matiere && <span className="error-message">{errors.matiere}</span>}
                        </div>
                    )}

                    <div className="form-group gender-group">
                        <label>Gender:</label>
                        <div className="gender-options">
                            <label className={formData.gender === 'male' ? 'active' : ''}>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={formData.gender === 'male'}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                />
                                Male
                            </label>
                            <label className={formData.gender === 'female' ? 'active' : ''}>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={formData.gender === 'female'}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                />
                                Female
                            </label>
                        </div>
                        {errors.gender && <span className="error-message">{errors.gender}</span>}
                    </div>

                    <button type="submit" disabled={isSubmitting} className="submit-btn">
                        {isSubmitting ? (
                            <span className="spinner"></span>
                        ) : (
                            'Sign Up'
                        )}
                    </button>
                </form>

                <div className="signup-footer">
                    <p>Already have an account? <a href="/login">Log in</a></p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
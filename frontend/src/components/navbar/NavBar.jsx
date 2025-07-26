import { useEffect, useState } from 'react';
import './navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import {
    AiOutlineHome,
    AiOutlineLogin,
    AiOutlineUserAdd,
    AiOutlineLogout,
    AiOutlineEdit
} from 'react-icons/ai';
import { MdOutlineQuiz, MdDashboard } from 'react-icons/md';
import { FiChevronDown, FiX } from 'react-icons/fi';

function NavBar() {
    const [userInfo, setUser] = useState(() => {
        const storedUser = localStorage.getItem('userInfo');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleUserInfoChange = () => {
            const storedUser = localStorage.getItem('userInfo');
            setUser(storedUser ? JSON.parse(storedUser) : null);
        };

        window.addEventListener('userInfoChanged', handleUserInfoChange);

        const syncUserInfo = (event) => {
            if (event.key === 'userInfo') {
                const newUser = event.newValue ? JSON.parse(event.newValue) : null;
                setUser(newUser);
            }
        };
        window.addEventListener('storage', syncUserInfo);

        return () => {
            window.removeEventListener('userInfoChanged', handleUserInfoChange);
            window.removeEventListener('storage', syncUserInfo);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownOpen && !event.target.closest('.right-nav-container')) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownOpen]);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const closeDropdown = () => setDropdownOpen(false);

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        closeDropdown();
        navigate('/login');
    };

    const getFirstLetter = (str) => (str && str.length > 0 ? str.charAt(0).toUpperCase() : '');

    return (
        <nav className="navigation-container">
            <div className="navigation-content">
                <Link to="/" className="nav-link" onClick={closeDropdown}>
                    <AiOutlineHome size={20} />
                    <span className="nav-text">Home</span>
                </Link>

                <Link to="/quizzes" className="nav-link" onClick={closeDropdown}>
                    <MdOutlineQuiz size={20} />
                    <span className="nav-text">Quizzes</span>
                </Link>

                {userInfo ? (
                    <div className="right-nav-container">
                        <button
                            onClick={toggleDropdown}
                            className="user-button"
                            aria-expanded={dropdownOpen}
                            aria-label="User menu"
                        >
                            <div className="user-avatar">
                                {getFirstLetter(userInfo.firstName)}
                            </div>
                            <span className="user-name">{userInfo.firstName || ''}</span>
                            {dropdownOpen ? <FiX size={16} /> : <FiChevronDown size={16} />}
                        </button>

                        <div className={`dropdown-menu ${dropdownOpen ? 'open' : ''}`}>
                            <div className="dropdown-header">
                                <div className="user-info">
                                    <div className="user-avatar large">
                                        {getFirstLetter(userInfo.firstName)}
                                    </div>
                                    <div>
                                        <p className="user-fullname">
                                            {(userInfo.firstName || '') + ' ' + (userInfo.lastName || '')}
                                        </p>
                                        <p className="user-email">{userInfo.email || ''}</p>
                                    </div>
                                </div>
                                <span className="user-role">{userInfo.role}</span>
                            </div>

                            <div className="dropdown-divider"></div>

                            <div className="dropdown-items">
                                {userInfo.role === "admin" && (
                                    <>
                                        {/* Quiz Management */}
                                        <div className="dropdown-section-header">Quiz Management</div>
                                        <Link to="teacher/quizzes/create" className="dropdown-item" onClick={closeDropdown}>
                                            <span className="dropdown-icon">✏️</span>
                                            <span>Create Quiz</span>
                                        </Link>
                                        <Link to="/admin/quizzes" className="dropdown-item" onClick={closeDropdown}>
                                            <span className="dropdown-icon">📚</span>
                                            <span>All Quizzes</span>
                                        </Link>
                                        <Link to="/teacher/quizzes" className="dropdown-item" onClick={closeDropdown}>
                                            <span className="dropdown-icon">📝</span>
                                            <span>My Quizzes</span>
                                        </Link>

                                        {/* User Management */}
                                        <div className="dropdown-section-header">User Management</div>
                                        <Link to="/users" className="dropdown-item" onClick={closeDropdown}>
                                            <span className="dropdown-icon">👥</span>
                                            <span>Manage Users</span>
                                        </Link>
                                        <Link to="/users/new" className="dropdown-item" onClick={closeDropdown}>
                                            <span className="dropdown-icon">➕</span>
                                            <span>Add New User</span>
                                        </Link>

                                        {/* Analytics */}
                                        <div className="dropdown-section-header">Analytics</div>
                                        <Link to="/teacher/dashboard" className="dropdown-item" onClick={closeDropdown}>
                                            <span className="dropdown-icon">🧑‍🎓</span>
                                            <span>User Progress</span>
                                        </Link>
                                    </>
                                )}


                                {userInfo.role === "teacher" && (
                                    <>
                                        <Link to="/teacher/quizzes/create" className="dropdown-item" onClick={closeDropdown}>
                                            <span className="dropdown-icon">✏️</span>
                                            <span>Create Quiz</span>
                                        </Link>
                                        <Link to="/teacher/quizzes" className="dropdown-item" onClick={closeDropdown}>
                                            <span className="dropdown-icon">📝</span>
                                            <span>My Quizzes</span>
                                        </Link>
                                        <Link to="/teacher/dashboard" className="dropdown-item" onClick={closeDropdown}>
                                            <MdDashboard size={16} className="dropdown-icon" />
                                            <span>Dashboard</span>
                                        </Link>
                                    </>
                                )}

                                {userInfo.role === "student" && (
                                    <>
                                        <Link to="/student/dashboard" className="dropdown-item" onClick={closeDropdown}>
                                            <MdDashboard size={16} className="dropdown-icon" />
                                            <span>Dashboard</span>
                                        </Link>
                                    </>
                                )}

                                <Link to="/edit-profile" className="dropdown-item" onClick={closeDropdown}>
                                    <AiOutlineEdit size={16} className="dropdown-icon" />
                                    <span>Edit Profile</span>
                                </Link>
                            </div>

                            <div className="dropdown-divider"></div>

                            <button onClick={logout} className="dropdown-item logout">
                                <AiOutlineLogout size={16} className="dropdown-icon" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">
                            <AiOutlineLogin size={20} />
                            <span className="nav-text">Login</span>
                        </Link>
                        <Link to="/register" className="nav-link">
                            <AiOutlineUserAdd size={20} />
                            <span className="nav-text">Register</span>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default NavBar;

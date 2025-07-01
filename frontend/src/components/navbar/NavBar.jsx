import { useState } from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';
import { AiOutlineHome, AiOutlineLogin, AiOutlineUserAdd } from 'react-icons/ai';
import { MdOutlineQuiz } from 'react-icons/md';
import { FiChevronDown, FiUser, FiX } from 'react-icons/fi';

function NavBar() {
    const userInfo = {
        userName: "JohnDoe",
        firstName: "first name",
        lastName: "last name",
        email: "john@example.com",
        role: "student" // can be "admin", "teacher", or "student"
    };

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const closeDropdown = () => {
        setDropdownOpen(false);
    };

    return (
        <nav className="navigation-container">
            <div className="navigation-content">
                {/* Left Navigation Items */}
                <div className="left-nav-items">
                    <Link
                        to="/"
                        className="nav-link"
                        onClick={closeDropdown}
                    >
                        <AiOutlineHome className="nav-icon" size={24} />
                        <span className="nav-text">Home</span>
                    </Link>
                    <Link
                        to="/quizzes"
                        className="nav-link"
                        onClick={closeDropdown}
                    >
                        <MdOutlineQuiz className="nav-icon" size={24} />
                        <span className="nav-text">Quizzes</span>
                    </Link>
                </div>

                {/* Right Navigation Items */}
                <div className="right-nav-container">
                    {userInfo ? (
                        <div className="user-nav-items">
                            <button
                                onClick={toggleDropdown}
                                className="user-button"
                                aria-expanded={dropdownOpen}
                                aria-label="User menu"
                            >
                                <div className="user-avatar">
                                    <FiUser className="avatar-icon" size={16} />
                                </div>
                                <span className="username">{userInfo.userName}</span>
                                {dropdownOpen ? (
                                    <FiX className="dropdown-icon" size={18} />
                                ) : (
                                    <FiChevronDown className="dropdown-icon" size={18} />
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-header">
                                        <p className="dropdown-username">{userInfo.userName}</p>
                                        <p className="dropdown-email">{userInfo.email}</p>
                                        <p className="dropdown-role">{userInfo.role.charAt(0).toUpperCase() + userInfo.role.slice(1)}</p>
                                    </div>

                                    {/* Admin specific links */}
                                    {userInfo.role === "admin" && (
                                        <>
                                            <Link
                                                to='/admin/users'
                                                className="dropdown-item"
                                                onClick={closeDropdown}
                                            >
                                                <span>Manage Users</span>
                                            </Link>
                                        </>
                                    )}

                                    {/* Teacher specific links */}
                                    {userInfo.role === "teacher" && (
                                        <>
                                            <Link
                                                to='/teacher/quizzes/create'
                                                className="dropdown-item"
                                                onClick={closeDropdown}
                                            >
                                                <span>Create Quiz</span>
                                            </Link>
                                            <Link
                                                to='/teacher/quizzes'
                                                className="dropdown-item"
                                                onClick={closeDropdown}
                                            >
                                                <span>My Quizzes</span>
                                            </Link>
                                            <Link
                                                to='/teacher/dashboard'
                                                className="dropdown-item"
                                                onClick={closeDropdown}
                                            >
                                                <span>Dashboard</span>
                                            </Link>
                                        </>
                                    )}

                                    {/* Student specific links */}
                                    {userInfo.role === "student" && (
                                        <>
                                            <Link
                                                to='/student/dashboard'
                                                className="dropdown-item"
                                                onClick={closeDropdown}
                                            >
                                                <span>Dashboard</span>
                                            </Link>
                                            <Link
                                                to='/student/revision'
                                                className="dropdown-item"
                                                onClick={closeDropdown}
                                            >
                                                <span>Revision Mode</span>
                                            </Link>
                                        </>
                                    )}

                                    {/* Common links for all roles */}
                                    <Link
                                        to='/edit-profile'
                                        className="dropdown-item"
                                        onClick={closeDropdown}
                                    >
                                        <span>Edit Profile</span>
                                    </Link>
                                    <button
                                        className="dropdown-item logout-button"
                                        onClick={closeDropdown}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="auth-nav-items">
                            <Link
                                to="/login"
                                className="nav-link"
                            >
                                <AiOutlineLogin className="nav-icon" size={24} />
                                <span className="nav-text">Login</span>
                            </Link>
                            <Link
                                to="/register"
                                className="nav-link"
                            >
                                <AiOutlineUserAdd className="nav-icon" size={24} />
                                <span className="nav-text">Register</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
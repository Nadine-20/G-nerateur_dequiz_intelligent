import './login.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoading(true);

    try {
      const res = await axios.post('http://127.0.0.1:5000/api/login', formData);
      const userInfo = res.data;

      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      window.dispatchEvent(new Event('userInfoChanged'));
      toast.success('Login successful!');

      switch (userInfo.role) {
        case 'student':
          navigate('/student/dashboard');
          break;
        case 'teacher':
          navigate('/teacher/dashboard');
          break;
        default:
          navigate('/');
          break;
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome back</h1>
          <p>Please enter your details to sign in</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="input-field"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              autoComplete="email"
              disabled={loading}  // disable input while loading
            />
          </div>

          <div className="input-group">
            <div className="label-container">
              <label htmlFor="password">Password</label>
              <Link to={`/forgot-password`} className="forgot-link">Forgot password?</Link>
            </div>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="input-field"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              autoComplete="current-password"
              disabled={loading}  // disable input while loading
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading} // disable button while loading
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
        </form>

        <div className="signup-link">
          Don't have an account? <Link to={`/register`}>Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

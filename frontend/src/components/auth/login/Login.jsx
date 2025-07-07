import './login.css';
import { Link } from 'react-router-dom';
const Login = () => {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome back</h1>
          <p>Please enter your details to sign in</p>
        </div>

        <form className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="input-field"
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
            />
          </div>

          <button type="submit" className="login-button">
            Sign In
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
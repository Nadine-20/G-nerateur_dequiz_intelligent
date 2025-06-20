import React, { useState } from 'react';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
=======
import { useNavigate, Link } from 'react-router-dom';
>>>>>>> feature/reset-password
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

<<<<<<< HEAD
=======
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

>>>>>>> feature/reset-password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
<<<<<<< HEAD
      // Simulation d'envoi d'email (remplacez par un appel API réel)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!email.includes('@')) {
        throw new Error('Email invalide');
      }

=======
      if (!validateEmail(email)) {
        throw new Error('Email invalide');
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
>>>>>>> feature/reset-password
      alert(`Un code de réinitialisation a été envoyé à ${email}`);
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'envoi du code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Mot de passe oublié ?</h2>
        <p className="instruction">
          Entrez votre email pour recevoir un code de réinitialisation
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="exemple@domaine.com"
              autoFocus
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Envoi en cours...' : 'Envoyer le code'}
          </button>
        </form>

        <p className="back-to-login">
<<<<<<< HEAD
          <a href="/login">← Retour à la connexion</a>
=======
          <Link to="/login">← Retour à la connexion</Link>
>>>>>>> feature/reset-password
        </p>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default ForgotPassword;
=======
export default ForgotPassword;
>>>>>>> feature/reset-password

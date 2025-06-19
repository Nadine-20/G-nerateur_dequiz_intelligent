import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || 'votre@email.com';
  
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDigitChange = (e, index) => {
    const newDigits = [...digits];
    newDigits[index] = e.target.value.replace(/\D/g, '');
    setDigits(newDigits);

    if (e.target.value && index < 5) {
      document.getElementById(`digit-${index+1}`).focus();
    }

    if (newDigits.every(d => d !== '')) {
      setIsCodeValid(true);
    }
  };

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const passwordChecks = {
    minuscule: /[a-z]/.test(password),
    majuscule: /[A-Z]/.test(password),
    chiffre: /[0-9]/.test(password),
    longueur: password.length >= 8,
    confirmation: password === confirmPassword && confirmPassword !== ''
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswords() || !isPasswordValid) return;

    setIsSubmitting(true);
    try {
      // Simulation de soumission (remplacez par un appel API réel)
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Mot de passe réinitialisé avec succès !');
      navigate('/login');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setDigits(['', '', '', '', '', '']);
    setPassword('');
    setConfirmPassword('');
    setIsCodeValid(false);
    setPasswordError('');
    document.getElementById('digit-0')?.focus();
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <h2>Réinitialisation du mot de passe</h2>
        <p className="email-notice">Code envoyé à : <strong>{email}</strong></p>

        <div className="code-section">
          <p>Entrez le code à 6 chiffres</p>
          <div className="code-inputs">
            {digits.map((digit, index) => (
              <input
                key={index}
                id={`digit-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleDigitChange(e, index)}
                className="digit-input"
                inputMode="numeric"
                autoFocus={index === 0}
                disabled={isSubmitting}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Nouveau mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
              placeholder="Minimum 8 caractères"
              disabled={!isCodeValid || isSubmitting}
              required
            />
          </div>

          <div className="input-group">
            <label>Confirmez le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={validatePasswords}
              className={`password-input ${passwordError && 'input-error'}`}
              placeholder="Retapez votre mot de passe"
              disabled={!isCodeValid || isSubmitting}
              required
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>

          <div className="password-rules">
            <p className={passwordChecks.minuscule ? 'rule-valid' : 'rule-invalid'}>
              {passwordChecks.minuscule ? '✓' : '✗'} Minuscule
            </p>
            <p className={passwordChecks.majuscule ? 'rule-valid' : 'rule-invalid'}>
              {passwordChecks.majuscule ? '✓' : '✗'} Majuscule
            </p>
            <p className={passwordChecks.chiffre ? 'rule-valid' : 'rule-invalid'}>
              {passwordChecks.chiffre ? '✓' : '✗'} Chiffre
            </p>
            <p className={passwordChecks.longueur ? 'rule-valid' : 'rule-invalid'}>
              {passwordChecks.longueur ? '✓' : '✗'} 8+ caractères
            </p>
            <p className={passwordChecks.confirmation ? 'rule-valid' : 'rule-invalid'}>
              {passwordChecks.confirmation ? '✓' : '✗'} Correspondance
            </p>
          </div>

          <div className="action-buttons">
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={!isPasswordValid || isSubmitting}
            >
              {isSubmitting ? 'Traitement...' : 'Réinitialiser'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
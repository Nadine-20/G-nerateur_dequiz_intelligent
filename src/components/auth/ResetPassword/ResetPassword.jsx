import React, { useState } from 'react';
import './style.css';

const ResetPassword = () => {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [isCodeValid, setIsCodeValid] = useState(false);

  // Gestion des chiffres du code
  const handleDigitChange = (e, index) => {
    const newDigits = [...digits];
    newDigits[index] = e.target.value.replace(/\D/g, ''); // N'autorise que les chiffres
    setDigits(newDigits);

    // Focus automatique sur le champ suivant
    if (e.target.value && index < 5) {
      document.getElementById(`digit-${index+1}`).focus();
    }

    // Validation automatique quand tous les chiffres sont saisis
    if (newDigits.every(d => d !== '') && !isCodeValid) {
      setIsCodeValid(true);
    }
  };

  // Réinitialisation complète
  const handleCancel = () => {
    setDigits(['', '', '', '', '', '']);
    setPassword('');
    setIsCodeValid(false);
    
    // Remet le focus sur le premier champ
    document.getElementById('digit-0')?.focus();
  };

  // Validation du mot de passe
  const passwordRules = {
    minuscule: /[a-z]/.test(password),
    majuscule: /[A-Z]/.test(password),
    chiffre: /[0-9]/.test(password),
    longueur: password.length >= 8
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  return (
    <div className="password-reset-container">
      <h1>Réinitialisation du mot de passe</h1>
      <p className="code-instruction">Entrez le code envoyé à votre email</p>

      {/* Saisie du code à 6 chiffres */}
      <div className="code-input-container">
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
          />
        ))}
      </div>

      {isCodeValid && <p className="code-validation">✅ Code vérifié</p>}

      <div className="divider"></div>

      {/* Saisie du nouveau mot de passe */}
      <p className="password-label">Nouveau mot de passe</p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="password-input"
        placeholder="Saisissez votre nouveau mot de passe"
      />

      {/* Règles de validation */}
      <div className="password-rules">
        <p className={passwordRules.minuscule ? 'rule-valid' : 'rule-invalid'}>
          {passwordRules.minuscule ? '✓' : '✗'} Au moins une lettre minuscule
        </p>
        <p className={passwordRules.longueur ? 'rule-valid' : 'rule-invalid'}>
          {passwordRules.longueur ? '✓' : '✗'} Minimum 8 caractères
        </p>
        <p className={passwordRules.majuscule ? 'rule-valid' : 'rule-invalid'}>
          {passwordRules.majuscule ? '✓' : '✗'} Au moins une lettre majuscule
        </p>
        <p className={passwordRules.chiffre ? 'rule-valid' : 'rule-invalid'}>
          {passwordRules.chiffre ? '✓' : '✗'} Au moins un chiffre
        </p>
      </div>

      {/* Boutons d'action */}
      <div className="action-buttons">
        <button 
          className="cancel-button"
          onClick={handleCancel}
          type="button"
        >
          Annuler
        </button>
        <button 
          className="reset-button" 
          disabled={!isPasswordValid}
          type="submit"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
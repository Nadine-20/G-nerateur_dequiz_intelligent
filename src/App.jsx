import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ForgotPassword, ResetPassword } from './components/auth/ResetPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Accueil</div>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;


import React from 'react';
import NavBar from './components/navbar/NavBar';
import AllRoutes from './routes/AllRoutes';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ForgotPassword, ResetPassword } from './components/auth/ResetPassword';

function App() {
  return (
    <>
      <NavBar />
      <Router>
        <Routes>
          <Route path="/" element={<AllRoutes />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

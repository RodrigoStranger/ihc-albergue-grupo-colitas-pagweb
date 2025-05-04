import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function EmptyPage() {
  return <div style={{ height: '100vh', backgroundColor: 'white' }}></div>;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/adoptar" element={<EmptyPage />} />
          <Route path="/donar" element={<EmptyPage />} />
          <Route path="/voluntariado" element={<EmptyPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

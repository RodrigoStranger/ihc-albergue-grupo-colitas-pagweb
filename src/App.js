import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Adoptar from './pages/Adoptar';
import Donar from './pages/Donar';
import Voluntariado from './pages/Voluntariado';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <ScrollToTop />
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/adoptar" element={<Adoptar />} />
            <Route path="/donar" element={<Donar />} />
            <Route path="/voluntariado" element={<Voluntariado />} />
            {/* Ruta comodín para páginas no encontradas */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
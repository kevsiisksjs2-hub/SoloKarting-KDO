
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import AIChatBot from './components/AIChatBot.tsx';
import Home from './pages/Home.tsx';
import Circuitos from './pages/Circuitos.tsx';
import Campeonatos from './pages/Campeonatos.tsx';
import Pilotos from './pages/Pilotos.tsx';
import Inscripciones from './pages/Inscripciones.tsx';
import Resultados from './pages/Resultados.tsx';
import LiveCenter from './pages/LiveCenter.tsx';
import Patrocinios from './pages/Patrocinios.tsx';
import Telemetria from './pages/Telemetria.tsx';
import Logbook from './pages/Logbook.tsx';
import AdminLogin from './pages/AdminLogin.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/Administracion19216811');

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/circuitos" element={<Circuitos />} />
          <Route path="/campeonatos" element={<Campeonatos />} />
          <Route path="/pilotos" element={<Pilotos />} />
          <Route path="/inscripciones" element={<Inscripciones />} />
          <Route path="/resultados" element={<Resultados />} />
          <Route path="/live-center" element={<LiveCenter />} />
          <Route path="/patrocinios" element={<Patrocinios />} />
          <Route path="/telemetria" element={<Telemetria />} />
          <Route path="/logbook" element={<Logbook />} />
          <Route path="/Administracion19216811" element={<AdminLogin />} />
          <Route path="/Administracion19216811/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;

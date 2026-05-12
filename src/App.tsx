import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import CopilotoIA from './pages/CopilotoIA';
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import Agenda from './pages/Agenda';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Finances from './pages/Finances';
import Educativo from './pages/Educativo';
import PublicAssessment from './pages/PublicAssessment';
import { AppProvider } from './context/AppContext';
import NotificationManager from './components/Notifications/NotificationManager';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const location = useLocation();
  const isPublicRoute = location.pathname.startsWith('/evaluacion/');

  if (!isAuthenticated && !isPublicRoute) {
    return <Login onLogin={handleLogin} />;
  }

  if (isPublicRoute) {
    return (
      <AppProvider>
        <Routes>
          <Route path="/evaluacion/:testId" element={<PublicAssessment />} />
        </Routes>
      </AppProvider>
    );
  }

  return (
    <AppProvider>
      <NotificationManager />
      <div className={`app-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        <Sidebar onLogout={handleLogout} isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <main className="content-area">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/pacientes" element={<Patients />} />
            <Route path="/pacientes/:id" element={<PatientDetail />} />
            <Route path="/copiloto-ia" element={<CopilotoIA />} />
            <Route path="/biblioteca" element={<Library />} />
            <Route path="/educativo" element={<Educativo />} />
            <Route path="/finanzas" element={<Finances />} />
            <Route path="/configuracion" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </AppProvider>
  );
}

export default App;

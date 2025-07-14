import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import { useAuth } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import Patients from './components/pages/Patients';
import Medecins from './components/pages/Medecins';
import Planning from './components/pages/Planning';
import Settings from './components/Settings';
import NotificationCenter from './components/layout/NotificationCenter';
import './styles/main.css';
import { AnimatePresence } from 'framer-motion';
import Statistiques from './components/pages/Statistiques';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { user, canAccessSection } = useAuth();

  // Rediriger vers une section autorisée si l'utilisateur n'a pas accès à la section active
  useEffect(() => {
    if (user && !canAccessSection(activeSection)) {
      // Trouver la première section autorisée
      const authorizedSections = ['dashboard', 'patients', 'medecins', 'planning', 'statistiques', 'settings'];
      const firstAuthorized = authorizedSections.find(section => canAccessSection(section));
      if (firstAuthorized) {
        setActiveSection(firstAuthorized);
      }
    }
  }, [user, activeSection, canAccessSection]);

  const renderActiveSection = () => {
    // Vérifier si l'utilisateur a accès à la section
    if (!canAccessSection(activeSection)) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès non autorisé</h2>
            <p className="text-gray-600">Vous n'avez pas les permissions pour accéder à cette section.</p>
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case 'dashboard':
        return <Dashboard setActiveSection={setActiveSection} />;
      case 'patients':
        return <Patients />;
      case 'medecins':
        return <Medecins />;
      case 'planning':
        return <Planning />;
      case 'settings':
        return <Settings />;
      case 'statistiques':
        return <Statistiques />;
      default:
        return <Dashboard setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="app-container modern-layout">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="main-content">
        <div className="main-header">
          <NotificationCenter />
        </div>
        <AnimatePresence mode="wait">{renderActiveSection()}</AnimatePresence>
      </main>
      <Toaster />
    </div>
  );
};

export default App;
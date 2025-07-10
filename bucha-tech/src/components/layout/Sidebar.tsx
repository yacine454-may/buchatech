import React, { useState, useEffect } from 'react';
import {
  Home,
  Users,
  Calendar,
  Settings,
  Menu,
  ChevronLeft,
  User,
  BarChart2,
  Stethoscope,
  LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import { slideInLeft, listItem } from '../animations/variants';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 900);
  const { user, logout, canAccessSection } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobileView(mobile);
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobileView) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const closeMobileSidebar = () => {
    if (isMobileView) {
      setIsMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  // Tous les éléments de navigation possibles
  const allNavItems = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: <Home className="nav-item-icon" /> },
    { id: 'patients', label: 'Patients', icon: <Users className="nav-item-icon" /> },
    { id: 'medecins', label: 'Médecins', icon: <User className="nav-item-icon" /> },
    { id: 'planning', label: 'Plannification', icon: <Calendar className="nav-item-icon" /> },
    { id: 'statistiques', label: 'Statistiques', icon: <BarChart2 className="nav-item-icon" /> },
    { id: 'settings', label: 'Paramètres', icon: <Settings className="nav-item-icon" /> },
  ];

  // Filtrer les éléments selon les permissions de l'utilisateur
  const navItems = allNavItems.filter(item => canAccessSection(item.id));

  // Si l'utilisateur n'a pas accès à la section active, rediriger vers le dashboard
  useEffect(() => {
    if (user && !canAccessSection(activeSection)) {
      onSectionChange('dashboard');
    }
  }, [user, activeSection, canAccessSection, onSectionChange]);

  return (
    <>
      {isMobileView && (
        <div
          className={`sidebar-overlay ${isMobileOpen ? 'visible' : ''}`}
          onClick={closeMobileSidebar}
        />
      )}
      <motion.aside
        variants={slideInLeft}
        initial="hidden"
        animate="visible"
        className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}
      >
        <div className="sidebar-header">
          <div className="sidebar-logo flex items-center gap-2">
            <Stethoscope className="sidebar-logo-icon" size={48} strokeWidth={1.5} />
            {!isCollapsed && (
              <span className="sidebar-logo-text transition-all duration-200">BuchaTech</span>
            )}
          </div>
        </div>

        <motion.div 
          className="flex h-full flex-col px-3 py-4"
          variants={listItem}
        >
          {!isCollapsed && (
            <motion.div 
              className="mb-10 flex items-center pl-3" 
              variants={listItem}
            >
             
            </motion.div>
          )}

          <nav className="space-y-0.5">
            {navItems.map((item) => (
              <motion.div
                key={item.id}
                variants={listItem}
                whileHover={{ x: isCollapsed ? 0 : 5, scale: isCollapsed ? 1.15 : 1 }}
                className="block"
              >
                <button
                  className={`nav-item ${activeSection === item.id ? 'active' : ''} ${isCollapsed ? 'collapsed-nav-item' : ''}`}
                  onClick={() => onSectionChange(item.id)}
                  aria-label={item.label}
                >
                  {React.cloneElement(item.icon, {
                    className: `nav-item-icon${isCollapsed ? ' nav-item-icon-collapsed' : ''}`,
                    size: isCollapsed ? 40 : 32,
                  })}
                  <span className="nav-item-text">{item.label}</span>
                </button>
              </motion.div>
            ))}
          </nav>
        </motion.div>

        <button className="sidebar-toggle" onClick={toggleSidebar} aria-label={isCollapsed ? 'Déplier la barre latérale' : 'Replier la barre latérale'}>
          <ChevronLeft style={{ transform: isCollapsed ? 'rotate(180deg)' : 'none' }} />
        </button>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              <User />
            </div>
            {!isCollapsed && (
              <div className="user-info">
                <span className="user-name">{user?.prenom} {user?.nom}</span>
                <span className="user-role">
                  {user?.role === 'admin' && 'Administrateur'}
                  {user?.role === 'medecin' && 'Médecin'}
                  {user?.role === 'infirmier' && 'Infirmier'}
                  {user?.role === 'secretaire' && 'Secrétaire'}
                  {user?.specialite && ` - ${user.specialite}`}
                </span>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleLogout}
            className="logout-button"
            title="Se déconnecter"
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
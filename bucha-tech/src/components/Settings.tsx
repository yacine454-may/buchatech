import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, User, Bell, Shield, Palette } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import '../styles/pages/settings.css';

const Settings: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('fr');

  const handleSave = () => {    toast({
      title: "Paramètres sauvegardés",
      description: "Vos préférences ont été mises à jour avec succès.",
      variant: "default"
    });
  };

  return (
    <div className="settings-page fade-in">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <SettingsIcon className="icon-gradient" size={28} />
            Paramètres
          </h1>
          <p className="page-subtitle">Configuration du système</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <User className="icon-gradient" size={20} />
              Profil Utilisateur
            </h3>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label>Nom complet</label>
              <input 
                type="text" 
                defaultValue="Dr. Bucha" 
                className="form-input" 
                placeholder="Votre nom complet"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                defaultValue="dr.bucha@buchatech.com" 
                className="form-input" 
                placeholder="Votre email"
              />
            </div>
            <div className="form-group">
              <label>Spécialité</label>
              <input 
                type="text" 
                defaultValue="Diabétologie" 
                className="form-input" 
                placeholder="Votre spécialité"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Bell className="icon-gradient" size={20} />
              Notifications
            </h3>
          </div>
          <div className="card-body">
            <div className="setting-item">
              <label>Notifications push</label>
              <input 
                type="checkbox" 
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="toggle-switch"
              />
            </div>
            <div className="setting-item">
              <label>Rappels de rendez-vous</label>
              <input type="checkbox" defaultChecked className="toggle-switch" />
            </div>
            <div className="setting-item">
              <label>Alertes d'urgence</label>
              <input type="checkbox" defaultChecked className="toggle-switch" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Palette className="icon-gradient" size={20} />
              Apparence
            </h3>
          </div>
          <div className="card-body">
            <div className="setting-item">
              <label>Mode sombre</label>
              <input 
                type="checkbox" 
                checked={isDarkMode}
                onChange={toggleDarkMode}
                className="toggle-switch"
              />
            </div>
            <div className="form-group">
              <label>Langue</label>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="form-select"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="Ar">Arabe</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Shield className="icon-gradient" size={20} />
              Sécurité
            </h3>
          </div>
          <div className="card-body">
            <button className="btn btn-secondary">
              <Shield size={16} />
              Changer le mot de passe
            </button>
            <button className="btn btn-secondary">
              <Shield size={16} />
              Authentification à deux facteurs
            </button>
            <button className="btn btn-danger">
              <Shield size={16} />
              Déconnecter tous les appareils
            </button>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={16} />
          Sauvegarder les modifications
        </button>
      </div>
    </div>
  );
};

export default Settings;

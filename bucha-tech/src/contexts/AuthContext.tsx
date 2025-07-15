import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  role: 'admin' | 'medecin' | 'infirmier' | 'secretaire';
  specialite?: string;
  telephone?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  canAccessSection: (section: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Définition des permissions par rôle
const ROLE_PERMISSIONS = {
  admin: {
    sections: ['dashboard', 'patients', 'medecins', 'planning', 'statistiques', 'settings'],
    permissions: ['all']
  },
  medecin: {
    sections: ['dashboard', 'patients', 'planning'],
    permissions: ['view_patients', 'edit_patients', 'view_planning']
  },
  infirmier: {
    sections: ['dashboard', 'patients', 'planning'],
    permissions: ['view_patients', 'view_planning']
  },
  secretaire: {
    sections: ['dashboard', 'patients', 'planning'],
    permissions: ['view_patients', 'edit_patients', 'view_planning']
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error);
        logout();
      }
    }
  }, []);

  // Ajout du log pour debug Vercel
  const API_URL = (import.meta as any).env.VITE_API_URL || '';
  console.log('AUTH API_URL:', API_URL);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        
        // Stocker dans localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        return true;
      } else {
        console.error('Erreur de connexion:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    
    // Nettoyer localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    const userPermissions = ROLE_PERMISSIONS[user.role];
    if (!userPermissions) return false;
    
    return userPermissions.permissions.includes('all') || 
           userPermissions.permissions.includes(permission);
  };

  const canAccessSection = (section: string): boolean => {
    if (!user) return false;
    
    const userPermissions = ROLE_PERMISSIONS[user.role];
    if (!userPermissions) return false;
    
    return userPermissions.sections.includes(section);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    hasPermission,
    canAccessSection
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 

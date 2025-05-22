
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SpiritualSymbol {
  id: string;
  name: string;
  image: string;
}

export interface UserData {
  id: string;
  name: string;
  dob: string;
  symbol: string;
  symbolImage: string;
  createdAt: string;
  lastLogin: string;
  chantingStats: {
    lifetime: number;
    today: number;
    lastDate: string;
  };
}

interface AuthContextType {
  user: UserData | null;
  login: (id: string) => boolean;
  loginWithData: (userData: UserData) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check for user data in localStorage on component mount
    const userData = localStorage.getItem('chantTrackerUserData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUser(parsedData);
      setIsAuthenticated(true);
      
      // Update last login time
      const updatedUserData = {
        ...parsedData,
        lastLogin: new Date().toISOString()
      };
      localStorage.setItem('chantTrackerUserData', JSON.stringify(updatedUserData));
    }
  }, []);

  const login = (id: string): boolean => {
    const userData = localStorage.getItem('chantTrackerUserData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      if (parsedData.id === id) {
        parsedData.lastLogin = new Date().toISOString();
        localStorage.setItem('chantTrackerUserData', JSON.stringify(parsedData));
        setUser(parsedData);
        setIsAuthenticated(true);
        return true;
      }
    }
    return false;
  };

  const loginWithData = (userData: UserData) => {
    userData.lastLogin = new Date().toISOString();
    
    // Initialize chanting stats if they don't exist
    if (!userData.chantingStats) {
      userData.chantingStats = {
        lifetime: 0,
        today: 0,
        lastDate: new Date().toDateString()
      };
    }
    
    localStorage.setItem('chantTrackerUserData', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Don't remove from localStorage, just log out the session
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithData, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

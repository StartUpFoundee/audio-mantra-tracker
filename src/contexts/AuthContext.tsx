
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCountFromDB } from '@/utils/dbUtils';

interface SpiritualSymbol {
  id: string;
  name: string;
  image: string;
}

export interface UserData {
  id: string;
  name: string;
  nameInitials: string;
  dob: string;
  symbol: string;
  symbolImage: string;
  createdAt: string;
  lastLogin: string;
  showDailyPopup: boolean;
  preferredLanguage: 'en' | 'hi';
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
  shouldShowGreeting: boolean;
  setShouldShowGreeting: (value: boolean) => void;
  updateUserPreferences: (preferences: Partial<Pick<UserData, 'showDailyPopup' | 'preferredLanguage'>>) => void;
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
  const [shouldShowGreeting, setShouldShowGreeting] = useState<boolean>(false);

  useEffect(() => {
    // Load user data and chanting stats
    const loadUserData = async () => {
      // Check for user data in localStorage on component mount
      const userData = localStorage.getItem('chantTrackerUserData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        
        // Check if we should show the greeting popup (once per day)
        const lastLogin = new Date(parsedData.lastLogin);
        const today = new Date();
        const shouldGreet = parsedData.showDailyPopup !== false && 
          (lastLogin.toDateString() !== today.toDateString());
        
        // Update last login time
        const updatedUserData = {
          ...parsedData,
          lastLogin: new Date().toISOString()
        };
        
        // Try to get the latest chanting stats from IndexedDB
        const lifetimeCount = await getCountFromDB('lifetime') as number;
        const todayCount = await getCountFromDB('today') as number;
        const lastDate = await getCountFromDB('lastCountDate') as string;
        
        // Update the chanting stats if values are available from IndexedDB
        if (lifetimeCount !== null || todayCount !== null) {
          updatedUserData.chantingStats = {
            lifetime: lifetimeCount !== null ? lifetimeCount : updatedUserData.chantingStats?.lifetime || 0,
            today: todayCount !== null ? todayCount : updatedUserData.chantingStats?.today || 0,
            lastDate: lastDate || new Date().toDateString()
          };
        }
        
        localStorage.setItem('chantTrackerUserData', JSON.stringify(updatedUserData));
        
        setUser(updatedUserData);
        setIsAuthenticated(true);
        setShouldShowGreeting(shouldGreet);
      }
    };
    
    loadUserData();
  }, []);

  const login = (id: string): boolean => {
    const userData = localStorage.getItem('chantTrackerUserData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      if (parsedData.id === id) {
        const today = new Date();
        const lastLogin = new Date(parsedData.lastLogin);
        const shouldGreet = parsedData.showDailyPopup !== false && 
          (lastLogin.toDateString() !== today.toDateString());
        
        parsedData.lastLogin = new Date().toISOString();
        localStorage.setItem('chantTrackerUserData', JSON.stringify(parsedData));
        setUser(parsedData);
        setIsAuthenticated(true);
        setShouldShowGreeting(shouldGreet);
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
    
    // Set default preferences if not provided
    if (userData.showDailyPopup === undefined) {
      userData.showDailyPopup = true;
    }
    
    if (!userData.preferredLanguage) {
      userData.preferredLanguage = 'en';
    }
    
    localStorage.setItem('chantTrackerUserData', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    setShouldShowGreeting(false); // Don't show greeting on first login/creation
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setShouldShowGreeting(false);
    // Don't remove from localStorage, just log out the session
  };

  const updateUserPreferences = (preferences: Partial<Pick<UserData, 'showDailyPopup' | 'preferredLanguage'>>) => {
    if (user) {
      const updatedUser = {
        ...user,
        ...preferences
      };
      localStorage.setItem('chantTrackerUserData', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      loginWithData, 
      logout, 
      isAuthenticated,
      shouldShowGreeting,
      setShouldShowGreeting,
      updateUserPreferences 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

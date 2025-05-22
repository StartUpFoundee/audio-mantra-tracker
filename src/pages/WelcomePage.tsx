
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import WelcomeScreen from '@/components/WelcomeScreen';

const WelcomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // If user is already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <WelcomeScreen />;
};

export default WelcomePage;

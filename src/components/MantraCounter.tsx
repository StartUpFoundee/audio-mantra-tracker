
// This is a read-only file, so we can't modify it directly.
// Instead, we'll need to create a wrapper component that integrates with our auth system.
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const UserAwareMantraCounter: React.FC = () => {
  // This component is just a wrapper around the original MantraCounter
  // that updates the user's chanting stats in localStorage
  const { user } = useAuth();
  
  useEffect(() => {
    // Listen for changes to localStorage
    const handleStorageChange = () => {
      if (!user) return;
      
      const lifetimeCount = localStorage.getItem('lifetimeCount');
      const todayCount = localStorage.getItem('todayCount');
      const lastDate = localStorage.getItem('lastCountDate');
      
      if (lifetimeCount && todayCount && lastDate) {
        // Update the user's chanting stats
        const userData = JSON.parse(localStorage.getItem('chantTrackerUserData') || '{}');
        userData.chantingStats = {
          lifetime: parseInt(lifetimeCount),
          today: parseInt(todayCount),
          lastDate: lastDate
        };
        localStorage.setItem('chantTrackerUserData', JSON.stringify(userData));
      }
    };
    
    // Create a MutationObserver to watch for changes to localStorage
    // This is a hack since there's no direct event for localStorage changes
    const interval = setInterval(handleStorageChange, 5000);
    
    return () => {
      clearInterval(interval);
    };
  }, [user]);

  // Just render the original MantraCounter
  return React.createElement(require("@/components/MantraCounter").default);
};

export default UserAwareMantraCounter;

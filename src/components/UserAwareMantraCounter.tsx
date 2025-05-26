
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserChantingStats } from "@/utils/dbUtils";
import MantraCounter from "@/components/MantraCounter";

const UserAwareMantraCounter: React.FC = () => {
  // This component is just a wrapper around the original MantraCounter
  // that updates the user's chanting stats in IndexedDB
  const { user } = useAuth();
  
  useEffect(() => {
    // Set up an interval to periodically update the user's chanting stats
    if (user) {
      const interval = setInterval(() => {
        updateUserChantingStats();
      }, 5000);
      
      return () => {
        clearInterval(interval);
      };
    }
  }, [user]);

  // Render the MantraCounter component
  return <MantraCounter />;
};

export default UserAwareMantraCounter;

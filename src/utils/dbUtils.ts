
import { openDB } from 'idb';

// Database name and version
const DB_NAME = 'NaamJapaaDB';
const DB_VERSION = 1;
const STORE_NAME = 'counts';

// Initialize the database
export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create an object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};

// Get a count value from the database
export const getCountFromDB = async (key: 'lifetime' | 'today' | 'lastCountDate'): Promise<number | string | null> => {
  try {
    const db = await initDB();
    return await db.get(STORE_NAME, key);
  } catch (error) {
    console.error('Error getting value from IndexedDB:', error);
    return null;
  }
};

// Set a count value in the database
export const setCountInDB = async (key: 'lifetime' | 'today' | 'lastCountDate', value: number | string): Promise<void> => {
  try {
    const db = await initDB();
    await db.put(STORE_NAME, value, key);
  } catch (error) {
    console.error('Error storing value in IndexedDB:', error);
  }
};

// Update user chanting stats in the database
export const updateUserChantingStats = async (): Promise<void> => {
  try {
    // Get the current counts from IndexedDB
    const lifetimeCount = await getCountFromDB('lifetime') as number || 0;
    const todayCount = await getCountFromDB('today') as number || 0;
    const lastDate = await getCountFromDB('lastCountDate') as string || new Date().toDateString();

    // Get the user data from localStorage
    const userDataString = localStorage.getItem('chantTrackerUserData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      
      // Update the user's chanting stats
      userData.chantingStats = {
        lifetime: lifetimeCount,
        today: todayCount,
        lastDate: lastDate
      };
      
      // Save the updated user data back to localStorage
      localStorage.setItem('chantTrackerUserData', JSON.stringify(userData));
    }
  } catch (error) {
    console.error('Error updating user chanting stats:', error);
  }
};

// Get initial counts from localStorage (for migration) or IndexedDB
export const getInitialCounts = async (): Promise<{ lifetimeCount: number, todayCount: number }> => {
  // Try to get from IndexedDB first
  let lifetimeCount = await getCountFromDB('lifetime') as number;
  let todayCount = await getCountFromDB('today') as number;
  
  // If not in IndexedDB, check localStorage (migration)
  if (lifetimeCount === null || lifetimeCount === undefined) {
    const storedLifetimeCount = localStorage.getItem('lifetimeCount');
    if (storedLifetimeCount) {
      lifetimeCount = parseInt(storedLifetimeCount, 10);
      // Migrate to IndexedDB
      await setCountInDB('lifetime', lifetimeCount);
      // Clean up localStorage
      localStorage.removeItem('lifetimeCount');
    } else {
      lifetimeCount = 0;
    }
  }
  
  if (todayCount === null || todayCount === undefined) {
    const storedTodayCount = localStorage.getItem('todayCount');
    if (storedTodayCount) {
      todayCount = parseInt(storedTodayCount, 10);
      // Migrate to IndexedDB
      await setCountInDB('today', todayCount);
      // Clean up localStorage
      localStorage.removeItem('todayCount');
    } else {
      todayCount = 0;
    }
    
    // Also migrate the lastCountDate
    const storedLastDate = localStorage.getItem('lastCountDate');
    if (storedLastDate) {
      await setCountInDB('lastCountDate', storedLastDate);
      localStorage.removeItem('lastCountDate');
    } else {
      await setCountInDB('lastCountDate', new Date().toDateString());
    }
  }
  
  return { lifetimeCount, todayCount };
};

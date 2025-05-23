import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mic, Hand, Infinity, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ProfileHeader from "@/components/ProfileHeader";
import DailyGreetingPopup from "@/components/DailyGreetingPopup";
import { getInitialCounts } from "@/utils/dbUtils";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, shouldShowGreeting, setShouldShowGreeting } = useAuth();
  const [lifetimeCount, setLifetimeCount] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [showGreeting, setShowGreeting] = useState(false);
  
  // Load saved counts from IndexedDB or user data
  useEffect(() => {
    const loadCounts = async () => {
      if (user && user.chantingStats) {
        // If user is logged in, use their stats
        setLifetimeCount(user.chantingStats.lifetime || 0);
        setTodayCount(user.chantingStats.today || 0);
      } else {
        // Otherwise use IndexedDB directly
        const { lifetimeCount: savedLifetimeCount, todayCount: savedTodayCount } = await getInitialCounts();
        setLifetimeCount(savedLifetimeCount);
        setTodayCount(savedTodayCount);
      }
    };
    
    loadCounts();
    
    // Show greeting popup with a slight delay if needed
    if (shouldShowGreeting) {
      const timer = setTimeout(() => {
        setShowGreeting(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [user, shouldShowGreeting]);

  const handleCloseGreeting = () => {
    setShowGreeting(false);
    setShouldShowGreeting(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <header className="py-4 px-4 flex justify-between items-center">
        <div className="w-10"></div> {/* Spacer for centering */}
        <h1 className="text-2xl font-bold text-amber-400">Mantra Counter</h1>
        <ProfileHeader />
      </header>
      
      <header className="pt-2 text-center">
        <p className="text-gray-300 mt-1 mb-2">
          {user ? `Welcome, ${user.name}` : 'Count your spiritual practice with ease'}
        </p>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-12 gap-8">
        <div className="stats w-full max-w-md flex gap-4 mb-4">
          <div className="stat flex-1 bg-zinc-800/80 rounded-lg p-4 border border-zinc-700 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Infinity className="w-5 h-5 text-amber-400" />
              <h2 className="text-gray-300 font-medium">Lifetime Chants</h2>
            </div>
            <p className="text-3xl font-bold text-amber-400">{lifetimeCount}</p>
          </div>
          
          <div className="stat flex-1 bg-zinc-800/80 rounded-lg p-4 border border-zinc-700 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <h2 className="text-gray-300 font-medium">Today</h2>
            </div>
            <p className="text-3xl font-bold text-amber-400">{todayCount}</p>
          </div>
        </div>
        
        <div className="w-full max-w-md bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 mb-8">
          <p className="text-center text-gray-400 text-sm">Advertisement</p>
          <p className="text-center text-gray-500 text-xs">Place your ad here</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl">
          <button 
            onClick={() => navigate('/manual')}
            className="bg-gradient-to-br from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 rounded-xl p-1"
          >
            <div className="bg-zinc-900 rounded-lg p-6 h-full">
              <div className="flex justify-center mb-4">
                <Hand size={64} className="text-amber-400" />
              </div>
              <h2 className="text-xl font-semibold text-amber-400 mb-2 text-center">Manual</h2>
              <p className="text-gray-300 text-sm mb-1">Press by hand or press the earphone button or press volume up/down button</p>
              <p className="text-gray-400 text-xs italic">हाथ से दबाएं या ईयरफोन बटन या वॉल्यूम अप डाउन बटन दबाएं</p>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/audio')}
            className="bg-gradient-to-br from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 rounded-xl p-1"
          >
            <div className="bg-zinc-900 rounded-lg p-6 h-full">
              <div className="flex justify-center mb-4">
                <Mic size={64} className="text-amber-400" />
              </div>
              <h2 className="text-xl font-semibold text-amber-400 mb-2 text-center">By Audio</h2>
              <p className="text-gray-300 text-sm mb-1">Chant mantra and take 1sec gap, counter will increase</p>
              <p className="text-gray-400 text-xs italic">मंत्र का जाप करें और 1 सेकंड का अंतराल रखें, काउंटर बढ़ेगा</p>
            </div>
          </button>
        </div>
      </main>
      
      <footer className="py-4 text-center text-gray-400 text-sm">
        <p>Created with love for spiritual practice</p>
      </footer>

      <DailyGreetingPopup isOpen={showGreeting} onClose={handleCloseGreeting} />
    </div>
  );
};

export default HomePage;

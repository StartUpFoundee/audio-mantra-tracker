
import React from "react";
import { useNavigate } from "react-router-dom";
import UserAwareMantraCounter from "@/components/UserAwareMantraCounter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import ProfileHeader from "@/components/ProfileHeader";

const AudioCountPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <header className="py-4 px-4 flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="icon"
          className="text-amber-400 hover:bg-zinc-800"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold text-amber-400">Audio Counter</h1>
        <div className="flex gap-2 items-center">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-amber-400 hover:bg-zinc-800"
            onClick={() => navigate('/')}
          >
            <Home className="h-6 w-6" />
          </Button>
          <ProfileHeader />
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <UserAwareMantraCounter />
      </main>
    </div>
  );
};

export default AudioCountPage;

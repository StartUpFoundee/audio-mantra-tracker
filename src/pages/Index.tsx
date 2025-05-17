
import React from "react";
import MantraCounter from "@/components/MantraCounter";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <header className="py-6 text-center">
        <h1 className="text-3xl font-bold text-amber-400">Mantra Counter</h1>
        <p className="text-gray-300 mt-2">Count your spiritual practice with voice recognition</p>
      </header>
      
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <MantraCounter />
      </main>
      
      <footer className="py-4 text-center text-gray-400 text-sm">
        <p>Created with love for spiritual practice</p>
        <p className="mt-1 text-xs">Use the sensitivity controls for optimal voice detection</p>
      </footer>
    </div>
  );
};

export default Index;

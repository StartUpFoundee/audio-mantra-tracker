
import React from "react";
import MantraCounter from "@/components/MantraCounter";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 to-white">
      <header className="py-6 text-center">
        <h1 className="text-3xl font-bold text-orange-600">Mantra Counter</h1>
        <p className="text-gray-600 mt-2">Count your spiritual practice with voice recognition</p>
      </header>
      
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <MantraCounter />
      </main>
      
      <footer className="py-4 text-center text-gray-500 text-sm">
        <p>Created with love for spiritual practice</p>
        <p className="mt-1 text-xs">Adjust microphone sensitivity if needed for longer distances</p>
      </footer>
    </div>
  );
};

export default Index;

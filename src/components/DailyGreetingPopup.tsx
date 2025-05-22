
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';
import { fetchSpiritualMessage } from '@/data/spiritualMessages';

interface DailyGreetingPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const DailyGreetingPopup: React.FC<DailyGreetingPopupProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState({ content: '', contentHi: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  useEffect(() => {
    if (isOpen) {
      const loadMessage = async () => {
        setIsLoading(true);
        try {
          const dailyMessage = await fetchSpiritualMessage();
          setMessage(dailyMessage);
        } catch (error) {
          console.error('Failed to fetch spiritual message:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadMessage();
    }
  }, [isOpen]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-amber-500/30 text-amber-50 max-w-md mx-auto">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="text-6xl opacity-80">{user.symbolImage}</div>
          </div>
          <DialogTitle className="text-2xl text-center text-amber-400">
            {language === 'en' ? `🕉️ Hello, ${user.name}! 🕉️` : `🕉️ नमस्ते, ${user.name}! 🕉️`}
          </DialogTitle>
          <DialogDescription className="text-center text-amber-100/80">
            {language === 'en' ? 'Welcome back to your spiritual journey.' : 'आपकी आध्यात्मिक यात्रा में वापस स्वागत है।'}
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 bg-amber-900/20 rounded-lg border border-amber-500/20 text-center my-4">
          <h3 className="text-sm uppercase tracking-wider text-amber-300/70 mb-2">
            {language === 'en' ? 'Today\'s Message:' : 'आज का संदेश:'}
          </h3>
          
          {isLoading ? (
            <div className="animate-pulse h-16 bg-amber-800/20 rounded"></div>
          ) : (
            <p className="text-lg italic text-amber-100">
              "{language === 'en' ? message.content : message.contentHi}"
            </p>
          )}
        </div>
        
        <p className="text-center text-amber-100/80 text-sm">
          {language === 'en' 
            ? 'May your chanting practice bring you peace and inner strength.' 
            : 'आपका जप अभ्यास आपको शांति और आंतरिक शक्ति प्रदान करे।'}
        </p>

        <div className="flex justify-between items-center mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleLanguage}
            className="text-amber-400 border-amber-500/50 hover:bg-amber-950 bg-transparent"
          >
            {language === 'en' ? 'हिंदी में देखें' : 'View in English'}
          </Button>
          
          <Button 
            onClick={onClose} 
            className="bg-amber-500 hover:bg-amber-600 text-zinc-900"
          >
            {language === 'en' ? 'Continue to Dashboard' : 'डैशबोर्ड पर जाएं'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DailyGreetingPopup;

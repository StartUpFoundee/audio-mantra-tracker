
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { SpeechDetection } from "@/utils/speechDetection";
import TargetSelector from "@/components/TargetSelector";
import CompletionAlert from "@/components/CompletionAlert";
import { Plus } from "lucide-react";

const MantraCounter: React.FC = () => {
  const [targetCount, setTargetCount] = useState<number | null>(null);
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [micPermission, setMicPermission] = useState<boolean | null>(null);
  const [showCompletionAlert, setShowCompletionAlert] = useState<boolean>(false);
  const speechDetection = useRef<SpeechDetection | null>(null);
  const lastSpeechTime = useRef<number>(0);
  const speechDetected = useRef<boolean>(false);

  useEffect(() => {
    // Check if target is reached
    if (targetCount !== null && currentCount >= targetCount && targetCount > 0) {
      handleCompletion();
    }
  }, [currentCount, targetCount]);

  const handleCompletion = () => {
    if (isListening) {
      stopListening();
    }
    setShowCompletionAlert(true);
  };

  const handleSelectTarget = (target: number) => {
    setTargetCount(target);
    setCurrentCount(0);
    setShowCompletionAlert(false);
  };

  const requestMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop tracks immediately after permission granted
      stream.getTracks().forEach(track => track.stop());
      setMicPermission(true);
      return true;
    } catch (error) {
      console.error("Error requesting microphone permission:", error);
      setMicPermission(false);
      return false;
    }
  };

  const startListening = async () => {
    if (!micPermission) {
      const granted = await requestMicPermission();
      if (!granted) return;
    }
    
    if (!speechDetection.current) {
      speechDetection.current = new SpeechDetection({
        onSpeechDetected: () => {
          speechDetected.current = true;
          console.log("Speech detected");
        },
        onSpeechEnded: () => {
          if (speechDetected.current) {
            // If we had speech and now it ended with a pause of at least 1 second
            const now = Date.now();
            if (now - lastSpeechTime.current > 1000) {
              setCurrentCount(count => count + 1);
              console.log("Mantra counted");
            }
            lastSpeechTime.current = now;
            speechDetected.current = false;
          }
        }
      });
    }
    
    const started = await speechDetection.current.start();
    if (started) {
      setIsListening(true);
      lastSpeechTime.current = Date.now();
    }
  };

  const stopListening = () => {
    if (speechDetection.current) {
      speechDetection.current.stop();
      speechDetection.current = null;
    }
    setIsListening(false);
  };

  const toggleListening = async () => {
    if (isListening) {
      stopListening();
    } else if (targetCount !== null) {
      startListening();
    }
  };

  const resetCounter = () => {
    if (isListening) {
      stopListening();
    }
    setCurrentCount(0);
    setShowCompletionAlert(false);
  };

  const handleReset = () => {
    resetCounter();
    setTargetCount(null);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto px-4">
      {targetCount === null ? (
        <TargetSelector onSelectTarget={handleSelectTarget} />
      ) : (
        <div className="flex flex-col items-center w-full">
          <div className="mb-8 text-center">
            <p className="text-gray-500">Target</p>
            <h2 className="text-2xl font-medium text-orange-500">{targetCount} Mantras</h2>
          </div>
          
          <div className="counter-display relative mb-10">
            <div className="flex justify-center items-center w-48 h-48 rounded-full border-8 border-blue-400 bg-white">
              <span className="text-5xl font-bold text-gray-700">{currentCount}</span>
            </div>
            <button 
              onClick={toggleListening}
              className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 flex items-center justify-center w-20 h-20 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-lg"
            >
              {isListening ? (
                <span className="text-lg">Stop</span>
              ) : (
                <div className="flex items-center justify-center">
                  <Plus className="w-8 h-8" />
                </div>
              )}
            </button>
          </div>
          
          <div className="mt-8 text-center p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-md w-full">
            <p className="text-blue-800">
              {isListening 
                ? "Listening for your mantras. Speak clearly with at least 1 second pause between mantras."
                : "Press the + button to start counting your mantras with voice."}
            </p>
          </div>
          
          <div className="flex gap-4 mt-6">
            <Button 
              variant="outline" 
              className="border-2 border-orange-400 text-orange-500"
              onClick={resetCounter}
            >
              Reset Count
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-gray-300 text-gray-500"
              onClick={handleReset}
            >
              Change Target
            </Button>
          </div>

          <CompletionAlert 
            isOpen={showCompletionAlert} 
            targetCount={targetCount} 
            onClose={() => setShowCompletionAlert(false)} 
          />
        </div>
      )}
    </div>
  );
};

export default MantraCounter;

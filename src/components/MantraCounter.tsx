
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { SpeechDetection } from "@/utils/speechDetection";
import TargetSelector from "@/components/TargetSelector";
import CompletionAlert from "@/components/CompletionAlert";
import { Plus, Mic, MicOff, Volume, Volume2, VolumeOff } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const MantraCounter: React.FC = () => {
  const [targetCount, setTargetCount] = useState<number | null>(null);
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [micPermission, setMicPermission] = useState<boolean | null>(null);
  const [showCompletionAlert, setShowCompletionAlert] = useState<boolean>(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [sensitivityLevel, setSensitivityLevel] = useState<number>(2); // 0: low, 1: medium, 2: high
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
      toast.success("Microphone access granted");
      return true;
    } catch (error) {
      console.error("Error requesting microphone permission:", error);
      setMicPermission(false);
      toast.error("Microphone access denied. Please enable microphone access in your browser settings.");
      return false;
    }
  };

  const startListening = async () => {
    if (!micPermission) {
      const granted = await requestMicPermission();
      if (!granted) return;
    }
    
    // Set minDecibels based on sensitivity level
    const minDecibelsSettings = [-50, -60, -70]; // low, medium, high
    
    if (!speechDetection.current) {
      speechDetection.current = new SpeechDetection({
        onSpeechDetected: () => {
          speechDetected.current = true;
          setAudioLevel(prev => Math.min(100, prev + 30)); // Visual feedback
          console.log("Speech detected");
        },
        onSpeechEnded: () => {
          if (speechDetected.current) {
            // If we had speech and now it ended with a pause of at least 0.8 second
            const now = Date.now();
            if (now - lastSpeechTime.current > 800) {
              setCurrentCount(count => {
                const newCount = count + 1;
                toast.success(`Mantra counted: ${newCount}`, {
                  duration: 1000,
                });
                return newCount;
              });
              console.log("Mantra counted");
            }
            lastSpeechTime.current = now;
            speechDetected.current = false;
          }
          setAudioLevel(0); // Reset visual feedback
        },
        minDecibels: minDecibelsSettings[sensitivityLevel]
      });
    }
    
    const started = await speechDetection.current.start();
    if (started) {
      setIsListening(true);
      lastSpeechTime.current = Date.now();
      toast.success(`Listening for mantras (Sensitivity: ${getSensitivityLabel()})`);
    } else {
      toast.error("Failed to start listening. Please try again.");
    }
  };

  const getSensitivityLabel = () => {
    const labels = ["Low", "Medium", "High"];
    return labels[sensitivityLevel];
  };

  const toggleSensitivity = () => {
    const wasListening = isListening;
    if (wasListening) {
      stopListening();
    }
    
    setSensitivityLevel((prev) => (prev + 1) % 3);
    
    if (wasListening) {
      // Small delay to ensure the previous instance is properly cleaned up
      setTimeout(() => {
        startListening();
      }, 300);
    }
    
    toast.info(`Microphone sensitivity: ${getSensitivityLabel()}`);
  };

  const stopListening = () => {
    if (speechDetection.current) {
      speechDetection.current.stop();
      speechDetection.current = null;
    }
    setIsListening(false);
    setAudioLevel(0);
    toast.info("Stopped listening");
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
    toast.info("Counter reset");
  };

  const handleReset = () => {
    resetCounter();
    setTargetCount(null);
  };

  // Calculate progress percentage
  const progressPercentage = targetCount ? (currentCount / targetCount) * 100 : 0;

  const getSensitivityIcon = () => {
    if (sensitivityLevel === 0) return <Volume className="w-5 h-5" />;
    if (sensitivityLevel === 1) return <Volume2 className="w-5 h-5" />;
    return <Volume2 className="w-5 h-5" />;
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
            {/* Progress ring */}
            <svg className="w-48 h-48" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="white"
                stroke="#e2e8f0" 
                strokeWidth="8"
              />
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="transparent"
                stroke="#f97316" 
                strokeWidth="8"
                strokeDasharray={`${Math.min(progressPercentage, 100) * 2.83} 283`}
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
              />
            </svg>
            
            <div className="absolute inset-0 flex flex-col justify-center items-center">
              <span className="text-5xl font-bold text-gray-700">{currentCount}</span>
              {isListening && (
                <div className={`mt-2 flex items-center text-sm ${audioLevel > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1 h-3 rounded-full transition-all ${
                          audioLevel > i * 20 ? 'bg-orange-500' : 'bg-gray-300'
                        }`} 
                        style={{ height: `${Math.min(8 + (i * 3), 20) + (audioLevel > i * 20 ? 4 : 0)}px` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button 
              onClick={toggleListening}
              className={`absolute -bottom-5 left-1/2 transform -translate-x-1/2 flex items-center justify-center w-20 h-20 rounded-full ${
                isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'
              } text-white transition-colors shadow-lg`}
            >
              {isListening ? (
                <MicOff className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>
          </div>
          
          <button
            onClick={toggleSensitivity}
            className="flex items-center justify-center gap-2 mb-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors"
          >
            {getSensitivityIcon()}
            <span>Sensitivity: {getSensitivityLabel()}</span>
          </button>
          
          <div className="mt-2 text-center p-4 bg-orange-50 border border-orange-200 rounded-lg max-w-md w-full">
            <p className="text-orange-800">
              {isListening 
                ? `Listening for your mantras. Speak clearly with at least 1 second pause between mantras. Current sensitivity: ${getSensitivityLabel()}.`
                : "Press the microphone button to start counting your mantras with voice."}
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

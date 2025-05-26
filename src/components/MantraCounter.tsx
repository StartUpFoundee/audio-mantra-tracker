
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import CompletionAlert from "@/components/CompletionAlert";
import TargetSelector from "@/components/TargetSelector";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { setCountInDB, getCountFromDB } from "@/utils/dbUtils";

const MantraCounter: React.FC = () => {
  const [count, setCount] = useState(0);
  const [lifetimeCount, setLifetimeCount] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [target, setTarget] = useState(108);
  const [isListening, setIsListening] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [volume, setVolume] = useState(0);
  const recognitionRef = useRef<any>(null);
  const volumeTimeoutRef = useRef<NodeJS.Timeout>();

  // Initialize counts and set up speech recognition
  useEffect(() => {
    const initializeCounts = async () => {
      const storedLifetime = await getCountFromDB('lifetime') as number || 0;
      const storedToday = await getCountFromDB('today') as number || 0;
      const lastDate = await getCountFromDB('lastCountDate') as string;
      
      const today = new Date().toDateString();
      
      if (lastDate !== today) {
        // New day, reset today count
        setTodayCount(0);
        await setCountInDB('today', 0);
        await setCountInDB('lastCountDate', today);
      } else {
        setTodayCount(storedToday);
      }
      
      setLifetimeCount(storedLifetime);
    };

    initializeCounts();

    // Set up speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'hi-IN';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        if (transcript.includes('हरे') || transcript.includes('कृष्णा') || transcript.includes('राम')) {
          incrementCount();
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    // Set up audio context for volume detection
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const audioContext = new AudioContext();
          const analyser = audioContext.createAnalyser();
          const microphone = audioContext.createMediaStreamSource(stream);
          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          microphone.connect(analyser);
          analyser.fftSize = 256;

          const detectVolume = () => {
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
            setVolume(average);

            if (average > 30 && isListening) {
              clearTimeout(volumeTimeoutRef.current);
              volumeTimeoutRef.current = setTimeout(() => {
                incrementCount();
              }, 1000);
            }

            requestAnimationFrame(detectVolume);
          };

          detectVolume();
        })
        .catch((err) => {
          console.error('Error accessing microphone:', err);
        });
    }

    return () => {
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current);
      }
    };
  }, [isListening]);

  const incrementCount = async () => {
    const newCount = count + 1;
    const newLifetime = lifetimeCount + 1;
    const newToday = todayCount + 1;

    setCount(newCount);
    setLifetimeCount(newLifetime);
    setTodayCount(newToday);

    // Save to IndexedDB
    await setCountInDB('lifetime', newLifetime);
    await setCountInDB('today', newToday);
    await setCountInDB('lastCountDate', new Date().toDateString());

    if (newCount >= target) {
      setShowCompletion(true);
      toast.success(`Congratulations! You've completed ${target} chants!`);
    }
  };

  const resetCount = () => {
    setCount(0);
    setShowCompletion(false);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-amber-400">Audio Counter</h1>
          <p className="text-gray-300">
            Chant your mantra clearly with pauses between each repetition
          </p>
        </div>

        <TargetSelector target={target} onTargetChange={setTarget} />

        <div className="text-center space-y-2">
          <div className="text-6xl font-bold text-amber-400">{count}</div>
          <div className="text-lg text-gray-300">of {target}</div>
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            onClick={toggleListening}
            className={`flex items-center space-x-2 ${
              isListening 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span>{isListening ? 'Stop Listening' : 'Start Listening'}</span>
          </Button>

          <Button onClick={resetCount} variant="outline">
            Reset
          </Button>
        </div>

        <div className="flex items-center justify-center space-x-2">
          {volume > 30 ? <Volume2 className="w-5 h-5 text-green-500" /> : <VolumeX className="w-5 h-5 text-gray-500" />}
          <div className="w-32 h-2 bg-gray-700 rounded">
            <div 
              className="h-full bg-green-500 rounded transition-all duration-200"
              style={{ width: `${Math.min(volume * 2, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-zinc-800 p-3 rounded-lg">
            <div className="text-sm text-gray-400">Today</div>
            <div className="text-xl font-semibold text-amber-400">{todayCount}</div>
          </div>
          <div className="bg-zinc-800 p-3 rounded-lg">
            <div className="text-sm text-gray-400">Lifetime</div>
            <div className="text-xl font-semibold text-amber-400">{lifetimeCount}</div>
          </div>
        </div>
      </div>

      <CompletionAlert 
        isOpen={showCompletion} 
        onClose={() => setShowCompletion(false)}
        target={target}
      />
    </div>
  );
};

export default MantraCounter;

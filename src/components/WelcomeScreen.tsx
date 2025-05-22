import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from "@/components/ui/calendar";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { spiritualSymbols } from '@/data/spiritualSymbols';
import { generateUserID, doesIdMatchDOB, doesIdMatchName, copyToClipboard } from '@/utils/identityUtils';
import { useAuth, UserData } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Check, AlertCircle, Copy, CheckCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithData, login } = useAuth();
  const [activeTab, setActiveTab] = useState('create');
  const [name, setName] = useState('');
  const [dob, setDOB] = useState<Date | undefined>(undefined);
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [userId, setUserId] = useState('');
  const [showIdDialog, setShowIdDialog] = useState(false);
  const [generatedId, setGeneratedId] = useState('');
  const [error, setError] = useState('');
  const [recoverName, setRecoverName] = useState('');
  const [recoverDOB, setRecoverDOB] = useState<Date | undefined>(undefined);
  const [possibleIds, setPossibleIds] = useState<string[]>([]);
  const [showRecoveryResults, setShowRecoveryResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCreateIdentity = () => {
    if (!name || !dob || !selectedSymbol) {
      setError('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    const nameInitials = name.substring(0, 2).toUpperCase();
    const newId = generateUserID(dob, name);
    setGeneratedId(newId);

    const symbolObject = spiritualSymbols.find(s => s.id === selectedSymbol)!;

    // Create the user data object
    const userData: UserData = {
      id: newId,
      name: name,
      nameInitials: nameInitials,
      dob: format(dob, 'yyyy-MM-dd'),
      symbol: selectedSymbol,
      symbolImage: symbolObject.image,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      showDailyPopup: true,
      preferredLanguage: 'en',
      chantingStats: {
        lifetime: 0,
        today: 0,
        lastDate: new Date().toDateString()
      }
    };

    // Store existing chanting data if any
    const lifetimeCount = localStorage.getItem('lifetimeCount');
    const todayCount = localStorage.getItem('todayCount');
    const lastDate = localStorage.getItem('lastCountDate');

    if (lifetimeCount) {
      userData.chantingStats.lifetime = parseInt(lifetimeCount);
    }
    if (todayCount && lastDate) {
      userData.chantingStats.today = parseInt(todayCount);
      userData.chantingStats.lastDate = lastDate;
    }

    loginWithData(userData);
    setShowIdDialog(true);
    setIsSubmitting(false);
  };

  const handleExistingLogin = () => {
    if (!userId) {
      setError('Please enter your ID');
      return;
    }

    setIsSubmitting(true);
    const success = login(userId);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid ID. Please try again or recover your ID.');
      setIsSubmitting(false);
    }
  };

  const handleRecoverID = () => {
    if (!recoverName || !recoverDOB) {
      setError('Please enter your name and date of birth');
      return;
    }

    setIsSubmitting(true);

    // Search for matching IDs in localStorage
    const userData = localStorage.getItem('chantTrackerUserData');
    const foundIds: string[] = [];
    
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        
        // Check if the stored data matches both name and DOB
        if (doesIdMatchDOB(parsedData.id, recoverDOB) && 
            (doesIdMatchName(parsedData.id, recoverName) || 
             parsedData.name.toLowerCase() === recoverName.toLowerCase())) {
          foundIds.push(parsedData.id);
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    setPossibleIds(foundIds);
    setShowRecoveryResults(true);
    setIsSubmitting(false);
  };

  const handleContinueAsGuest = () => {
    navigate('/');
  };

  const closeIdDialogAndNavigate = () => {
    setShowIdDialog(false);
    navigate('/');
  };

  const handleSymbolSelect = (symbolId: string) => {
    setSelectedSymbol(symbolId);
  };

  const handleUseRecoveredId = (id: string) => {
    const success = login(id);
    if (success) {
      navigate('/');
    } else {
      setError('Failed to login with recovered ID');
    }
  };

  const copyIdToClipboard = async () => {
    const success = await copyToClipboard(generatedId);
    if (success) {
      setIsCopied(true);
      toast({
        title: "ID Copied",
        description: "Your ID has been copied to clipboard",
        duration: 2000,
      });
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const startYear = 1900;
  const currentYear = new Date().getFullYear();
  const yearsRange = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => startYear + i
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-lg border border-zinc-700 p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-amber-400 text-center">Mantra Counter</h1>
        <p className="text-center text-gray-300 mb-6">Begin your spiritual journey</p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-zinc-800">
            <TabsTrigger 
              value="create" 
              className="text-amber-400 data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
            >
              Create
            </TabsTrigger>
            <TabsTrigger 
              value="login" 
              className="text-amber-400 data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
            >
              Login
            </TabsTrigger>
            <TabsTrigger 
              value="recover" 
              className="text-amber-400 data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
            >
              Recover ID
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Your Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="bg-zinc-800 border-zinc-700 focus:border-amber-500 text-white" 
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left bg-zinc-800 border-zinc-700 hover:bg-zinc-700 ${!dob && "text-gray-400"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-amber-500" />
                    {dob ? format(dob, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-700">
                  <div className="bg-zinc-800 p-2 border-b border-zinc-700">
                    <select 
                      className="bg-zinc-700 text-amber-300 p-1 rounded w-full"
                      value={dob ? dob.getFullYear() : currentYear}
                      onChange={(e) => {
                        const year = parseInt(e.target.value);
                        if (dob) {
                          const newDate = new Date(dob);
                          newDate.setFullYear(year);
                          setDOB(newDate);
                        } else {
                          setDOB(new Date(year, 0, 1));
                        }
                      }}
                    >
                      {yearsRange.reverse().map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <Calendar
                    mode="single"
                    selected={dob}
                    onSelect={setDOB}
                    initialFocus
                    className="bg-zinc-900"
                    captionLayout="dropdown-buttons"
                    fromYear={1900}
                    toYear={currentYear}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Choose a Spiritual Symbol</Label>
              <div className="grid grid-cols-5 gap-2 p-2 bg-zinc-800 rounded-md border border-zinc-700">
                {spiritualSymbols.map((symbol) => (
                  <button
                    key={symbol.id}
                    className={`h-12 w-12 flex items-center justify-center rounded-md text-2xl ${
                      selectedSymbol === symbol.id
                        ? "bg-amber-600 border-2 border-amber-300"
                        : "bg-zinc-700 hover:bg-zinc-600"
                    }`}
                    onClick={() => handleSymbolSelect(symbol.id)}
                    title={symbol.name}
                  >
                    <span>{symbol.image}</span>
                    {selectedSymbol === symbol.id && (
                      <Check className="absolute h-4 w-4 bottom-0 right-0 m-0.5 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {error && activeTab === 'create' && (
              <p className="text-red-400 flex items-center gap-1 text-sm">
                <AlertCircle size={16} /> {error}
              </p>
            )}

            <div className="pt-2">
              <Button 
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-medium"
                onClick={handleCreateIdentity}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Identity'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="login" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId" className="text-gray-300">Your Identity ID</Label>
              <Input 
                id="userId" 
                placeholder="Format: DDMMYYYY_XX_XXXX" 
                value={userId} 
                onChange={(e) => setUserId(e.target.value)}
                className="bg-zinc-800 border-zinc-700 focus:border-amber-500 text-white" 
              />
              {error && activeTab === 'login' && (
                <p className="text-red-400 flex items-center gap-1 text-sm">
                  <AlertCircle size={16} /> {error}
                </p>
              )}
            </div>
            
            <Button 
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-medium"
              onClick={handleExistingLogin}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>

            <div className="text-center">
              <Button 
                variant="link" 
                className="text-amber-400" 
                onClick={() => setActiveTab('recover')}
              >
                Forgot your ID?
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="recover" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recoverName" className="text-gray-300">Your Name</Label>
              <Input 
                id="recoverName" 
                value={recoverName} 
                onChange={(e) => setRecoverName(e.target.value)}
                className="bg-zinc-800 border-zinc-700 focus:border-amber-500 text-white" 
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Your Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left bg-zinc-800 border-zinc-700 hover:bg-zinc-700 ${!recoverDOB && "text-gray-400"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-amber-500" />
                    {recoverDOB ? format(recoverDOB, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-700">
                  <div className="bg-zinc-800 p-2 border-b border-zinc-700">
                    <select 
                      className="bg-zinc-700 text-amber-300 p-1 rounded w-full"
                      value={recoverDOB ? recoverDOB.getFullYear() : currentYear}
                      onChange={(e) => {
                        const year = parseInt(e.target.value);
                        if (recoverDOB) {
                          const newDate = new Date(recoverDOB);
                          newDate.setFullYear(year);
                          setRecoverDOB(newDate);
                        } else {
                          setRecoverDOB(new Date(year, 0, 1));
                        }
                      }}
                    >
                      {yearsRange.reverse().map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <Calendar
                    mode="single"
                    selected={recoverDOB}
                    onSelect={setRecoverDOB}
                    initialFocus
                    className="bg-zinc-900"
                    captionLayout="dropdown-buttons"
                    fromYear={1900}
                    toYear={currentYear}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {error && activeTab === 'recover' && (
              <p className="text-red-400 flex items-center gap-1 text-sm">
                <AlertCircle size={16} /> {error}
              </p>
            )}

            {showRecoveryResults && (
              <div className="p-4 bg-zinc-800 rounded-md">
                <h3 className="text-amber-400 font-medium mb-2">Recovery Results</h3>
                {possibleIds.length > 0 ? (
                  <>
                    <p className="text-gray-300 mb-2">We found your ID:</p>
                    {possibleIds.map((id) => (
                      <Button
                        key={id}
                        variant="outline"
                        className="w-full mb-2 bg-zinc-700 border-zinc-600 hover:bg-zinc-600 text-white"
                        onClick={() => handleUseRecoveredId(id)}
                      >
                        {id}
                      </Button>
                    ))}
                  </>
                ) : (
                  <p className="text-gray-300">No matching IDs found. Please check your information or create a new identity.</p>
                )}
              </div>
            )}

            <Button 
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-medium"
              onClick={handleRecoverID}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Searching...' : 'Recover ID'}
            </Button>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-4 border-t border-zinc-700">
          <Button 
            variant="outline" 
            className="w-full bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-amber-400" 
            onClick={handleContinueAsGuest}
          >
            Continue as Guest
          </Button>
        </div>
      </div>

      <Dialog open={showIdDialog} onOpenChange={setShowIdDialog}>
        <DialogContent className="bg-zinc-900 text-white border border-zinc-700">
          <DialogHeader>
            <DialogTitle className="text-amber-400 text-2xl text-center">Your Identity Created!</DialogTitle>
            <DialogDescription className="text-center text-gray-300">
              <div className="mt-2 p-4 bg-zinc-800 rounded-lg border border-amber-500/30">
                <p className="mb-2">Your unique ID is:</p>
                <div className="flex items-center justify-center mb-1">
                  <p className="text-xl font-mono text-amber-400 bg-zinc-700 p-2 rounded-l">{generatedId}</p>
                  <Button 
                    variant="outline"
                    size="icon"
                    className="rounded-l-none h-10 bg-zinc-700 border-zinc-600 hover:bg-zinc-600 text-amber-300"
                    onClick={copyIdToClipboard}
                    title="Copy ID to clipboard"
                  >
                    {isCopied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-amber-200">
                  Format: [Birthday]_[Name Initials]_[Unique Code]
                </p>
              </div>
              <p className="mt-4">
                Please note down this ID to access your profile in the future.
                Remember, it starts with your birthdate and includes your name initials!
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <Button onClick={closeIdDialogAndNavigate} className="bg-amber-500 hover:bg-amber-600 text-black">
              Continue to App
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WelcomeScreen;


import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { UserData } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { Calendar, Clock, UserIcon, Copy, Check } from 'lucide-react';

interface ProfileInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
}

const ProfileInfoModal: React.FC<ProfileInfoModalProps> = ({ isOpen, onClose, user }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    toast.success("ID copied to clipboard!");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 text-white border border-zinc-700 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-amber-400 text-center text-2xl">Your Profile</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center mt-4">
          <div className="text-6xl mb-4">
            {user.symbolImage}
          </div>
          <h2 className="text-xl font-medium text-white mb-6">{user.name}</h2>
          
          <div className="w-full space-y-4">
            <div className="bg-zinc-800 p-3 rounded-lg border border-zinc-700 flex items-center">
              <UserIcon className="h-5 w-5 text-amber-400 mr-3" />
              <div className="flex-1">
                <p className="text-sm text-gray-400">Your Identity ID</p>
                <div className="flex justify-between items-center">
                  <p className="text-lg text-amber-400 font-mono">{user.id}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 ml-2 bg-zinc-700 hover:bg-zinc-600 border-zinc-600"
                    onClick={handleCopyId}
                  >
                    {copied ? (
                      <><Check size={14} className="mr-1" /> Copied</>
                    ) : (
                      <><Copy size={14} className="mr-1" /> Copy ID</>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-zinc-800 p-3 rounded-lg border border-zinc-700 flex items-center">
              <Calendar className="h-5 w-5 text-amber-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Date of Birth</p>
                <p className="text-gray-200">{format(new Date(user.dob), "PPP")}</p>
              </div>
            </div>
            
            <div className="bg-zinc-800 p-3 rounded-lg border border-zinc-700 flex items-center">
              <Clock className="h-5 w-5 text-amber-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Account Created</p>
                <p className="text-gray-200">{format(new Date(user.createdAt), "PPP p")}</p>
              </div>
            </div>

            <div className="bg-zinc-800 p-3 rounded-lg border border-zinc-700">
              <p className="text-sm text-gray-400 mb-1">Chanting Statistics</p>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm text-gray-400">Lifetime</p>
                  <p className="text-xl text-amber-400">{user.chantingStats?.lifetime || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Today</p>
                  <p className="text-xl text-amber-400">{user.chantingStats?.today || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="bg-amber-500 hover:bg-amber-600 text-black w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileInfoModal;


import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, HelpCircle, Download, Copy, Check } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { exportUserData } from '@/utils/identityUtils';
import ProfileInfoModal from './ProfileInfoModal';
import IdentityGuide from './IdentityGuide';

const ProfileHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const [showIdentityGuide, setShowIdentityGuide] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/welcome');
  };

  const handleExportIdentity = () => {
    if (user) {
      exportUserData(user);
    }
  };

  const handleCopyId = () => {
    if (user) {
      navigator.clipboard.writeText(user.id);
      setCopied(true);
      toast.success("ID copied to clipboard!");
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="bg-zinc-800 hover:bg-zinc-700 rounded-full flex items-center justify-center gap-2 pl-2 pr-3"
          >
            <div className="text-2xl" title={user.name}>
              {user.symbolImage}
            </div>
            <span className="text-amber-400 text-sm font-medium">{user.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60 bg-zinc-800 border-zinc-700 text-white mr-2">
          <DropdownMenuLabel className="text-amber-400 flex flex-col gap-1">
            <span>{user.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-mono">{user.id}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 rounded-full hover:text-amber-400 hover:bg-zinc-700"
                onClick={handleCopyId}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
              </Button>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-zinc-700"/>
          <DropdownMenuItem 
            className="hover:bg-zinc-700 text-gray-200 cursor-pointer"
            onClick={() => setShowProfileInfo(true)}
          >
            <User className="mr-2 h-4 w-4 text-amber-400" />
            <span>View Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="hover:bg-zinc-700 text-gray-200 cursor-pointer"
            onClick={() => setShowIdentityGuide(true)}
          >
            <HelpCircle className="mr-2 h-4 w-4 text-amber-400" />
            <span>Identity Guide</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="hover:bg-zinc-700 text-gray-200 cursor-pointer"
            onClick={handleExportIdentity}
          >
            <Download className="mr-2 h-4 w-4 text-amber-400" />
            <span>Save Identity</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-zinc-700"/>
          <DropdownMenuItem 
            className="hover:bg-zinc-700 text-gray-200 cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4 text-amber-400" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileInfoModal
        isOpen={showProfileInfo}
        onClose={() => setShowProfileInfo(false)}
        user={user}
      />

      <IdentityGuide
        isOpen={showIdentityGuide}
        onClose={() => setShowIdentityGuide(false)}
      />
    </div>
  );
};

export default ProfileHeader;

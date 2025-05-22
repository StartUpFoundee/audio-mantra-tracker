
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
import { User, LogOut, HelpCircle, Download } from 'lucide-react';
import { exportUserData } from '@/utils/identityUtils';
import ProfileInfoModal from './ProfileInfoModal';
import IdentityGuide from './IdentityGuide';

const ProfileHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const [showIdentityGuide, setShowIdentityGuide] = useState(false);

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

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-zinc-800 hover:bg-zinc-700 rounded-full flex items-center justify-center w-10 h-10"
          >
            <div className="text-2xl" title={user.name}>
              {user.symbolImage}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-zinc-800 border-zinc-700 text-white mr-2">
          <DropdownMenuLabel className="text-amber-400">
            {user.name}
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

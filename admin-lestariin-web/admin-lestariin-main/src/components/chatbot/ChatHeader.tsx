import React from 'react';
import { User, Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChatHeaderProps {
  onMenuClick: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('isAuthenticated');
    navigate('/', { replace: true });
  };

  return (
    <header className="bg-linear-to-r from-green-50 to-cyan-50 p-4 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        {/* Sisi Kiri: Tombol Menu (Mobile) & Judul "Chat" */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-white rounded-lg transition-colors"
          >
            <Menu size={24} className="text-gray-700" />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Chat
          </h1>
        </div>

        {/* Sisi Kanan: Profil Admin & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-lg cursor-pointer hover:shadow-xl transition-all">
            <div className="w-10 h-10 bg-linear-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <span className="hidden md:block font-semibold text-gray-800">
              Admin
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="hidden lg:block p-2.5 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:bg-red-50"
            title="Logout"
          >
            <LogOut size={22} className="text-gray-700" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;

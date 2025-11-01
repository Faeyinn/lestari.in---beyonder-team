import React, { useState, useEffect } from 'react';
import { LayoutDashboard, FileText, LogOut, Trophy } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import IconSrc from '@/assets/icon.png';
import { API_ENDPOINTS } from '@/utils/apiConfig';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LeaderboardUser {
  email: string;
  name: string;
  points: number;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FileText, label: 'Laporan', path: '/laporan' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Fetch leaderboard
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(API_ENDPOINTS.LEADERBOARD, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setLeaderboard(data);
        } else {
          console.error('Failed to fetch leaderboard');
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    // floating sidebar: fixed with offset from left/top, rounded, heavy shadow
    <aside className="hidden lg:flex flex-col w-72 h-[calc(100vh-64px)] bg-gradient-to-b from-green-700 to-green-800 text-white shadow-2xl rounded-2xl fixed left-6 top-6 z-40 ring-1 ring-black/10 overflow-hidden">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
          <img src={IconSrc} alt="Lestari.in" className="w-10 h-10 object-contain" />
        </div>
        <span className="text-2xl font-bold">Lestari.in</span>
      </div>
      {/* Menu */}
      <nav className="flex-1 px-4 py-6">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                isActive
                  ? 'bg-white text-green-800 font-semibold shadow-lg'
                  : 'text-white hover:bg-green-600'
              }`}
            >
              <Icon size={22} />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Leaderboard Toggle */}
        <button
          onClick={() => setShowLeaderboard(!showLeaderboard)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all text-white hover:bg-green-600"
        >
          <Trophy size={22} />
          <span>Leaderboard</span>
        </button>

        {/* Leaderboard List */}
        {showLeaderboard && (
          <div className="bg-green-600 rounded-xl p-3 mb-2">
            <h3 className="text-sm font-semibold mb-2">Top Contributors</h3>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {leaderboard.slice(0, 5).map((user, idx) => (
                <div key={user.email} className="flex items-center justify-between text-xs">
                  <span className="truncate">{idx + 1}. {user.name}</span>
                  <span className="font-bold">{user.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>
      {/* Logout */}
      <div className="p-4 mt-auto">
        <button
          onClick={() => {
            localStorage.removeItem('isAuthenticated');
            window.location.href = '/';
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-red-600 transition-all"
        >
          <LogOut size={22} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
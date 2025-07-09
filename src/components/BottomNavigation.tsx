import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, MessageCircle, User } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: BookOpen, label: 'Lessons', path: '/lessons' },
    { icon: MessageCircle, label: 'AI Chat', path: '/chat' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <footer className="bg-white rounded-t-3xl shadow-lg p-4 border-t border-gray-100">
      <div className="flex justify-center space-x-8 max-w-md mx-auto">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center space-y-1 p-3 rounded-xl transition-all ${
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <item.icon size={24} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </footer>
  );
};

export default BottomNavigation;
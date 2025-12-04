import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, PlusCircle, FileText, User } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';

interface NavItem {
  path: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { path: '/', icon: <Home size={22} />, label: 'Лента' },
  { path: '/new', icon: <PlusCircle size={22} />, label: 'Заявка' },
  { path: '/my-requests', icon: <FileText size={22} />, label: 'Мои' },
  { path: '/profile', icon: <User size={22} />, label: 'Профиль' },
];

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { haptic } = useTelegram();
  
  const handleNavClick = (path: string) => {
    haptic('light');
    navigate(path);
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                isActive 
                  ? 'text-commerce-primary' 
                  : 'text-gray-400 active:text-gray-600'
              }`}
            >
              {item.icon}
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

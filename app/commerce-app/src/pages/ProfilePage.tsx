import React, { useState, useEffect } from 'react';
import { User, Building2, Phone, FileText, Star, Shield, ChevronRight, LogOut } from 'lucide-react';
import { useStore } from '../store';
import { useTelegram } from '../hooks/useTelegram';

export const ProfilePage: React.FC = () => {
  const { user, setUser, myRequests } = useStore();
  const { user: tgUser, haptic, showAlert, showConfirm } = useTelegram();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    company: user?.company || '',
    phone: user?.phone || '',
    inn: user?.inn || '',
  });
  
  // Инициализация пользователя из Telegram
  useEffect(() => {
    if (!user && tgUser) {
      setUser({
        id: String(tgUser.id),
        telegramId: tgUser.id,
        name: [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' '),
        role: 'both',
        rating: 0,
        dealsCount: 0,
        verified: false,
        createdAt: new Date(),
      });
    }
  }, [tgUser, user, setUser]);
  
  const displayName = user?.name || tgUser?.first_name || 'Пользователь';
  const displayUsername = tgUser?.username ? `@${tgUser.username}` : '';
  
  const handleSave = () => {
    haptic('medium');
    if (user) {
      setUser({
        ...user,
        company: formData.company,
        phone: formData.phone,
        inn: formData.inn,
      });
    }
    setIsEditing(false);
    showAlert('✅ Профиль сохранён');
  };
  
  const stats = [
    { label: 'Заявок', value: myRequests.length, icon: <FileText size={18} /> },
    { label: 'Сделок', value: user?.dealsCount || 0, icon: <Shield size={18} /> },
    { label: 'Рейтинг', value: user?.rating?.toFixed(1) || '—', icon: <Star size={18} /> },
  ];
  
  const menuItems = [
    { label: 'Мои данные', icon: <User size={20} />, action: () => setIsEditing(true) },
    { label: 'Верификация', icon: <Shield size={20} />, badge: user?.verified ? '✓' : 'Пройти' },
    { label: 'История сделок', icon: <FileText size={20} /> },
    { label: 'Настройки', icon: <Building2 size={20} /> },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-commerce-primary text-white px-4 pt-4 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold">{displayName}</h1>
            {displayUsername && (
              <p className="text-sm text-blue-200">{displayUsername}</p>
            )}
            {user?.company && (
              <p className="text-sm text-blue-200 flex items-center gap-1 mt-1">
                <Building2 size={14} />
                {user.company}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-sm p-4 grid grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="flex items-center justify-center gap-1 text-commerce-primary mb-1">
                {stat.icon}
              </div>
              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Editing form */}
      {isEditing ? (
        <div className="px-4 py-6">
          <div className="card space-y-4">
            <h3 className="font-semibold text-gray-900">Редактирование профиля</h3>
            
            <div>
              <label className="label">Компания</label>
              <input
                type="text"
                className="input"
                placeholder="ООО Ваша Компания"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
            
            <div>
              <label className="label">Телефон</label>
              <input
                type="tel"
                className="input"
                placeholder="+7 (999) 123-45-67"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            
            <div>
              <label className="label">ИНН</label>
              <input
                type="text"
                className="input"
                placeholder="1234567890"
                value={formData.inn}
                onChange={(e) => setFormData({ ...formData, inn: e.target.value })}
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  haptic('light');
                  setIsEditing(false);
                }}
                className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                className="flex-1 btn-primary"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Menu */}
          <div className="px-4 py-6">
            <div className="card divide-y divide-gray-100">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    haptic('light');
                    item.action?.();
                  }}
                  className="w-full flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">{item.icon}</span>
                    <span className="font-medium text-gray-900">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.badge === '✓' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="text-gray-400" size={18} />
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Contact info */}
          {(user?.phone || user?.inn) && (
            <div className="px-4 pb-6">
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-3">Контактные данные</h3>
                {user?.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Phone size={16} className="text-gray-400" />
                    {user.phone}
                  </div>
                )}
                {user?.inn && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText size={16} className="text-gray-400" />
                    ИНН: {user.inn}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Version */}
          <div className="px-4 pb-6 text-center">
            <p className="text-xs text-gray-400">
              COMMERCE v0.1.0 • MVP
            </p>
          </div>
        </>
      )}
    </div>
  );
};

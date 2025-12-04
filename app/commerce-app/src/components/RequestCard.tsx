import React from 'react';
import { MapPin, Clock, TrendingUp, TrendingDown, Users } from 'lucide-react';
import type { Request } from '../types';
import { CATEGORIES } from '../types';
import { useTelegram } from '../hooks/useTelegram';

interface RequestCardProps {
  request: Request;
  onClick?: () => void;
  showActions?: boolean;
}

export const RequestCard: React.FC<RequestCardProps> = ({ 
  request, 
  onClick,
  showActions = true 
}) => {
  const { haptic } = useTelegram();
  
  const isBuy = request.type === 'buy';
  const timeAgo = getTimeAgo(request.createdAt);
  
  const handleClick = () => {
    haptic('light');
    onClick?.();
  };
  
  const formatMoney = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M ₽`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K ₽`;
    }
    return `${amount} ₽`;
  };
  
  return (
    <div 
      className="card active:scale-[0.99] transition-transform cursor-pointer"
      onClick={handleClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
            isBuy 
              ? 'bg-green-100 text-green-700' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {isBuy ? (
              <><TrendingDown size={12} className="inline mr-1" />ПОКУПКА</>
            ) : (
              <><TrendingUp size={12} className="inline mr-1" />ПРОДАЖА</>
            )}
          </span>
          <span className="text-sm text-gray-500">
            {CATEGORIES[request.category]}
          </span>
        </div>
        {request.matchesCount > 0 && (
          <span className="flex items-center gap-1 text-xs text-commerce-accent font-medium">
            <Users size={14} />
            {request.matchesCount}
          </span>
        )}
      </div>
      
      {/* Title */}
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
        {request.title}
      </h3>
      
      {/* Description */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {request.description}
      </p>
      
      {/* Details */}
      <div className="flex flex-wrap gap-3 mb-3">
        <div className="text-sm">
          <span className="text-gray-500">Объём: </span>
          <span className="font-medium">{request.volume} {request.unit}</span>
        </div>
        {(request.budget || request.price) && (
          <div className="text-sm">
            <span className="text-gray-500">{isBuy ? 'Бюджет: ' : 'Цена: '}</span>
            <span className="font-semibold text-commerce-primary">
              {formatMoney(request.budget || request.price || 0)}
            </span>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <MapPin size={14} />
          {request.region}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock size={14} />
          {timeAgo}
        </div>
      </div>
      
      {/* Action button */}
      {showActions && (
        <button 
          className={`w-full mt-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${
            isBuy 
              ? 'bg-green-500 text-white active:bg-green-600' 
              : 'bg-blue-500 text-white active:bg-blue-600'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            haptic('medium');
            // TODO: Открыть модалку отклика
          }}
        >
          {isBuy ? 'Предложить товар' : 'Хочу купить'}
        </button>
      )}
    </div>
  );
};

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 60) return `${minutes} мин назад`;
  if (hours < 24) return `${hours} ч назад`;
  if (days === 1) return 'Вчера';
  if (days < 7) return `${days} дн назад`;
  return new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

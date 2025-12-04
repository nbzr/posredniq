import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { RequestCard } from '../components/RequestCard';
import { useStore } from '../store';
import { CATEGORIES, type Category, type RequestType } from '../types';
import { useTelegram } from '../hooks/useTelegram';

export const HomePage: React.FC = () => {
  const { requests, filters, setFilters, fetchRequests, isLoading } = useStore();
  const { haptic } = useTelegram();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Загрузка данных при монтировании и при изменении фильтров
  useEffect(() => {
    fetchRequests(filters);
  }, [filters, fetchRequests]);
  
  // Фильтрация заявок
  const filteredRequests = requests.filter((req) => {
    if (filters.category && req.category !== filters.category) return false;
    if (filters.type && req.type !== filters.type) return false;
    if (filters.region && req.region !== filters.region) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        req.title.toLowerCase().includes(query) ||
        req.description.toLowerCase().includes(query)
      );
    }
    return true;
  });
  
  const activeFiltersCount = Object.values(filters).filter(Boolean).length;
  
  const clearFilters = () => {
    haptic('light');
    setFilters({});
    setSearchQuery('');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-commerce-primary text-white px-4 pt-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">Posredniq</h1>
            <p className="text-sm text-blue-200">B2B маркетплейс</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{requests.length}</div>
            <div className="text-xs text-blue-200">активных заявок</div>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по заявкам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white text-gray-900 placeholder-gray-400 text-sm"
          />
        </div>
      </div>
      
      {/* Filter tabs */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              haptic('light');
              setShowFilters(!showFilters);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              showFilters || activeFiltersCount > 0
                ? 'bg-commerce-primary text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Filter size={14} />
            Фильтры
            {activeFiltersCount > 0 && (
              <span className="bg-white text-commerce-primary text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
          
          <button
            onClick={() => {
              haptic('light');
              setFilters({ ...filters, type: filters.type === 'buy' ? undefined : 'buy' });
            }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filters.type === 'buy'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            🛒 Покупка
          </button>
          
          <button
            onClick={() => {
              haptic('light');
              setFilters({ ...filters, type: filters.type === 'sell' ? undefined : 'sell' });
            }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filters.type === 'sell'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            📦 Продажа
          </button>
          
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-red-500 bg-red-50 whitespace-nowrap"
            >
              <X size={14} />
              Сбросить
            </button>
          )}
        </div>
      </div>
      
      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-100 px-4 py-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Категория</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(CATEGORIES).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => {
                    haptic('light');
                    setFilters({ 
                      ...filters, 
                      category: filters.category === key ? undefined : key as Category 
                    });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    filters.category === key
                      ? 'bg-commerce-primary text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Requests list */}
      <div className="px-4 py-4 space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">⏳</div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Загрузка...</h3>
            <p className="text-sm text-gray-500">Получаем данные</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Ничего не найдено</h3>
            <p className="text-sm text-gray-500">Попробуйте изменить фильтры</p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))
        )}
      </div>
    </div>
  );
};

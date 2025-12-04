import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Users } from 'lucide-react';
import { RequestCard } from '../components/RequestCard';
import { useStore } from '../store';
import type { RequestStatus } from '../types';
import { useTelegram } from '../hooks/useTelegram';

type Tab = 'active' | 'matched' | 'completed';

export const MyRequestsPage: React.FC = () => {
  const { myRequests, fetchMyRequests, isLoading } = useStore();
  const { haptic } = useTelegram();
  const [activeTab, setActiveTab] = useState<Tab>('active');

  // Загрузка моих заявок при монтировании
  useEffect(() => {
    fetchMyRequests();
  }, [fetchMyRequests]);
  
  const tabs: { key: Tab; label: string; icon: React.ReactNode; statuses: RequestStatus[] }[] = [
    { key: 'active', label: 'Активные', icon: <Clock size={16} />, statuses: ['active'] },
    { key: 'matched', label: 'С откликами', icon: <Users size={16} />, statuses: ['matched', 'in_progress'] },
    { key: 'completed', label: 'Завершённые', icon: <CheckCircle size={16} />, statuses: ['completed', 'cancelled'] },
  ];
  
  const filteredRequests = myRequests.filter((req) =>
    tabs.find((t) => t.key === activeTab)?.statuses.includes(req.status)
  );
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-commerce-primary text-white px-4 pt-4 pb-6">
        <h1 className="text-xl font-bold mb-1">Мои заявки</h1>
        <p className="text-sm text-blue-200">
          Всего заявок: {myRequests.length}
        </p>
      </div>
      
      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-4 py-2 sticky top-0 z-40">
        <div className="flex gap-2">
          {tabs.map((tab) => {
            const count = myRequests.filter((r) => tab.statuses.includes(r.status)).length;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  haptic('light');
                  setActiveTab(tab.key);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-commerce-primary text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {tab.icon}
                {tab.label}
                {count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.key
                      ? 'bg-white/20'
                      : 'bg-gray-200'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Content */}
      <div className="px-4 py-4">
        {myRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Нет заявок</h3>
            <p className="text-sm text-gray-500 mb-4">
              Создайте первую заявку на покупку или продажу
            </p>
            <a href="/new" className="btn-primary inline-block">
              Создать заявку
            </a>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">📭</div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Нет заявок в этой категории
            </h3>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <RequestCard 
                key={request.id} 
                request={request} 
                showActions={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

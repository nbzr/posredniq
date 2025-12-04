import React, { useState, useEffect } from 'react';

// Mock Telegram WebApp API
const tg = window.Telegram?.WebApp || {
  ready: () => {},
  expand: () => {},
  MainButton: { show: () => {}, hide: () => {}, setText: () => {}, onClick: () => {} },
  BackButton: { show: () => {}, hide: () => {}, onClick: () => {} },
  themeParams: { bg_color: '#0a0a0f', text_color: '#ffffff', hint_color: '#8b8b9e', button_color: '#00ff88' },
  initDataUnsafe: { user: { id: 123456, first_name: 'Эдуард', last_name: 'Тест' } }
};

// Styles
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  :root {
    --bg: #0a0a0f;
    --bg-card: #16161f;
    --bg-elevated: #1e1e2a;
    --accent: #00ff88;
    --accent-dim: rgba(0, 255, 136, 0.15);
    --text: #ffffff;
    --text-secondary: #8b8b9e;
    --border: rgba(255, 255, 255, 0.1);
    --success: #00ff88;
    --warning: #ffaa00;
    --danger: #ff4466;
  }
  
  body {
    font-family: 'Inter', -apple-system, sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }
`;

// Database mock (в реальном приложении это будет API)
const mockDatabase = {
  requests: [
    { id: 1, type: 'buy', category: 'Стройматериалы', title: 'Арматура А500С', volume: '50 тонн', budget: '2 500 000 ₽', region: 'Москва', status: 'active', matches: 3, date: '2025-01-15' },
    { id: 2, type: 'sell', category: 'Оборудование', title: 'Станок ЧПУ Haas VF-2', volume: '1 шт', budget: '8 000 000 ₽', region: 'СПб', status: 'matched', matches: 2, date: '2025-01-14' },
    { id: 3, type: 'buy', category: 'Недвижимость', title: 'Склад класса B', volume: '1000 м²', budget: '15 000 000 ₽', region: 'МО', status: 'deal', matches: 1, date: '2025-01-13' },
  ],
  counterparties: [
    { id: 1, name: 'СтройМетКом', rating: 4.8, deals: 47, specialization: 'Металлопрокат', verified: true, region: 'Москва' },
    { id: 2, name: 'ПромСтрой', rating: 4.6, deals: 32, specialization: 'Стройматериалы', verified: true, region: 'СПб' },
    { id: 3, name: 'ТехноИндустрия', rating: 4.9, deals: 89, specialization: 'Оборудование', verified: true, region: 'Екатеринбург' },
  ],
  categories: [
    'Стройматериалы', 'Металлопрокат', 'Оборудование', 'Недвижимость', 
    'Земельные участки', 'Сырьё', 'Лесоматериалы', 'Энергоресурсы'
  ],
  deals: [
    { id: 1, title: 'Арматура А500С', counterparty: 'СтройМетКом', amount: '2 350 000 ₽', stage: 'payment', progress: 75 },
    { id: 2, title: 'Склад класса B', counterparty: 'ПромИнвест', amount: '14 800 000 ₽', stage: 'documents', progress: 50 },
  ]
};

// Icons
const Icons = {
  Plus: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>,
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  ArrowRight: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
  Star: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Home: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  FileText: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Users: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Briefcase: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  TrendingUp: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Shield: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
};

// Components
const TabBar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', icon: Icons.Home, label: 'Главная' },
    { id: 'requests', icon: Icons.FileText, label: 'Заявки' },
    { id: 'counterparties', icon: Icons.Users, label: 'Контрагенты' },
    { id: 'deals', icon: Icons.Briefcase, label: 'Сделки' },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'var(--bg-card)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '8px 0 24px',
      zIndex: 100,
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '8px 16px',
            transition: 'color 0.2s',
          }}
        >
          <tab.icon />
          <span style={{ fontSize: '11px', fontWeight: 500 }}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

const Header = ({ title, subtitle }) => (
  <div style={{ padding: '20px', paddingTop: '12px' }}>
    <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>{title}</h1>
    {subtitle && <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{subtitle}</p>}
  </div>
);

const Card = ({ children, onClick, style }) => (
  <div
    onClick={onClick}
    style={{
      background: 'var(--bg-card)',
      borderRadius: '16px',
      padding: '16px',
      border: '1px solid var(--border)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.2s, border-color 0.2s',
      ...style
    }}
  >
    {children}
  </div>
);

const Badge = ({ children, variant = 'default' }) => {
  const colors = {
    default: { bg: 'var(--accent-dim)', color: 'var(--accent)' },
    warning: { bg: 'rgba(255, 170, 0, 0.15)', color: '#ffaa00' },
    success: { bg: 'rgba(0, 255, 136, 0.15)', color: '#00ff88' },
    buy: { bg: 'rgba(0, 200, 255, 0.15)', color: '#00c8ff' },
    sell: { bg: 'rgba(255, 136, 0, 0.15)', color: '#ff8800' },
  };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 600,
      background: colors[variant].bg,
      color: colors[variant].color,
    }}>
      {children}
    </span>
  );
};

const ProgressBar = ({ progress }) => (
  <div style={{
    width: '100%',
    height: '6px',
    background: 'var(--border)',
    borderRadius: '3px',
    overflow: 'hidden',
  }}>
    <div style={{
      width: `${progress}%`,
      height: '100%',
      background: 'var(--accent)',
      borderRadius: '3px',
      transition: 'width 0.3s ease',
    }} />
  </div>
);

// Screens
const HomeScreen = ({ setActiveTab, setShowNewRequest }) => {
  const user = tg.initDataUnsafe?.user || { first_name: 'Пользователь' };
  
  const stats = [
    { label: 'Активных заявок', value: '12', icon: Icons.FileText },
    { label: 'Матчей за неделю', value: '8', icon: Icons.TrendingUp },
    { label: 'Сделок в работе', value: '3', icon: Icons.Briefcase },
  ];

  return (
    <div style={{ paddingBottom: '100px' }}>
      <Header 
        title={`Привет, ${user.first_name}!`} 
        subtitle="Что будем искать сегодня?" 
      />
      
      {/* Quick Actions */}
      <div style={{ padding: '0 20px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button
            onClick={() => setShowNewRequest({ type: 'buy' })}
            style={{
              background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
              border: 'none',
              borderRadius: '16px',
              padding: '20px',
              color: '#0a0a0f',
              fontWeight: 600,
              fontSize: '15px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '24px' }}>🛒</span>
            Хочу купить
          </button>
          <button
            onClick={() => setShowNewRequest({ type: 'sell' })}
            style={{
              background: 'var(--bg-card)',
              border: '2px solid var(--accent)',
              borderRadius: '16px',
              padding: '20px',
              color: 'var(--accent)',
              fontWeight: 600,
              fontSize: '15px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '24px' }}>📦</span>
            Хочу продать
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: '0 20px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Ваша статистика</h2>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
          {stats.map((stat, i) => (
            <Card key={i} style={{ minWidth: '140px', flex: '1' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '8px' }}>{stat.label}</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--accent)' }}>{stat.value}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Matches */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Новые матчи</h2>
          <button 
            onClick={() => setActiveTab('requests')}
            style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '14px', cursor: 'pointer' }}
          >
            Все →
          </button>
        </div>
        
        {mockDatabase.requests.filter(r => r.matches > 0).slice(0, 2).map(request => (
          <Card key={request.id} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <Badge variant={request.type}>{request.type === 'buy' ? 'Покупка' : 'Продажа'}</Badge>
              </div>
              <Badge variant="success">{request.matches} матч{request.matches > 1 ? 'а' : ''}</Badge>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{request.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{request.category} • {request.volume}</p>
            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{request.budget}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{request.region}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const RequestsScreen = ({ setShowNewRequest }) => {
  const [filter, setFilter] = useState('all');
  const requests = mockDatabase.requests.filter(r => filter === 'all' || r.type === filter);

  return (
    <div style={{ paddingBottom: '100px' }}>
      <Header title="Заявки" subtitle={`${requests.length} активных заявок`} />
      
      {/* Filters */}
      <div style={{ padding: '0 20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'buy', 'sell'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                background: filter === f ? 'var(--accent)' : 'var(--bg-card)',
                color: filter === f ? '#0a0a0f' : 'var(--text-secondary)',
                fontWeight: 500,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              {f === 'all' ? 'Все' : f === 'buy' ? 'Покупка' : 'Продажа'}
            </button>
          ))}
        </div>
      </div>

      {/* Request List */}
      <div style={{ padding: '0 20px' }}>
        {requests.map(request => (
          <Card key={request.id} onClick={() => {}} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <Badge variant={request.type}>{request.type === 'buy' ? 'Покупка' : 'Продажа'}</Badge>
              {request.matches > 0 && <Badge variant="success">{request.matches} матч{request.matches > 1 ? 'а' : ''}</Badge>}
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{request.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{request.category} • {request.volume}</p>
            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{request.budget}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{request.region}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowNewRequest({ type: 'buy' })}
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '20px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--accent)',
          border: 'none',
          color: '#0a0a0f',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0, 255, 136, 0.4)',
        }}
      >
        <Icons.Plus />
      </button>
    </div>
  );
};

const CounterpartiesScreen = () => {
  const [search, setSearch] = useState('');
  const counterparties = mockDatabase.counterparties.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.specialization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ paddingBottom: '100px' }}>
      <Header title="Контрагенты" subtitle={`${counterparties.length} проверенных компаний`} />
      
      {/* Search */}
      <div style={{ padding: '0 20px', marginBottom: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'var(--bg-card)',
          borderRadius: '12px',
          padding: '12px 16px',
          border: '1px solid var(--border)',
        }}>
          <Icons.Search />
          <input
            type="text"
            placeholder="Поиск по названию или специализации"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              color: 'var(--text)',
              fontSize: '15px',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Counterparty List */}
      <div style={{ padding: '0 20px' }}>
        {counterparties.map(cp => (
          <Card key={cp.id} onClick={() => {}} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{cp.name}</h3>
                  {cp.verified && (
                    <span style={{ color: 'var(--accent)' }}><Icons.Shield /></span>
                  )}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{cp.specialization}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ffaa00' }}>
                  <Icons.Star />
                  <span style={{ fontWeight: 600 }}>{cp.rating}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{cp.deals} сделок</p>
              </div>
            </div>
            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>📍 {cp.region}</span>
              <button style={{
                background: 'var(--accent-dim)',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                color: 'var(--accent)',
                fontWeight: 500,
                fontSize: '13px',
                cursor: 'pointer',
              }}>
                Связаться
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const DealsScreen = () => {
  const deals = mockDatabase.deals;
  const stages = {
    negotiation: 'Переговоры',
    documents: 'Документы',
    payment: 'Оплата',
    delivery: 'Доставка',
    completed: 'Завершено',
  };

  return (
    <div style={{ paddingBottom: '100px' }}>
      <Header title="Сделки" subtitle={`${deals.length} активных сделок`} />
      
      {/* Summary */}
      <div style={{ padding: '0 20px', marginBottom: '24px' }}>
        <Card style={{ background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 200, 255, 0.1) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '4px' }}>Общий объём в работе</p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent)' }}>17 150 000 ₽</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '4px' }}>Ожидаемая комиссия</p>
              <p style={{ fontSize: '20px', fontWeight: 600 }}>514 500 ₽</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Deal List */}
      <div style={{ padding: '0 20px' }}>
        {deals.map(deal => (
          <Card key={deal.id} onClick={() => {}} style={{ marginBottom: '12px' }}>
            <div style={{ marginBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{deal.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>с {deal.counterparty}</p>
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{stages[deal.stage]}</span>
                <span style={{ fontSize: '13px', fontWeight: 500 }}>{deal.progress}%</span>
              </div>
              <ProgressBar progress={deal.progress} />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '18px' }}>{deal.amount}</span>
              <button style={{
                background: 'var(--accent)',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                color: '#0a0a0f',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                Открыть <Icons.ArrowRight />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const NewRequestModal = ({ type, onClose }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    type: type || 'buy',
    category: '',
    title: '',
    volume: '',
    budget: '',
    region: '',
    description: '',
  });

  const handleSubmit = () => {
    console.log('New request:', form);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--bg)',
      zIndex: 200,
      overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        background: 'var(--bg)',
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '16px', cursor: 'pointer' }}>
          Отмена
        </button>
        <h2 style={{ fontSize: '17px', fontWeight: 600 }}>Новая заявка</h2>
        <button 
          onClick={handleSubmit}
          style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}
        >
          Готово
        </button>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Type Toggle */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Тип заявки</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['buy', 'sell'].map(t => (
              <button
                key={t}
                onClick={() => setForm({ ...form, type: t })}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '12px',
                  border: form.type === t ? '2px solid var(--accent)' : '1px solid var(--border)',
                  background: form.type === t ? 'var(--accent-dim)' : 'var(--bg-card)',
                  color: form.type === t ? 'var(--accent)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: 'pointer',
                }}
              >
                {t === 'buy' ? '🛒 Покупка' : '📦 Продажа'}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Категория</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {mockDatabase.categories.map(cat => (
              <button
                key={cat}
                onClick={() => setForm({ ...form, category: cat })}
                style={{
                  padding: '10px 16px',
                  borderRadius: '20px',
                  border: form.category === cat ? '2px solid var(--accent)' : '1px solid var(--border)',
                  background: form.category === cat ? 'var(--accent-dim)' : 'var(--bg-card)',
                  color: form.category === cat ? 'var(--accent)' : 'var(--text)',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Название / Описание товара</label>
          <input
            type="text"
            placeholder="Например: Арматура А500С d12"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              color: 'var(--text)',
              fontSize: '15px',
              outline: 'none',
            }}
          />
        </div>

        {/* Volume */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Объём</label>
          <input
            type="text"
            placeholder="Например: 50 тонн"
            value={form.volume}
            onChange={e => setForm({ ...form, volume: e.target.value })}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              color: 'var(--text)',
              fontSize: '15px',
              outline: 'none',
            }}
          />
        </div>

        {/* Budget */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Бюджет / Цена</label>
          <input
            type="text"
            placeholder="Например: 2 500 000 ₽"
            value={form.budget}
            onChange={e => setForm({ ...form, budget: e.target.value })}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              color: 'var(--text)',
              fontSize: '15px',
              outline: 'none',
            }}
          />
        </div>

        {/* Region */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Регион</label>
          <input
            type="text"
            placeholder="Например: Москва и МО"
            value={form.region}
            onChange={e => setForm({ ...form, region: e.target.value })}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              color: 'var(--text)',
              fontSize: '15px',
              outline: 'none',
            }}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Дополнительные требования</label>
          <textarea
            placeholder="Опишите детали: сроки, требования к качеству, условия доставки..."
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            rows={4}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              color: 'var(--text)',
              fontSize: '15px',
              outline: 'none',
              resize: 'none',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            border: 'none',
            background: 'var(--accent)',
            color: '#0a0a0f',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: '12px',
          }}
        >
          Опубликовать заявку
        </button>
      </div>
    </div>
  );
};

// Main App
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showNewRequest, setShowNewRequest] = useState(null);

  useEffect(() => {
    tg.ready();
    tg.expand();
  }, []);

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen setActiveTab={setActiveTab} setShowNewRequest={setShowNewRequest} />;
      case 'requests':
        return <RequestsScreen setShowNewRequest={setShowNewRequest} />;
      case 'counterparties':
        return <CounterpartiesScreen />;
      case 'deals':
        return <DealsScreen />;
      default:
        return <HomeScreen setActiveTab={setActiveTab} setShowNewRequest={setShowNewRequest} />;
    }
  };

  return (
    <>
      <style>{styles}</style>
      {renderScreen()}
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      {showNewRequest && (
        <NewRequestModal 
          type={showNewRequest.type} 
          onClose={() => setShowNewRequest(null)} 
        />
      )}
    </>
  );
}

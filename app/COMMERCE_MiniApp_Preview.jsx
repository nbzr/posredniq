import React, { useState, useEffect } from 'react';
import { Home, PlusCircle, FileText, User, Search, Filter, MapPin, Clock, TrendingUp, TrendingDown, Users, ShoppingCart, Package, ChevronRight, Check, Building2, Phone, Star, Shield, X } from 'lucide-react';

// Types
const CATEGORIES = {
  construction: '🏗️ Стройматериалы',
  metal: '⚙️ Металлопрокат',
  wood: '🪵 Лесоматериалы',
  chemicals: '🧪 Химия',
  energy: '⚡ Энергоресурсы',
  equipment: '🔧 Оборудование',
  real_estate: '🏢 Недвижимость',
  other: '📦 Другое',
};

const REGIONS = ['Москва', 'Санкт-Петербург', 'Московская область', 'Краснодарский край', 'Другой регион'];

// Mock data
const mockRequests = [
  { id: '1', type: 'buy', category: 'construction', title: 'Цемент М500 оптом', description: 'Нужен цемент для строительного объекта в Москве', volume: '500', unit: 'тонн', budget: 2500000, region: 'Москва', matchesCount: 3, createdAt: new Date(Date.now() - 2*60*60*1000) },
  { id: '2', type: 'sell', category: 'metal', title: 'Арматура А500С ⌀12мм', description: 'Продаём арматуру со склада в Подмосковье', volume: '200', unit: 'тонн', price: 65000, region: 'Московская область', matchesCount: 7, createdAt: new Date(Date.now() - 5*60*60*1000) },
  { id: '3', type: 'buy', category: 'wood', title: 'Доска обрезная 50х150', description: 'Ищем поставщика доски для мебельного производства', volume: '100', unit: 'м³', budget: 1800000, region: 'Краснодарский край', matchesCount: 2, createdAt: new Date(Date.now() - 24*60*60*1000) },
  { id: '4', type: 'sell', category: 'equipment', title: 'Экскаватор CAT 320D', description: 'Продаём экскаватор 2019 года, отличное состояние', volume: '1', unit: 'шт', price: 12000000, region: 'Москва', matchesCount: 5, createdAt: new Date(Date.now() - 3*24*60*60*1000) },
];

const formatMoney = (amount) => {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M ₽`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K ₽`;
  return `${amount} ₽`;
};

const getTimeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 60) return `${minutes} мин`;
  if (hours < 24) return `${hours} ч`;
  return `${days} дн`;
};

// Components
const RequestCard = ({ request, showActions = true, onRespond }) => {
  const isBuy = request.type === 'buy';
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${isBuy ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
            {isBuy ? <><TrendingDown size={12} className="inline mr-1"/>ПОКУПКА</> : <><TrendingUp size={12} className="inline mr-1"/>ПРОДАЖА</>}
          </span>
          <span className="text-sm text-gray-500">{CATEGORIES[request.category]}</span>
        </div>
        {request.matchesCount > 0 && (
          <span className="flex items-center gap-1 text-xs text-orange-500 font-medium">
            <Users size={14}/>{request.matchesCount}
          </span>
        )}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{request.title}</h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{request.description}</p>
      <div className="flex flex-wrap gap-3 mb-3">
        <div className="text-sm"><span className="text-gray-500">Объём: </span><span className="font-medium">{request.volume} {request.unit}</span></div>
        {(request.budget || request.price) && (
          <div className="text-sm"><span className="text-gray-500">{isBuy ? 'Бюджет: ' : 'Цена: '}</span>
            <span className="font-semibold text-blue-900">{formatMoney(request.budget || request.price)}</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1 text-xs text-gray-400"><MapPin size={14}/>{request.region}</div>
        <div className="flex items-center gap-1 text-xs text-gray-400"><Clock size={14}/>{getTimeAgo(request.createdAt)}</div>
      </div>
      {showActions && (
        <button onClick={onRespond} className={`w-full mt-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${isBuy ? 'bg-green-500 text-white active:bg-green-600' : 'bg-blue-500 text-white active:bg-blue-600'}`}>
          {isBuy ? 'Предложить товар' : 'Хочу купить'}
        </button>
      )}
    </div>
  );
};

// Pages
const HomePage = ({ requests, onNavigate }) => {
  const [filterType, setFilterType] = useState(null);
  const filtered = filterType ? requests.filter(r => r.type === filterType) : requests;
  
  return (
    <div className="min-h-full bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white px-4 pt-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div><h1 className="text-xl font-bold">COMMERCE</h1><p className="text-sm text-blue-200">B2B маркетплейс</p></div>
          <div className="text-right"><div className="text-2xl font-bold">{requests.length}</div><div className="text-xs text-blue-200">активных</div></div>
        </div>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input type="text" placeholder="Поиск по заявкам..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white text-gray-900 placeholder-gray-400 text-sm"/>
        </div>
      </div>
      <div className="bg-white border-b px-4 py-3 sticky top-0 z-40">
        <div className="flex gap-2">
          <button onClick={() => setFilterType(filterType === 'buy' ? null : 'buy')} className={`px-3 py-1.5 rounded-full text-sm font-medium ${filterType === 'buy' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}>🛒 Покупка</button>
          <button onClick={() => setFilterType(filterType === 'sell' ? null : 'sell')} className={`px-3 py-1.5 rounded-full text-sm font-medium ${filterType === 'sell' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}>📦 Продажа</button>
        </div>
      </div>
      <div className="px-4 py-4 space-y-4">
        {filtered.map(r => <RequestCard key={r.id} request={r} onRespond={() => alert('✅ Отклик отправлен! Мы свяжем вас с контрагентом.')}/>)}
      </div>
    </div>
  );
};

const NewRequestPage = ({ onSubmit, onBack }) => {
  const [step, setStep] = useState('type');
  const [form, setForm] = useState({ type: '', category: '', title: '', description: '', volume: '', unit: 'тонн', budget: '', price: '', region: '' });
  
  if (step === 'type') return (
    <div className="min-h-full bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white px-4 pt-4 pb-6">
        <h1 className="text-xl font-bold mb-1">Новая заявка</h1>
        <p className="text-sm text-blue-200">Что вы хотите сделать?</p>
        <div className="flex gap-2 mt-4">{[1,2,3,4].map((i,idx) => <div key={i} className={`h-1 flex-1 rounded-full ${idx === 0 ? 'bg-white' : 'bg-white/30'}`}/>)}</div>
      </div>
      <div className="px-4 py-6 space-y-4">
        <button onClick={() => { setForm({...form, type: 'buy'}); setStep('category'); }} className="w-full bg-white rounded-2xl p-4 shadow-sm border flex items-center gap-4">
          <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center"><ShoppingCart className="text-green-600" size={28}/></div>
          <div className="flex-1 text-left"><h3 className="font-semibold">Хочу купить</h3><p className="text-sm text-gray-500">Ищу товар или услугу</p></div>
          <ChevronRight className="text-gray-400"/>
        </button>
        <button onClick={() => { setForm({...form, type: 'sell'}); setStep('category'); }} className="w-full bg-white rounded-2xl p-4 shadow-sm border flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center"><Package className="text-blue-600" size={28}/></div>
          <div className="flex-1 text-left"><h3 className="font-semibold">Хочу продать</h3><p className="text-sm text-gray-500">Предлагаю товар</p></div>
          <ChevronRight className="text-gray-400"/>
        </button>
      </div>
    </div>
  );
  
  if (step === 'category') return (
    <div className="min-h-full bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white px-4 pt-4 pb-6">
        <h1 className="text-xl font-bold mb-1">Новая заявка</h1>
        <p className="text-sm text-blue-200">Выберите категорию</p>
        <div className="flex gap-2 mt-4">{[1,2,3,4].map((i,idx) => <div key={i} className={`h-1 flex-1 rounded-full ${idx <= 1 ? 'bg-white' : 'bg-white/30'}`}/>)}</div>
      </div>
      <div className="px-4 py-6 space-y-3">
        {Object.entries(CATEGORIES).map(([key, label]) => (
          <button key={key} onClick={() => { setForm({...form, category: key}); setStep('details'); }} className="w-full bg-white rounded-2xl p-4 shadow-sm border flex items-center justify-between">
            <span className="text-lg">{label}</span>
            {form.category === key && <Check className="text-blue-900" size={20}/>}
          </button>
        ))}
        <button onClick={() => setStep('type')} className="w-full py-3 text-gray-500 text-sm">← Назад</button>
      </div>
    </div>
  );
  
  if (step === 'details') return (
    <div className="min-h-full bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white px-4 pt-4 pb-6">
        <h1 className="text-xl font-bold mb-1">Новая заявка</h1>
        <p className="text-sm text-blue-200">Детали заявки</p>
        <div className="flex gap-2 mt-4">{[1,2,3,4].map((i,idx) => <div key={i} className={`h-1 flex-1 rounded-full ${idx <= 2 ? 'bg-white' : 'bg-white/30'}`}/>)}</div>
      </div>
      <div className="px-4 py-6 space-y-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Название</label>
          <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none" placeholder="Цемент М500 оптом" value={form.title} onChange={e => setForm({...form, title: e.target.value})}/></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Описание</label>
          <textarea className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none min-h-[80px]" placeholder="Подробности..." value={form.description} onChange={e => setForm({...form, description: e.target.value})}/></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Объём</label>
            <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200" placeholder="100" value={form.volume} onChange={e => setForm({...form, volume: e.target.value})}/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Ед.</label>
            <select className="w-full px-4 py-3 rounded-xl border border-gray-200" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
              <option>тонн</option><option>м³</option><option>шт</option><option>кг</option>
            </select></div>
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{form.type === 'buy' ? 'Бюджет (₽)' : 'Цена (₽)'}</label>
          <input type="number" className="w-full px-4 py-3 rounded-xl border border-gray-200" placeholder="1000000" value={form.type === 'buy' ? form.budget : form.price} onChange={e => setForm({...form, [form.type === 'buy' ? 'budget' : 'price']: e.target.value})}/></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Регион</label>
          <select className="w-full px-4 py-3 rounded-xl border border-gray-200" value={form.region} onChange={e => setForm({...form, region: e.target.value})}>
            <option value="">Выберите</option>{REGIONS.map(r => <option key={r}>{r}</option>)}
          </select></div>
        <div className="flex gap-3 pt-4">
          <button onClick={() => setStep('category')} className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium">Назад</button>
          <button onClick={() => setStep('confirm')} disabled={!form.title || !form.volume || !form.region} className="flex-1 py-3 bg-blue-900 text-white rounded-xl font-medium disabled:opacity-50">Далее</button>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-full bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white px-4 pt-4 pb-6">
        <h1 className="text-xl font-bold mb-1">Новая заявка</h1>
        <p className="text-sm text-blue-200">Проверьте заявку</p>
        <div className="flex gap-2 mt-4">{[1,2,3,4].map((i) => <div key={i} className="h-1 flex-1 rounded-full bg-white"/>)}</div>
      </div>
      <div className="px-4 py-6 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${form.type === 'buy' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
              {form.type === 'buy' ? '🛒 ПОКУПКА' : '📦 ПРОДАЖА'}
            </span>
            <span className="text-sm text-gray-500">{CATEGORIES[form.category]}</span>
          </div>
          <h3 className="font-semibold text-lg mb-2">{form.title}</h3>
          <p className="text-gray-600 text-sm mb-4">{form.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">Объём:</span> <span className="font-medium">{form.volume} {form.unit}</span></div>
            <div><span className="text-gray-500">{form.type === 'buy' ? 'Бюджет:' : 'Цена:'}</span> <span className="font-semibold text-blue-900">{Number(form.type === 'buy' ? form.budget : form.price).toLocaleString()} ₽</span></div>
            <div className="col-span-2"><span className="text-gray-500">Регион:</span> <span className="font-medium">{form.region}</span></div>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-800">⚡ После публикации мы начнём искать контрагентов</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setStep('details')} className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium">Назад</button>
          <button onClick={() => { onSubmit(form); }} className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-medium">Опубликовать 🚀</button>
        </div>
      </div>
    </div>
  );
};

const MyRequestsPage = ({ requests }) => (
  <div className="min-h-full bg-gray-50 pb-20">
    <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white px-4 pt-4 pb-6">
      <h1 className="text-xl font-bold mb-1">Мои заявки</h1>
      <p className="text-sm text-blue-200">Всего: {requests.length}</p>
    </div>
    <div className="px-4 py-4 space-y-4">
      {requests.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><FileText className="text-gray-400" size={32}/></div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Нет заявок</h3>
          <p className="text-sm text-gray-500">Создайте первую заявку</p>
        </div>
      ) : requests.map(r => <RequestCard key={r.id} request={r} showActions={false}/>)}
    </div>
  </div>
);

const ProfilePage = () => (
  <div className="min-h-full bg-gray-50 pb-20">
    <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white px-4 pt-4 pb-8">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">Э</div>
        <div><h1 className="text-xl font-bold">Эдуард</h1><p className="text-sm text-blue-200">@eduard_commerce</p></div>
      </div>
    </div>
    <div className="px-4 -mt-4">
      <div className="bg-white rounded-2xl shadow-sm p-4 grid grid-cols-3 gap-4">
        {[{label: 'Заявок', value: '12', icon: <FileText size={18}/>}, {label: 'Сделок', value: '5', icon: <Shield size={18}/>}, {label: 'Рейтинг', value: '4.8', icon: <Star size={18}/>}].map(s => (
          <div key={s.label} className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-900 mb-1">{s.icon}</div>
            <div className="text-xl font-bold">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
    <div className="px-4 py-6">
      <div className="bg-white rounded-2xl shadow-sm divide-y">
        {[{label: 'Мои данные', icon: <User size={20}/>}, {label: 'Верификация', icon: <Shield size={20}/>, badge: '✓'}, {label: 'История сделок', icon: <FileText size={20}/>}].map(item => (
          <button key={item.label} className="w-full flex items-center justify-between p-4">
            <div className="flex items-center gap-3"><span className="text-gray-500">{item.icon}</span><span className="font-medium">{item.label}</span></div>
            <div className="flex items-center gap-2">
              {item.badge && <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">{item.badge}</span>}
              <ChevronRight className="text-gray-400" size={18}/>
            </div>
          </button>
        ))}
      </div>
    </div>
    <p className="text-center text-xs text-gray-400">COMMERCE v0.1.0 • MVP</p>
  </div>
);

// Main App
export default function App() {
  const [page, setPage] = useState('home');
  const [requests, setRequests] = useState(mockRequests);
  const [myRequests, setMyRequests] = useState([]);

  const handleSubmit = (form) => {
    const newReq = { ...form, id: Date.now().toString(), matchesCount: 0, createdAt: new Date() };
    setRequests([newReq, ...requests]);
    setMyRequests([newReq, ...myRequests]);
    alert('✅ Заявка создана!');
    setPage('my');
  };

  return (
    <div className="w-full max-w-md mx-auto h-[700px] bg-gray-50 rounded-3xl overflow-hidden shadow-2xl border-8 border-gray-900 relative">
      <div className="h-full overflow-y-auto">
        {page === 'home' && <HomePage requests={requests} onNavigate={setPage}/>}
        {page === 'new' && <NewRequestPage onSubmit={handleSubmit} onBack={() => setPage('home')}/>}
        {page === 'my' && <MyRequestsPage requests={myRequests}/>}
        {page === 'profile' && <ProfilePage/>}
      </div>
      
      {/* Bottom Nav */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-16">
          {[
            { key: 'home', icon: <Home size={22}/>, label: 'Лента' },
            { key: 'new', icon: <PlusCircle size={22}/>, label: 'Заявка' },
            { key: 'my', icon: <FileText size={22}/>, label: 'Мои' },
            { key: 'profile', icon: <User size={22}/>, label: 'Профиль' },
          ].map(item => (
            <button key={item.key} onClick={() => setPage(item.key)} className={`flex flex-col items-center justify-center w-full h-full transition-colors ${page === item.key ? 'text-blue-900' : 'text-gray-400'}`}>
              {item.icon}
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

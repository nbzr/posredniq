import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, ChevronRight, Check } from 'lucide-react';
import { useStore } from '../store';
import { CATEGORIES, REGIONS, type Category, type RequestType } from '../types';
import { useTelegram } from '../hooks/useTelegram';

type Step = 'type' | 'category' | 'details' | 'confirm';

export const NewRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const { addRequest, user } = useStore();
  const { haptic, hapticSuccess, showAlert } = useTelegram();
  
  const [step, setStep] = useState<Step>('type');
  const [formData, setFormData] = useState({
    type: '' as RequestType | '',
    category: '' as Category | '',
    title: '',
    description: '',
    volume: '',
    unit: 'шт',
    budget: '',
    price: '',
    region: '',
  });
  
  const updateForm = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };
  
  const nextStep = () => {
    haptic('light');
    if (step === 'type') setStep('category');
    else if (step === 'category') setStep('details');
    else if (step === 'details') setStep('confirm');
  };
  
  const prevStep = () => {
    haptic('light');
    if (step === 'category') setStep('type');
    else if (step === 'details') setStep('category');
    else if (step === 'confirm') setStep('details');
  };
  
  const handleSubmit = async () => {
    hapticSuccess();

    const request = await addRequest({
      userId: user?.id || 'anonymous',
      type: formData.type as RequestType,
      category: formData.category as Category,
      title: formData.title,
      description: formData.description,
      volume: formData.volume,
      unit: formData.unit,
      budget: formData.type === 'buy' ? Number(formData.budget) : undefined,
      price: formData.type === 'sell' ? Number(formData.price) : undefined,
      region: formData.region,
    });

    if (request) {
      showAlert('✅ Заявка создана! Мы уведомим вас о новых матчах.');
      navigate('/my-requests');
    } else {
      showAlert('❌ Ошибка при создании заявки. Попробуйте снова.');
    }
  };
  
  const isDetailsValid = 
    formData.title.length >= 5 &&
    formData.description.length >= 10 &&
    formData.volume &&
    formData.region &&
    (formData.type === 'buy' ? formData.budget : formData.price);
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-commerce-primary text-white px-4 pt-4 pb-6">
        <h1 className="text-xl font-bold mb-1">Новая заявка</h1>
        <p className="text-sm text-blue-200">
          {step === 'type' && 'Что вы хотите сделать?'}
          {step === 'category' && 'Выберите категорию'}
          {step === 'details' && 'Детали заявки'}
          {step === 'confirm' && 'Проверьте заявку'}
        </p>
        
        {/* Progress */}
        <div className="flex gap-2 mt-4">
          {['type', 'category', 'details', 'confirm'].map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                ['type', 'category', 'details', 'confirm'].indexOf(step) >= i
                  ? 'bg-white'
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
      
      <div className="px-4 py-6">
        {/* Step 1: Type */}
        {step === 'type' && (
          <div className="space-y-4">
            <button
              onClick={() => {
                updateForm('type', 'buy');
                nextStep();
              }}
              className={`w-full card flex items-center gap-4 transition-all ${
                formData.type === 'buy' ? 'ring-2 ring-green-500' : ''
              }`}
            >
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <ShoppingCart className="text-green-600" size={28} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900">Хочу купить</h3>
                <p className="text-sm text-gray-500">Ищу товар или услугу</p>
              </div>
              <ChevronRight className="text-gray-400" />
            </button>
            
            <button
              onClick={() => {
                updateForm('type', 'sell');
                nextStep();
              }}
              className={`w-full card flex items-center gap-4 transition-all ${
                formData.type === 'sell' ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="text-blue-600" size={28} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900">Хочу продать</h3>
                <p className="text-sm text-gray-500">Предлагаю товар или услугу</p>
              </div>
              <ChevronRight className="text-gray-400" />
            </button>
          </div>
        )}
        
        {/* Step 2: Category */}
        {step === 'category' && (
          <div className="space-y-3">
            {Object.entries(CATEGORIES).map(([key, label]) => (
              <button
                key={key}
                onClick={() => {
                  updateForm('category', key);
                  nextStep();
                }}
                className={`w-full card flex items-center justify-between transition-all ${
                  formData.category === key ? 'ring-2 ring-commerce-primary' : ''
                }`}
              >
                <span className="text-lg text-gray-900">{label}</span>
                {formData.category === key && (
                  <Check className="text-commerce-primary" size={20} />
                )}
              </button>
            ))}
            
            <button
              onClick={prevStep}
              className="w-full py-3 text-gray-500 text-sm"
            >
              ← Назад
            </button>
          </div>
        )}
        
        {/* Step 3: Details */}
        {step === 'details' && (
          <div className="space-y-4">
            <div>
              <label className="label">Название заявки *</label>
              <input
                type="text"
                className="input"
                placeholder="Например: Цемент М500 оптом"
                value={formData.title}
                onChange={(e) => updateForm('title', e.target.value)}
              />
            </div>
            
            <div>
              <label className="label">Описание *</label>
              <textarea
                className="input min-h-[100px] resize-none"
                placeholder="Подробно опишите что вам нужно или что предлагаете..."
                value={formData.description}
                onChange={(e) => updateForm('description', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Объём *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="100"
                  value={formData.volume}
                  onChange={(e) => updateForm('volume', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Единица</label>
                <select
                  className="input"
                  value={formData.unit}
                  onChange={(e) => updateForm('unit', e.target.value)}
                >
                  <option value="шт">шт</option>
                  <option value="тонн">тонн</option>
                  <option value="м³">м³</option>
                  <option value="м²">м²</option>
                  <option value="кг">кг</option>
                  <option value="л">л</option>
                  <option value="комплект">комплект</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="label">
                {formData.type === 'buy' ? 'Бюджет (₽) *' : 'Цена (₽) *'}
              </label>
              <input
                type="number"
                className="input"
                placeholder="1000000"
                value={formData.type === 'buy' ? formData.budget : formData.price}
                onChange={(e) => updateForm(
                  formData.type === 'buy' ? 'budget' : 'price', 
                  e.target.value
                )}
              />
            </div>
            
            <div>
              <label className="label">Регион *</label>
              <select
                className="input"
                value={formData.region}
                onChange={(e) => updateForm('region', e.target.value)}
              >
                <option value="">Выберите регион</option>
                {REGIONS.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                onClick={prevStep}
                className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium"
              >
                Назад
              </button>
              <button
                onClick={nextStep}
                disabled={!isDetailsValid}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Далее
              </button>
            </div>
          </div>
        )}
        
        {/* Step 4: Confirm */}
        {step === 'confirm' && (
          <div className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  formData.type === 'buy' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {formData.type === 'buy' ? '🛒 ПОКУПКА' : '📦 ПРОДАЖА'}
                </span>
                <span className="text-sm text-gray-500">
                  {CATEGORIES[formData.category as Category]}
                </span>
              </div>
              
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {formData.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4">
                {formData.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Объём:</span>
                  <span className="font-medium ml-1">{formData.volume} {formData.unit}</span>
                </div>
                <div>
                  <span className="text-gray-500">
                    {formData.type === 'buy' ? 'Бюджет:' : 'Цена:'}
                  </span>
                  <span className="font-semibold text-commerce-primary ml-1">
                    {Number(formData.type === 'buy' ? formData.budget : formData.price).toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Регион:</span>
                  <span className="font-medium ml-1">{formData.region}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-800">
                ⚡ После публикации ваша заявка появится в ленте и мы начнём искать подходящих контрагентов.
              </p>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                onClick={prevStep}
                className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium"
              >
                Назад
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 btn-accent"
              >
                Опубликовать 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

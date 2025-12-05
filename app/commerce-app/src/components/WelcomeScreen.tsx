import React, { useState, useEffect } from 'react';
import { X, Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';

interface WelcomeScreenProps {
  onClose: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onClose }) => {
  const { user, haptic } = useTelegram();
  const [currentStep, setCurrentStep] = useState(0);

  const firstName = user?.first_name || 'друг';

  const steps = [
    {
      icon: <Sparkles size={48} className="text-commerce-primary" />,
      title: `${firstName}, добро пожаловать в Posredniq`,
      description: 'Платформа, где бизнес находит бизнес. Здесь нет случайных людей — только те, кто понимает ценность времени и возможностей.',
    },
    {
      icon: <TrendingUp size={48} className="text-commerce-primary" />,
      title: 'Находи то, что ищешь',
      description: 'Публикуй заявки на покупку или продажу. Система автоматически найдет идеальные совпадения среди тысяч предложений.',
    },
    {
      icon: <Zap size={48} className="text-commerce-primary" />,
      title: 'Действуй быстро',
      description: 'Каждая минута — это сделка, которую кто-то другой может закрыть раньше тебя. Здесь побеждает тот, кто действует сейчас.',
    },
    {
      icon: <Shield size={48} className="text-commerce-primary" />,
      title: 'Верификация = доверие',
      description: 'Пройди верификацию и получи доступ к эксклюзивным сделкам. Непроверенные профили видят только верхушку айсберга.',
    },
  ];

  const handleNext = () => {
    haptic('light');
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    haptic('medium');
    localStorage.setItem('welcomeShown', 'true');
    onClose();
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 relative animate-slideUp">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} className="text-gray-400" />
        </button>

        <div className="text-center">
          <div className="flex justify-center mb-6">
            {currentStepData.icon}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {currentStepData.title}
          </h2>

          <p className="text-gray-600 mb-8 leading-relaxed">
            {currentStepData.description}
          </p>

          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-commerce-primary'
                    : 'w-2 bg-gray-200'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-full btn-primary"
          >
            {currentStep < steps.length - 1 ? 'Далее' : 'Начать работу'}
          </button>

          {currentStep < steps.length - 1 && (
            <button
              onClick={handleClose}
              className="w-full mt-3 py-3 text-gray-500 font-medium"
            >
              Пропустить
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

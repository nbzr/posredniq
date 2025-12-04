import { useEffect, useCallback } from 'react';

// Получаем WebApp или возвращаем моки для разработки
const getWebApp = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  // Mock для разработки вне Telegram
  return {
    ready: () => {},
    expand: () => {},
    close: () => {},
    MainButton: {
      text: '',
      color: '#2481cc',
      textColor: '#ffffff',
      isVisible: false,
      isActive: true,
      show: () => {},
      hide: () => {},
      enable: () => {},
      disable: () => {},
      onClick: () => {},
      offClick: () => {},
    },
    BackButton: {
      isVisible: false,
      show: () => {},
      hide: () => {},
      onClick: () => {},
      offClick: () => {},
    },
    HapticFeedback: {
      impactOccurred: () => {},
      notificationOccurred: () => {},
      selectionChanged: () => {},
    },
    initData: '',
    initDataUnsafe: {
      user: {
        id: 123456789,
        first_name: 'Тест',
        last_name: 'Пользователь',
        username: 'testuser',
      },
    },
    colorScheme: 'light' as const,
    themeParams: {},
    showAlert: (msg: string) => alert(msg),
    showConfirm: (msg: string, cb: (ok: boolean) => void) => cb(confirm(msg)),
    setHeaderColor: () => {},
    setBackgroundColor: () => {},
  };
};

export const useTelegram = () => {
  const webApp = getWebApp();
  
  useEffect(() => {
    webApp.ready();
    webApp.expand();
    webApp.setHeaderColor('#1E3A5F');
  }, []);
  
  const user = webApp.initDataUnsafe.user;
  
  const haptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    webApp.HapticFeedback.impactOccurred(type);
  }, []);
  
  const hapticSuccess = useCallback(() => {
    webApp.HapticFeedback.notificationOccurred('success');
  }, []);
  
  const hapticError = useCallback(() => {
    webApp.HapticFeedback.notificationOccurred('error');
  }, []);
  
  const showMainButton = useCallback((text: string, onClick: () => void) => {
    webApp.MainButton.text = text;
    webApp.MainButton.onClick(onClick);
    webApp.MainButton.show();
    return () => {
      webApp.MainButton.offClick(onClick);
      webApp.MainButton.hide();
    };
  }, []);
  
  const hideMainButton = useCallback(() => {
    webApp.MainButton.hide();
  }, []);
  
  const showBackButton = useCallback((onClick: () => void) => {
    webApp.BackButton.onClick(onClick);
    webApp.BackButton.show();
    return () => {
      webApp.BackButton.offClick(onClick);
      webApp.BackButton.hide();
    };
  }, []);
  
  const hideBackButton = useCallback(() => {
    webApp.BackButton.hide();
  }, []);
  
  const showAlert = useCallback((message: string) => {
    webApp.showAlert(message);
  }, []);
  
  const showConfirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      webApp.showConfirm(message, resolve);
    });
  }, []);
  
  return {
    webApp,
    user,
    haptic,
    hapticSuccess,
    hapticError,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    showAlert,
    showConfirm,
    colorScheme: webApp.colorScheme,
  };
};

// Типы для COMMERCE Mini App

export type RequestType = 'buy' | 'sell';

export type RequestStatus = 'active' | 'matched' | 'in_progress' | 'completed' | 'cancelled';

export type Category =
  | 'construction'
  | 'metal'
  | 'equipment'
  | 'real_estate'
  | 'land'
  | 'raw_materials'
  | 'wood'
  | 'energy'
  | 'transport'
  | 'special_equipment'
  | 'other';

export const CATEGORIES: Record<Category, string> = {
  construction: '🧱 Стройматериалы',
  metal: '🔩 Металлопрокат',
  equipment: '⚙️ Оборудование',
  real_estate: '🏢 Недвижимость',
  land: '🌍 Земельные участки',
  raw_materials: '📦 Сырьё',
  wood: '🌲 Лесоматериалы',
  energy: '⚡ Энергоресурсы',
  transport: '🚛 Транспорт',
  special_equipment: '🚜 Спецтехника',
  other: '📦 Другое',
};

export const REGIONS = [
  'Москва',
  'Санкт-Петербург',
  'Московская область',
  'Краснодарский край',
  'Ростовская область',
  'Свердловская область',
  'Татарстан',
  'Новосибирская область',
  'Другой регион',
];

export interface User {
  id: string;
  telegramId: number;
  name: string;
  company?: string;
  phone?: string;
  inn?: string;
  role: 'buyer' | 'seller' | 'both';
  rating: number;
  dealsCount: number;
  verified: boolean;
  createdAt: Date;
}

export interface Request {
  id: string;
  userId: string;
  type: RequestType;
  category: Category;
  title: string;
  description: string;
  volume: string;
  unit: string;
  budget?: number;
  price?: number;
  region: string;
  status: RequestStatus;
  createdAt: Date;
  expiresAt?: Date;
  matchesCount: number;
}

export interface Match {
  id: string;
  requestId: string;
  counterpartyId: string;
  counterpartyRequest?: Request;
  score: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface Deal {
  id: string;
  buyerId: string;
  sellerId: string;
  buyRequestId: string;
  sellRequestId: string;
  amount: number;
  commission: number;
  stage: 'negotiation' | 'contract' | 'payment' | 'delivery' | 'completed' | 'dispute';
  createdAt: Date;
  completedAt?: Date;
}

// Telegram WebApp types
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        BackButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
          start_param?: string;
        };
        colorScheme: 'light' | 'dark';
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          secondary_bg_color?: string;
        };
        showAlert: (message: string) => void;
        showConfirm: (message: string, callback: (ok: boolean) => void) => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
      };
    };
  }
}

export {};

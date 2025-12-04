import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Request, Match, Category, RequestType } from './types';
import { requestsApi, usersApi, matchesApi } from './services/api';
import { isSupabaseConfigured } from './lib/supabase';

// Генерация ID для моковых данных
const generateId = () => Math.random().toString(36).substring(2, 15);

interface AppState {
  // User
  user: User | null;
  setUser: (user: User | null) => void;
  initUser: (telegramUser: any) => Promise<void>;

  // Requests
  requests: Request[];
  myRequests: Request[];
  fetchRequests: (filters?: { type?: RequestType; category?: string; region?: string }) => Promise<void>;
  fetchMyRequests: () => Promise<void>;
  addRequest: (request: Omit<Request, 'id' | 'createdAt' | 'status' | 'matchesCount'>) => Promise<Request | null>;
  updateRequest: (id: string, updates: Partial<Request>) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;

  // Matches
  matches: Match[];
  fetchMatches: (requestId: string) => Promise<void>;
  addMatch: (match: Omit<Match, 'id' | 'createdAt'>) => void;
  updateMatch: (id: string, updates: Partial<Match>) => void;

  // UI State
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // Filters
  filters: {
    category?: Category;
    region?: string;
    type?: RequestType;
  };
  setFilters: (filters: AppState['filters']) => void;
}

// Моковые данные для демо
const mockRequests: Request[] = [
  {
    id: '1',
    userId: 'user1',
    type: 'buy',
    category: 'construction',
    title: 'Цемент М500 оптом',
    description: 'Нужен цемент М500 для строительного объекта в Москве. Доставка на объект.',
    volume: '500',
    unit: 'тонн',
    budget: 2500000,
    region: 'Москва',
    status: 'active',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    matchesCount: 3,
  },
  {
    id: '2',
    userId: 'user2',
    type: 'sell',
    category: 'metal',
    title: 'Арматура А500С ⌀12мм',
    description: 'Продаём арматуру со склада в Подмосковье. Сертификаты в наличии.',
    volume: '200',
    unit: 'тонн',
    price: 65000,
    region: 'Московская область',
    status: 'active',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    matchesCount: 7,
  },
  {
    id: '3',
    userId: 'user3',
    type: 'buy',
    category: 'wood',
    title: 'Доска обрезная 50х150',
    description: 'Ищем поставщика доски обрезной для мебельного производства.',
    volume: '100',
    unit: 'м³',
    budget: 1800000,
    region: 'Краснодарский край',
    status: 'active',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    matchesCount: 2,
  },
  {
    id: '4',
    userId: 'user4',
    type: 'sell',
    category: 'equipment',
    title: 'Экскаватор CAT 320D',
    description: 'Продаём экскаватор 2019 года, наработка 3500 моточасов. Отличное состояние.',
    volume: '1',
    unit: 'шт',
    price: 12000000,
    region: 'Ростовская область',
    status: 'active',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    matchesCount: 5,
  },
  {
    id: '5',
    userId: 'user5',
    type: 'buy',
    category: 'chemicals',
    title: 'Полиэтилен высокого давления',
    description: 'Нужен ПВД для производства плёнки. Регулярные закупки.',
    volume: '50',
    unit: 'тонн/мес',
    budget: 7500000,
    region: 'Татарстан',
    status: 'active',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    matchesCount: 1,
  },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User
      user: null,
      setUser: (user) => set({ user }),

      initUser: async (telegramUser) => {
        if (!isSupabaseConfigured()) {
          // Mock user для разработки
          set({
            user: {
              id: 'mock-user',
              telegramId: telegramUser.id,
              name: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim(),
              role: 'buyer',
              rating: 0,
              dealsCount: 0,
              verified: false,
              createdAt: new Date(),
            },
          });
          return;
        }

        const user = await usersApi.getOrCreate(telegramUser);
        set({ user });
      },

      // Requests
      requests: mockRequests,
      myRequests: [],

      fetchRequests: async (filters) => {
        if (!isSupabaseConfigured()) {
          // Используем моковые данные
          let filtered = mockRequests;
          if (filters?.type) {
            filtered = filtered.filter((r) => r.type === filters.type);
          }
          set({ requests: filtered });
          return;
        }

        set({ isLoading: true });
        try {
          const requests = await requestsApi.getAll(filters);
          set({ requests });
        } catch (error) {
          console.error('Error fetching requests:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      fetchMyRequests: async () => {
        const { user } = get();
        if (!user || !isSupabaseConfigured()) {
          return;
        }

        set({ isLoading: true });
        try {
          const myRequests = await requestsApi.getMy(user.id);
          set({ myRequests });
        } catch (error) {
          console.error('Error fetching my requests:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      addRequest: async (requestData) => {
        const { user } = get();
        if (!user) return null;

        if (!isSupabaseConfigured()) {
          // Mock mode
          const newRequest: Request = {
            ...requestData,
            id: generateId(),
            createdAt: new Date(),
            status: 'active',
            matchesCount: 0,
          };
          set((state) => ({
            requests: [newRequest, ...state.requests],
            myRequests: [newRequest, ...state.myRequests],
          }));
          return newRequest;
        }

        set({ isLoading: true });
        try {
          const newRequest = await requestsApi.create({
            userId: user.id,
            ...requestData,
          });

          if (newRequest) {
            set((state) => ({
              requests: [newRequest, ...state.requests],
              myRequests: [newRequest, ...state.myRequests],
            }));
          }

          return newRequest;
        } catch (error) {
          console.error('Error creating request:', error);
          return null;
        } finally {
          set({ isLoading: false });
        }
      },

      updateRequest: async (id, updates) => {
        if (!isSupabaseConfigured()) {
          set((state) => ({
            requests: state.requests.map((r) => (r.id === id ? { ...r, ...updates } : r)),
            myRequests: state.myRequests.map((r) => (r.id === id ? { ...r, ...updates } : r)),
          }));
          return;
        }

        set({ isLoading: true });
        try {
          const updated = await requestsApi.update(id, updates);
          if (updated) {
            set((state) => ({
              requests: state.requests.map((r) => (r.id === id ? updated : r)),
              myRequests: state.myRequests.map((r) => (r.id === id ? updated : r)),
            }));
          }
        } catch (error) {
          console.error('Error updating request:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      deleteRequest: async (id) => {
        if (!isSupabaseConfigured()) {
          set((state) => ({
            requests: state.requests.filter((r) => r.id !== id),
            myRequests: state.myRequests.filter((r) => r.id !== id),
          }));
          return;
        }

        set({ isLoading: true });
        try {
          const success = await requestsApi.delete(id);
          if (success) {
            set((state) => ({
              requests: state.requests.filter((r) => r.id !== id),
              myRequests: state.myRequests.filter((r) => r.id !== id),
            }));
          }
        } catch (error) {
          console.error('Error deleting request:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      // Matches
      matches: [],

      fetchMatches: async (requestId) => {
        if (!isSupabaseConfigured()) return;

        set({ isLoading: true });
        try {
          const matches = await matchesApi.getForRequest(requestId);
          set({ matches });
        } catch (error) {
          console.error('Error fetching matches:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      addMatch: (matchData) => {
        const newMatch: Match = {
          ...matchData,
          id: generateId(),
          createdAt: new Date(),
        };
        set((state) => ({ matches: [...state.matches, newMatch] }));
      },

      updateMatch: (id, updates) => {
        set((state) => ({
          matches: state.matches.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        }));
      },

      // UI
      isLoading: false,
      setLoading: (isLoading) => set({ isLoading }),

      // Filters
      filters: {},
      setFilters: (filters) => set({ filters }),
    }),
    {
      name: 'commerce-storage',
      partialize: (state) => ({
        user: state.user,
        myRequests: state.myRequests,
      }),
    }
  )
);

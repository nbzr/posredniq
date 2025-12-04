# COMMERCE Mini App MVP

Telegram Mini App для B2B промышленной коммерции.

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
cd commerce-app
npm install
```

### 2. Локальная разработка
```bash
npm run dev
```
Откройте http://localhost:3000

### 3. Сборка для продакшена
```bash
npm run build
```

## 📱 Деплой в Telegram

### Вариант 1: Vercel (рекомендуется)
```bash
# Установите Vercel CLI
npm i -g vercel

# Деплой
vercel --prod
```

После деплоя получите URL вида: `https://commerce-app.vercel.app`

### Вариант 2: Netlify
```bash
npm run build
# Загрузите папку dist на netlify.com
```

### Вариант 3: GitHub Pages
```bash
# В vite.config.ts установите base: '/commerce-app/'
npm run build
# Пушните dist в gh-pages ветку
```

## 🤖 Настройка Telegram Bot

1. Создайте бота через @BotFather
2. Получите токен бота
3. Настройте Mini App:
   - Отправьте `/newapp` в @BotFather
   - Выберите своего бота
   - Укажите URL деплоя
   - Укажите название: COMMERCE

4. Настройте меню бота:
```
/setmenubutton
# Выберите бота
# Web App
# URL: https://your-app-url.vercel.app
# Текст: 🏢 Открыть COMMERCE
```

## 📂 Структура проекта

```
commerce-app/
├── src/
│   ├── components/        # UI компоненты
│   │   ├── BottomNav.tsx
│   │   └── RequestCard.tsx
│   ├── pages/             # Страницы
│   │   ├── HomePage.tsx
│   │   ├── NewRequestPage.tsx
│   │   ├── MyRequestsPage.tsx
│   │   └── ProfilePage.tsx
│   ├── hooks/             # React хуки
│   │   ├── useTelegram.ts
│   │   └── index.ts
│   ├── lib/               # Библиотеки
│   │   └── supabase.ts    # Supabase клиент
│   ├── services/          # API сервисы
│   │   └── api.ts         # Работа с данными
│   ├── types/             # TypeScript типы
│   │   ├── index.ts       # Основные типы
│   │   └── database.ts    # Типы БД
│   ├── store.ts           # Zustand store
│   ├── App.tsx            # Главный компонент
│   └── main.tsx           # Точка входа
├── .env.local.example     # Пример конфигурации
├── SUPABASE_SETUP.md      # Инструкция по Supabase
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🗄️ База данных (Supabase)

📖 **Полная инструкция по настройке**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### Быстрая настройка:

1. Создай проект на [supabase.com](https://supabase.com)
2. Запусти SQL схему (`../../commerce-database-schema.sql`)
3. Создай `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=твой-anon-key
   ```

**Без Supabase**: приложение работает с моковыми данными локально.

## ✅ Готово

### v0.2 - Backend
- ✅ Supabase / PostgreSQL база данных
- ✅ API endpoints для CRUD заявок
- ✅ Интеграция с Telegram WebApp API
- ✅ State management с Zustand
- ✅ TypeScript типы для БД

## 🔄 Следующие итерации

### v0.3 - Матчинг
- [ ] Алгоритм автоматического матчинга
- [ ] Push-уведомления о матчах
- [ ] Чат между контрагентами

### v0.4 - Платежи
- [ ] Интеграция YooKassa для эскроу
- [ ] Комиссия 3% с успешных сделок
- [ ] История транзакций

### v0.5 - Верификация
- [ ] KYC через партнёра
- [ ] Проверка ИНН/ОГРН
- [ ] Рейтинговая система

## 🛠 Технологии

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Build**: Vite
- **Icons**: Lucide React

## 📞 Контакты

По вопросам разработки: @your_telegram

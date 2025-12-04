# Настройка Supabase для COMMERCE Mini App

## Шаг 1: Создание проекта в Supabase

1. Перейди на [supabase.com](https://supabase.com)
2. Создай аккаунт или войди
3. Нажми "New Project"
4. Заполни:
   - **Project Name**: `commerce-mvp`
   - **Database Password**: создай надёжный пароль
   - **Region**: `Central EU` (ближайший регион)
5. Нажми "Create new project" (подожди 1-2 минуты)

## Шаг 2: Настройка базы данных

1. В боковом меню выбери **SQL Editor**
2. Нажми **+ New Query**
3. Скопируй содержимое файла `commerce-database-schema.sql` (из корня проекта)
4. Вставь в SQL Editor
5. Нажми **Run** (▶️)
6. Убедись, что все команды выполнились успешно (зелёные галочки)

## Шаг 3: Настройка Row Level Security (RLS)

Для безопасности данных настрой политики доступа:

```sql
-- Политики для таблицы users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid()::text = id);

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid()::text = id);

-- Политики для таблицы requests
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active requests"
  ON requests FOR SELECT
  USING (status = 'active');

CREATE POLICY "Users can create requests"
  ON requests FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own requests"
  ON requests FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own requests"
  ON requests FOR DELETE
  USING (auth.uid()::text = user_id);

-- Политики для таблицы matches
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their matches"
  ON matches FOR SELECT
  USING (
    auth.uid()::text IN (
      SELECT user_id FROM requests WHERE id = request_id
    )
  );

-- Политики для таблицы deals
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their deals"
  ON deals FOR SELECT
  USING (
    auth.uid()::text = buyer_id OR
    auth.uid()::text = seller_id
  );
```

Запусти этот SQL в **SQL Editor**.

## Шаг 4: Получение API ключей

1. В боковом меню выбери **Settings** → **API**
2. Найди секцию **Project API keys**
3. Скопируй:
   - **Project URL** (например: `https://xxxxx.supabase.co`)
   - **anon / public key** (длинный JWT токен)

## Шаг 5: Настройка проекта

1. В папке `app/commerce-app` создай файл `.env.local`:

```bash
cd app/commerce-app
cp .env.local.example .env.local
```

2. Открой `.env.local` и вставь свои ключи:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=твой-anon-key
```

## Шаг 6: Установка зависимостей

```bash
cd app/commerce-app
npm install
```

Если будет ошибка с правами npm:
```bash
sudo chown -R $(whoami) ~/.npm
npm install
```

## Шаг 7: Запуск приложения

```bash
npm run dev
```

Приложение откроется на `http://localhost:5173`

## Проверка интеграции

1. Открой DevTools (F12) → Console
2. Ты НЕ должен видеть предупреждение: `Supabase credentials not found`
3. Создай тестовую заявку через интерфейс
4. Проверь в Supabase Dashboard → **Table Editor** → **requests**, что заявка появилась

## Режим разработки без Supabase

Если не настроил `.env.local`, приложение работает с моковыми данными:
- Показывает тестовые заявки
- Можно создавать заявки (сохраняются локально)
- Идеально для тестирования UI

## Полезные ссылки

- [Supabase Dashboard](https://app.supabase.com)
- [Документация Supabase](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)

## Troubleshooting

### Ошибка CORS
Убедись, что в Supabase Dashboard → **Settings** → **API** → **URL Configuration** добавлен:
- `http://localhost:5173`
- Твой production URL

### Ошибки RLS
Если данные не загружаются, проверь политики RLS:
```sql
SELECT * FROM pg_policies WHERE tablename = 'requests';
```

### Медленные запросы
Проверь индексы в таблицах. Они должны быть созданы автоматически из schema.sql.

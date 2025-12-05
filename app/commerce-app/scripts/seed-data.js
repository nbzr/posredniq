import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bewdkakivehvedabkjxf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJld2RrYWtpdmVodmVkYWJranhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MDI2MDUsImV4cCI6MjA4MDM3ODYwNX0.Alg4Ud4wMhLLSHFW6oO8_aQZK5tOiowQXpH40QO5JBc';

const supabase = createClient(supabaseUrl, supabaseKey);

const testUsers = [
  {
    telegram_id: 111111,
    first_name: 'Тест',
    last_name: 'Пользователь 1',
    company_name: 'ООО "Тестовая компания"',
    company_inn: '1234567890',
    phone: '+7 (999) 111-11-11',
    is_verified: true,
  },
  {
    telegram_id: 222222,
    first_name: 'Тест',
    last_name: 'Пользователь 2',
    company_name: 'ИП Тестов',
    company_inn: '2345678901',
    phone: '+7 (999) 222-22-22',
    is_verified: false,
  },
  {
    telegram_id: 333333,
    first_name: 'Тест',
    last_name: 'Пользователь 3',
    company_name: 'ООО "Стройтест"',
    company_inn: '3456789012',
    phone: '+7 (999) 333-33-33',
    is_verified: true,
  },
  {
    telegram_id: 444444,
    first_name: 'Тест',
    last_name: 'Пользователь 4',
    company_name: 'Тестовая логистика',
    company_inn: '4567890123',
    phone: '+7 (999) 444-44-44',
    is_verified: true,
  },
  {
    telegram_id: 555555,
    first_name: 'Тест',
    last_name: 'Пользователь 5',
    company_name: 'ООО "Продтест"',
    company_inn: '5678901234',
    phone: '+7 (999) 555-55-55',
    is_verified: false,
  },
];

const testRequests = [
  {
    title: '(ТЕСТ) Куплю кирпич строительный',
    description: 'Тестовая заявка на покупку строительного кирпича. Требуется для строительства объекта.',
    type: 'buy',
    category_slug: 'stroymaterialy',
    region_code: 'MSK',
    budget_min: 400000,
    budget_max: 500000,
    volume: '10000',
    unit: 'шт',
  },
  {
    title: '(ТЕСТ) Продаю металлопрокат',
    description: 'Тестовая заявка на продажу металлопроката. В наличии различные типоразмеры.',
    type: 'sell',
    category_slug: 'metalloprokat',
    region_code: 'SPB',
    budget_min: 40000,
    budget_max: 50000,
    volume: '50',
    unit: 'тонн',
  },
  {
    title: '(ТЕСТ) Куплю оборудование промышленное',
    description: 'Тестовая заявка. Нужно промышленное оборудование для производства.',
    type: 'buy',
    category_slug: 'oborudovanie',
    region_code: 'KZN',
    budget_min: 250000,
    budget_max: 300000,
    volume: '1',
    unit: 'комплект',
  },
  {
    title: '(ТЕСТ) Продаю спецтехнику',
    description: 'Тестовая заявка. Распродажа спецтехники после завершения проекта.',
    type: 'sell',
    category_slug: 'spectehnika',
    region_code: 'MSK',
    budget_min: 120000,
    budget_max: 150000,
    volume: '3',
    unit: 'шт',
  },
  {
    title: '(ТЕСТ) Куплю сырьё для производства',
    description: 'Тестовая заявка на закупку сырья для производственных нужд.',
    type: 'buy',
    category_slug: 'syryo',
    region_code: 'NSK',
    budget_min: 800000,
    budget_max: 1000000,
    volume: '5',
    unit: 'тонн',
  },
  {
    title: '(ТЕСТ) Продаю транспортные услуги',
    description: 'Тестовая заявка. Грузоперевозки по всей России.',
    type: 'sell',
    category_slug: 'transport',
    region_code: 'EKB',
    budget_min: 45000,
    budget_max: 55000,
    volume: '1',
    unit: 'рейс',
  },
  {
    title: '(ТЕСТ) Куплю энергоресурсы',
    description: 'Тестовая заявка. Требуются энергоресурсы для промышленного объекта.',
    type: 'buy',
    category_slug: 'energo',
    region_code: 'RND',
    budget_min: 1800000,
    budget_max: 2000000,
    volume: '1000',
    unit: 'кВт',
  },
  {
    title: '(ТЕСТ) Продаю лесоматериалы',
    description: 'Тестовая заявка. Лесоматериалы высокого качества в наличии.',
    type: 'sell',
    category_slug: 'les',
    region_code: 'KRD',
    budget_min: 70000,
    budget_max: 85000,
    volume: '100',
    unit: 'м³',
  },
  {
    title: '(ТЕСТ) Куплю недвижимость',
    description: 'Тестовая заявка на покупку коммерческой недвижимости.',
    type: 'buy',
    category_slug: 'nedvizhimost',
    region_code: 'NN',
    budget_min: 35000000,
    budget_max: 40000000,
    volume: '500',
    unit: 'м²',
  },
  {
    title: '(ТЕСТ) Продаю земельный участок',
    description: 'Тестовая заявка. Земельный участок под коммерческое строительство.',
    type: 'sell',
    category_slug: 'zemlya',
    region_code: 'MO',
    budget_min: 8000000,
    budget_max: 10000000,
    volume: '2',
    unit: 'га',
  },
];

async function seedDatabase() {
  console.log('🌱 Начинаем засев базы данных тестовыми данными...\n');

  // Получаем категории и регионы
  console.log('📋 Загружаем справочники...');
  const { data: categories } = await supabase.from('categories').select('id, slug');
  const { data: regions } = await supabase.from('regions').select('id, code');

  const categoryMap = {};
  const regionMap = {};

  if (categories) {
    categories.forEach(cat => categoryMap[cat.slug] = cat.id);
    console.log(`✅ Загружено категорий: ${categories.length}`);
  }

  if (regions) {
    regions.forEach(reg => regionMap[reg.code] = reg.id);
    console.log(`✅ Загружено регионов: ${regions.length}`);
  }

  // Создаем или получаем пользователей
  console.log('\n👥 Создаем/получаем тестовых пользователей...');
  const createdUsers = [];

  for (const user of testUsers) {
    // Сначала пытаемся получить существующего
    let { data: existingUser } = await supabase
      .from('users')
      .select()
      .eq('telegram_id', user.telegram_id)
      .single();

    if (existingUser) {
      console.log(`ℹ️  Пользователь уже существует: ${existingUser.first_name} ${existingUser.last_name}`);
      createdUsers.push(existingUser);
    } else {
      // Если нет - создаем
      const { data, error } = await supabase
        .from('users')
        .insert(user)
        .select()
        .single();

      if (error) {
        console.log(`❌ Ошибка создания пользователя ${user.first_name} ${user.last_name}:`, error.message);
      } else {
        console.log(`✅ Создан пользователь: ${data.first_name} ${data.last_name}`);
        createdUsers.push(data);
      }
    }
  }

  console.log(`\n📦 Создаем тестовые заявки...`);

  // Создаем заявки, распределяя их между пользователями
  for (let i = 0; i < testRequests.length; i++) {
    const request = testRequests[i];
    const user = createdUsers[i % createdUsers.length]; // Распределяем по кругу

    if (user) {
      // Конвертируем slug в ID
      const requestData = {
        title: request.title,
        description: request.description,
        type: request.type,
        category_id: categoryMap[request.category_slug],
        region_id: regionMap[request.region_code],
        budget_min: request.budget_min,
        budget_max: request.budget_max,
        volume: request.volume,
        unit: request.unit,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('requests')
        .insert(requestData)
        .select()
        .single();

      if (error) {
        console.log(`❌ Ошибка создания заявки "${request.title}":`, error.message);
      } else {
        console.log(`✅ Создана заявка: ${data.title} (${data.type === 'buy' ? '🛒 Покупка' : '📦 Продажа'})`);
      }
    }
  }

  console.log('\n🎉 Засев завершен! База данных наполнена тестовыми данными.');
  console.log(`\n📊 Статистика:`);
  console.log(`   - Пользователей: ${createdUsers.length}`);
  console.log(`   - Заявок: ${testRequests.length}`);
}

seedDatabase().catch(console.error);

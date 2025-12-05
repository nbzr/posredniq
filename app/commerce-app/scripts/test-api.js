import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bewdkakivehvedabkjxf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJld2RrYWtpdmVodmVkYWJranhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MDI2MDUsImV4cCI6MjA4MDM3ODYwNX0.Alg4Ud4wMhLLSHFW6oO8_aQZK5tOiowQXpH40QO5JBc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAPI() {
  console.log('🔍 Тестируем API как это делает приложение...\n');

  // Точно так же как в приложении
  let query = supabase
    .from('v_active_requests')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.log('❌ Ошибка получения данных:', error);
    console.log('\nПолный объект ошибки:', JSON.stringify(error, null, 2));
  } else {
    console.log(`✅ Получено заявок: ${data?.length || 0}`);
    if (data && data.length > 0) {
      console.log('\n📋 Первая заявка:');
      console.log(JSON.stringify(data[0], null, 2));

      console.log('\n📋 Все заявки:');
      data.forEach((req, i) => {
        console.log(`${i + 1}. ${req.title} (${req.type}, category_id: ${req.category_id})`);
      });
    } else {
      console.log('\n⚠️  Массив данных пустой!');
      console.log('Возможные причины:');
      console.log('- Заявки не имеют status = "active"');
      console.log('- View v_active_requests не работает');
      console.log('- RLS политики блокируют доступ');
    }
  }
}

testAPI().catch(console.error);

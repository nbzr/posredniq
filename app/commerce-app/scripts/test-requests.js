import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bewdkakivehvedabkjxf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJld2RrYWtpdmVodmVkYWJranhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MDI2MDUsImV4cCI6MjA4MDM3ODYwNX0.Alg4Ud4wMhLLSHFW6oO8_aQZK5tOiowQXpH40QO5JBc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRequests() {
  console.log('🔍 Проверяем заявки в базе данных...\n');

  // Проверяем прямо из таблицы requests
  console.log('📦 Запрос из таблицы requests:');
  const { data: requests, error: reqError } = await supabase
    .from('requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (reqError) {
    console.log('❌ Ошибка:', reqError.message);
  } else {
    console.log(`✅ Найдено заявок: ${requests.length}`);
    requests.forEach(req => {
      console.log(`   - ${req.title} (${req.type})`);
    });
  }

  // Проверяем через view
  console.log('\n📊 Запрос из view v_active_requests:');
  const { data: viewData, error: viewError } = await supabase
    .from('v_active_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (viewError) {
    console.log('❌ Ошибка:', viewError.message);
    console.log('   View может не существовать или нужно его создать');
  } else {
    console.log(`✅ Найдено заявок через view: ${viewData.length}`);
    viewData.forEach(req => {
      console.log(`   - ${req.title} (${req.type})`);
    });
  }
}

testRequests().catch(console.error);

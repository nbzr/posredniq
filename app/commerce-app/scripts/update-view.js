import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = 'https://bewdkakivehvedabkjxf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJld2RrYWtpdmVodmVkYWJranhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDgwMjYwNSwiZXhwIjoyMDgwMzc4NjA1fQ.yipRaZM-qYD5e5iqXUYYQCnlF6xzPBp0McmdPrq2EF8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateView() {
  console.log('🔄 Обновляем view v_active_requests...\n');

  const sql = readFileSync('scripts/update-view.sql', 'utf8');

  const { error } = await supabase.rpc('exec_sql', { query: sql });

  if (error) {
    console.log('❌ Ошибка:', error.message);
    console.log('\nПопробуй выполнить SQL вручную через Supabase Dashboard:');
    console.log('https://supabase.com/dashboard → SQL Editor');
  } else {
    console.log('✅ View обновлен успешно!');
  }
}

updateView().catch(console.error);

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bewdkakivehvedabkjxf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJld2RrYWtpdmVodmVkYWJranhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MDI2MDUsImV4cCI6MjA4MDM3ODYwNX0.Alg4Ud4wMhLLSHFW6oO8_aQZK5tOiowQXpH40QO5JBc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkView() {
  const { data, error } = await supabase
    .from('v_active_requests')
    .select('*')
    .limit(1);

  if (error) {
    console.log('❌ Ошибка:', error);
  } else if (data && data.length > 0) {
    console.log('📋 Структура данных из v_active_requests:');
    console.log(JSON.stringify(data[0], null, 2));
  }
}

checkView();

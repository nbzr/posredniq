import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bewdkakivehvedabkjxf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJld2RrYWtpdmVodmVkYWJranhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDgwMjYwNSwiZXhwIjoyMDgwMzc4NjA1fQ.yipRaZM-qYD5e5iqXUYYQCnlF6xzPBp0McmdPrq2EF8';

const supabase = createClient(supabaseUrl, supabaseKey);

const categoryUpdates = [
  { old: 'stroymaterialy', new: 'construction' },
  { old: 'metalloprokat', new: 'metal' },
  { old: 'oborudovanie', new: 'equipment' },
  { old: 'nedvizhimost', new: 'real_estate' },
  { old: 'zemlya', new: 'land' },
  { old: 'syryo', new: 'raw_materials' },
  { old: 'les', new: 'wood' },
  { old: 'energo', new: 'energy' },
  { old: 'transport', new: 'transport' },
  { old: 'spectehnika', new: 'special_equipment' },
];

async function updateCategories() {
  console.log('🔄 Обновляем slug категорий на английские...\n');

  for (const update of categoryUpdates) {
    const { data, error } = await supabase
      .from('categories')
      .update({ slug: update.new })
      .eq('slug', update.old)
      .select();

    if (error) {
      console.log(`❌ Ошибка обновления ${update.old} -> ${update.new}:`, error.message);
    } else if (data && data.length > 0) {
      console.log(`✅ Обновлено: ${update.old} -> ${update.new}`);
    } else {
      console.log(`ℹ️  Не найдено: ${update.old}`);
    }
  }

  console.log('\n🎉 Обновление завершено!');
}

updateCategories().catch(console.error);

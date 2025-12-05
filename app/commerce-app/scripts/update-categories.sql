-- Обновляем slug категорий на английские
UPDATE categories SET slug = 'construction' WHERE slug = 'stroymaterialy';
UPDATE categories SET slug = 'metal' WHERE slug = 'metalloprokat';
UPDATE categories SET slug = 'equipment' WHERE slug = 'oborudovanie';
UPDATE categories SET slug = 'real_estate' WHERE slug = 'nedvizhimost';
UPDATE categories SET slug = 'land' WHERE slug = 'zemlya';
UPDATE categories SET slug = 'raw_materials' WHERE slug = 'syryo';
UPDATE categories SET slug = 'wood' WHERE slug = 'les';
UPDATE categories SET slug = 'energy' WHERE slug = 'energo';
UPDATE categories SET slug = 'transport' WHERE slug = 'transport';
UPDATE categories SET slug = 'special_equipment' WHERE slug = 'spectehnika';

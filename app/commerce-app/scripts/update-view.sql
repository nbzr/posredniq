-- Обновляем view чтобы включал category_slug
CREATE OR REPLACE VIEW v_active_requests AS
SELECT
    r.*,
    u.first_name || ' ' || COALESCE(u.last_name, '') as user_name,
    u.company_name,
    u.rating as user_rating,
    u.is_verified as user_verified,
    c.name as category_name,
    c.slug as category_slug,
    c.icon as category_icon,
    reg.name as region_name
FROM requests r
JOIN users u ON r.user_id = u.id
LEFT JOIN categories c ON r.category_id = c.id
LEFT JOIN regions reg ON r.region_id = reg.id
WHERE r.status = 'active';

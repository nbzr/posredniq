-- COMMERCE MVP Database Schema
-- PostgreSQL 15+

-- =====================================================
-- EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- для fuzzy search

-- =====================================================
-- ENUM TYPES
-- =====================================================
CREATE TYPE request_type AS ENUM ('buy', 'sell');
CREATE TYPE request_status AS ENUM ('active', 'matched', 'negotiating', 'deal', 'completed', 'cancelled');
CREATE TYPE deal_stage AS ENUM ('negotiation', 'documents', 'payment', 'escrow', 'delivery', 'completed', 'cancelled');
CREATE TYPE user_role AS ENUM ('user', 'agent', 'admin');

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    telegram_id BIGINT UNIQUE NOT NULL,
    telegram_username VARCHAR(255),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    company_name VARCHAR(255),
    company_inn VARCHAR(20),
    role user_role DEFAULT 'user',
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_deals INTEGER DEFAULT 0,
    successful_deals INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP,
    is_premium BOOLEAN DEFAULT FALSE,
    premium_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_verified ON users(is_verified);

-- =====================================================
-- CATEGORIES TABLE
-- =====================================================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    parent_id INTEGER REFERENCES categories(id),
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO categories (name, slug, icon, sort_order) VALUES
    ('Стройматериалы', 'stroymaterialy', '🧱', 1),
    ('Металлопрокат', 'metalloprokat', '🔩', 2),
    ('Оборудование', 'oborudovanie', '⚙️', 3),
    ('Недвижимость', 'nedvizhimost', '🏢', 4),
    ('Земельные участки', 'zemlya', '🌍', 5),
    ('Сырьё', 'syryo', '📦', 6),
    ('Лесоматериалы', 'les', '🌲', 7),
    ('Энергоресурсы', 'energo', '⚡', 8),
    ('Транспорт', 'transport', '🚛', 9),
    ('Спецтехника', 'spectehnika', '🚜', 10);

-- =====================================================
-- REGIONS TABLE
-- =====================================================
CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE,
    country VARCHAR(100) DEFAULT 'Россия',
    timezone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE
);

INSERT INTO regions (name, code) VALUES
    ('Москва', 'MSK'),
    ('Московская область', 'MO'),
    ('Санкт-Петербург', 'SPB'),
    ('Ленинградская область', 'LO'),
    ('Екатеринбург', 'EKB'),
    ('Новосибирск', 'NSK'),
    ('Краснодар', 'KRD'),
    ('Казань', 'KZN'),
    ('Нижний Новгород', 'NN'),
    ('Ростов-на-Дону', 'RND');

-- =====================================================
-- REQUESTS TABLE
-- =====================================================
CREATE TABLE requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type request_type NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    volume VARCHAR(255),
    unit VARCHAR(50),
    budget_min DECIMAL(15,2),
    budget_max DECIMAL(15,2),
    currency VARCHAR(10) DEFAULT 'RUB',
    region_id INTEGER REFERENCES regions(id),
    delivery_address TEXT,
    deadline DATE,
    status request_status DEFAULT 'active',
    match_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    is_boosted BOOLEAN DEFAULT FALSE,
    boosted_until TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_requests_user ON requests(user_id);
CREATE INDEX idx_requests_type ON requests(type);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_category ON requests(category_id);
CREATE INDEX idx_requests_region ON requests(region_id);
CREATE INDEX idx_requests_created ON requests(created_at DESC);
CREATE INDEX idx_requests_active ON requests(status) WHERE status = 'active';

-- Full-text search
CREATE INDEX idx_requests_title_trgm ON requests USING gin(title gin_trgm_ops);

-- =====================================================
-- MATCHES TABLE
-- =====================================================
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    counterparty_request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    score DECIMAL(5,2) NOT NULL,  -- 0.00 to 100.00
    category_score DECIMAL(5,2),
    region_score DECIMAL(5,2),
    budget_score DECIMAL(5,2),
    rating_score DECIMAL(5,2),
    is_viewed BOOLEAN DEFAULT FALSE,
    viewed_at TIMESTAMP,
    is_contacted BOOLEAN DEFAULT FALSE,
    contacted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT unique_match UNIQUE (request_id, counterparty_request_id)
);

CREATE INDEX idx_matches_request ON matches(request_id);
CREATE INDEX idx_matches_counterparty ON matches(counterparty_request_id);
CREATE INDEX idx_matches_score ON matches(score DESC);

-- =====================================================
-- DEALS TABLE
-- =====================================================
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_number VARCHAR(50) UNIQUE NOT NULL,
    buyer_id UUID NOT NULL REFERENCES users(id),
    seller_id UUID NOT NULL REFERENCES users(id),
    buyer_request_id UUID REFERENCES requests(id),
    seller_request_id UUID REFERENCES requests(id),
    match_id UUID REFERENCES matches(id),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'RUB',
    commission_rate DECIMAL(5,4) DEFAULT 0.0300,  -- 3%
    commission_amount DECIMAL(15,2),
    stage deal_stage DEFAULT 'negotiation',
    progress INTEGER DEFAULT 0,  -- 0-100%
    escrow_id VARCHAR(255),
    escrow_status VARCHAR(50),
    contract_url TEXT,
    delivery_tracking TEXT,
    notes TEXT,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancel_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_deals_buyer ON deals(buyer_id);
CREATE INDEX idx_deals_seller ON deals(seller_id);
CREATE INDEX idx_deals_stage ON deals(stage);
CREATE INDEX idx_deals_created ON deals(created_at DESC);

-- =====================================================
-- DEAL EVENTS (AUDIT LOG)
-- =====================================================
CREATE TABLE deal_events (
    id SERIAL PRIMARY KEY,
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    description TEXT,
    metadata JSONB,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_deal_events_deal ON deal_events(deal_id);
CREATE INDEX idx_deal_events_created ON deal_events(created_at DESC);

-- =====================================================
-- REVIEWS TABLE
-- =====================================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID NOT NULL REFERENCES deals(id),
    reviewer_id UUID NOT NULL REFERENCES users(id),
    reviewed_user_id UUID NOT NULL REFERENCES users(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT unique_review UNIQUE (deal_id, reviewer_id)
);

CREATE INDEX idx_reviews_user ON reviews(reviewed_user_id);
CREATE INDEX idx_reviews_deal ON reviews(deal_id);

-- =====================================================
-- MESSAGES TABLE (for in-app chat)
-- =====================================================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    recipient_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_deal ON messages(deal_id);
CREATE INDEX idx_messages_match ON messages(match_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_unread ON messages(recipient_id) WHERE is_read = FALSE;

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    is_sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE is_read = FALSE;

-- =====================================================
-- PAYMENTS TABLE
-- =====================================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID NOT NULL REFERENCES deals(id),
    payer_id UUID NOT NULL REFERENCES users(id),
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'RUB',
    type VARCHAR(50) NOT NULL,  -- escrow_deposit, escrow_release, commission, refund
    status VARCHAR(50) DEFAULT 'pending',
    provider VARCHAR(50),  -- yookassa, stripe
    provider_payment_id VARCHAR(255),
    provider_data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_deal ON payments(deal_id);
CREATE INDEX idx_payments_payer ON payments(payer_id);
CREATE INDEX idx_payments_status ON payments(status);

-- =====================================================
-- ANALYTICS TABLE
-- =====================================================
CREATE TABLE analytics_events (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    event_name VARCHAR(100) NOT NULL,
    event_data JSONB,
    session_id VARCHAR(100),
    device_info JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analytics_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_event ON analytics_events(event_name);
CREATE INDEX idx_analytics_created ON analytics_events(created_at DESC);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_requests_updated_at
    BEFORE UPDATE ON requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_deals_updated_at
    BEFORE UPDATE ON deals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Calculate commission amount
CREATE OR REPLACE FUNCTION calculate_commission()
RETURNS TRIGGER AS $$
BEGIN
    NEW.commission_amount = NEW.amount * NEW.commission_rate;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_deal_commission
    BEFORE INSERT OR UPDATE OF amount, commission_rate ON deals
    FOR EACH ROW EXECUTE FUNCTION calculate_commission();

-- Update user rating after review
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users
    SET rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM reviews
        WHERE reviewed_user_id = NEW.reviewed_user_id
    )
    WHERE id = NEW.reviewed_user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_after_review
    AFTER INSERT ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_user_rating();

-- Generate deal number
CREATE OR REPLACE FUNCTION generate_deal_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.deal_number = 'D' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                      LPAD(CAST((SELECT COUNT(*) + 1 FROM deals WHERE DATE(created_at) = CURRENT_DATE) AS TEXT), 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_deal_number
    BEFORE INSERT ON deals
    FOR EACH ROW EXECUTE FUNCTION generate_deal_number();

-- =====================================================
-- VIEWS
-- =====================================================

-- Active requests with user info
CREATE VIEW v_active_requests AS
SELECT 
    r.*,
    u.first_name || ' ' || COALESCE(u.last_name, '') as user_name,
    u.company_name,
    u.rating as user_rating,
    u.is_verified as user_verified,
    c.name as category_name,
    c.icon as category_icon,
    reg.name as region_name
FROM requests r
JOIN users u ON r.user_id = u.id
LEFT JOIN categories c ON r.category_id = c.id
LEFT JOIN regions reg ON r.region_id = reg.id
WHERE r.status = 'active';

-- Deal dashboard view
CREATE VIEW v_deals_dashboard AS
SELECT 
    d.*,
    b.first_name || ' ' || COALESCE(b.last_name, '') as buyer_name,
    b.company_name as buyer_company,
    s.first_name || ' ' || COALESCE(s.last_name, '') as seller_name,
    s.company_name as seller_company
FROM deals d
JOIN users b ON d.buyer_id = b.id
JOIN users s ON d.seller_id = s.id;

-- =====================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert test user
INSERT INTO users (telegram_id, first_name, last_name, company_name, role, is_verified) VALUES
    (123456789, 'Эдуард', 'Тестов', 'ООО Коммерс', 'admin', true);

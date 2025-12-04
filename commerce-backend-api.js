// COMMERCE MVP - Backend API
// Node.js + Express + PostgreSQL

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const { Telegraf } = require('telegraf');

// =====================================================
// CONFIGURATION
// =====================================================
const config = {
  port: process.env.PORT || 3000,
  database: {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    webAppUrl: process.env.WEB_APP_URL
  },
  commission: {
    rate: 0.03  // 3%
  }
};

// =====================================================
// DATABASE CONNECTION
// =====================================================
const pool = new Pool(config.database);

// =====================================================
// EXPRESS APP
// =====================================================
const app = express();
app.use(cors());
app.use(express.json());

// =====================================================
// TELEGRAM BOT
// =====================================================
const bot = new Telegraf(config.telegram.botToken);

// Start command
bot.start(async (ctx) => {
  const user = ctx.from;
  
  // Upsert user
  await pool.query(`
    INSERT INTO users (telegram_id, telegram_username, first_name, last_name)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (telegram_id) DO UPDATE SET
      telegram_username = EXCLUDED.telegram_username,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      updated_at = NOW()
  `, [user.id, user.username, user.first_name, user.last_name]);

  await ctx.reply(
    `👋 Добро пожаловать в COMMERCE, ${user.first_name}!\n\n` +
    `Мы монетизируем ваши связи — помогаем находить контрагентов и закрывать сделки в B2B.\n\n` +
    `🛒 Хотите купить — найдём поставщика\n` +
    `📦 Хотите продать — найдём покупателя\n` +
    `💰 Комиссия 3% только с успешной сделки`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🚀 Открыть приложение', web_app: { url: config.telegram.webAppUrl } }],
          [{ text: '📝 Создать заявку', callback_data: 'new_request' }],
          [{ text: '📊 Мои заявки', callback_data: 'my_requests' }]
        ]
      }
    }
  );
});

// Callback handlers
bot.action('new_request', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('Выберите тип заявки:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🛒 Хочу купить', callback_data: 'request_buy' }],
        [{ text: '📦 Хочу продать', callback_data: 'request_sell' }]
      ]
    }
  });
});

bot.action(['request_buy', 'request_sell'], async (ctx) => {
  await ctx.answerCbQuery();
  const type = ctx.callbackQuery.data === 'request_buy' ? 'buy' : 'sell';
  await ctx.reply(
    `Отлично! Для создания заявки на ${type === 'buy' ? 'покупку' : 'продажу'} откройте приложение:`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🚀 Создать заявку', web_app: { url: `${config.telegram.webAppUrl}?action=new&type=${type}` } }]
        ]
      }
    }
  );
});

// =====================================================
// API ROUTES
// =====================================================

// Middleware: Auth via Telegram WebApp
const authMiddleware = async (req, res, next) => {
  const telegramId = req.headers['x-telegram-user-id'];
  if (!telegramId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const result = await pool.query(
    'SELECT * FROM users WHERE telegram_id = $1',
    [telegramId]
  );
  
  if (result.rows.length === 0) {
    return res.status(401).json({ error: 'User not found' });
  }
  
  req.user = result.rows[0];
  next();
};

// =====================================================
// USERS
// =====================================================
app.get('/api/users/me', authMiddleware, async (req, res) => {
  res.json(req.user);
});

app.put('/api/users/me', authMiddleware, async (req, res) => {
  const { phone, email, company_name, company_inn } = req.body;
  
  const result = await pool.query(`
    UPDATE users SET
      phone = COALESCE($1, phone),
      email = COALESCE($2, email),
      company_name = COALESCE($3, company_name),
      company_inn = COALESCE($4, company_inn),
      updated_at = NOW()
    WHERE id = $5
    RETURNING *
  `, [phone, email, company_name, company_inn, req.user.id]);
  
  res.json(result.rows[0]);
});

// =====================================================
// CATEGORIES
// =====================================================
app.get('/api/categories', async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM categories WHERE is_active = true ORDER BY sort_order'
  );
  res.json(result.rows);
});

// =====================================================
// REGIONS
// =====================================================
app.get('/api/regions', async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM regions WHERE is_active = true ORDER BY name'
  );
  res.json(result.rows);
});

// =====================================================
// REQUESTS
// =====================================================

// Get all requests (with filters)
app.get('/api/requests', authMiddleware, async (req, res) => {
  const { type, category_id, region_id, status, limit = 20, offset = 0 } = req.query;
  
  let query = `
    SELECT r.*, 
           c.name as category_name, c.icon as category_icon,
           reg.name as region_name,
           u.first_name || ' ' || COALESCE(u.last_name, '') as user_name,
           u.company_name, u.rating as user_rating, u.is_verified
    FROM requests r
    LEFT JOIN categories c ON r.category_id = c.id
    LEFT JOIN regions reg ON r.region_id = reg.id
    JOIN users u ON r.user_id = u.id
    WHERE 1=1
  `;
  const params = [];
  let paramIndex = 1;
  
  if (type) {
    query += ` AND r.type = $${paramIndex++}`;
    params.push(type);
  }
  if (category_id) {
    query += ` AND r.category_id = $${paramIndex++}`;
    params.push(category_id);
  }
  if (region_id) {
    query += ` AND r.region_id = $${paramIndex++}`;
    params.push(region_id);
  }
  if (status) {
    query += ` AND r.status = $${paramIndex++}`;
    params.push(status);
  }
  
  query += ` ORDER BY r.is_boosted DESC, r.created_at DESC`;
  query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
  params.push(limit, offset);
  
  const result = await pool.query(query, params);
  res.json(result.rows);
});

// Get my requests
app.get('/api/requests/my', authMiddleware, async (req, res) => {
  const result = await pool.query(`
    SELECT r.*, 
           c.name as category_name, c.icon as category_icon,
           reg.name as region_name
    FROM requests r
    LEFT JOIN categories c ON r.category_id = c.id
    LEFT JOIN regions reg ON r.region_id = reg.id
    WHERE r.user_id = $1
    ORDER BY r.created_at DESC
  `, [req.user.id]);
  res.json(result.rows);
});

// Create request
app.post('/api/requests', authMiddleware, async (req, res) => {
  const {
    type, category_id, title, description, volume, unit,
    budget_min, budget_max, currency, region_id, delivery_address, deadline
  } = req.body;
  
  const result = await pool.query(`
    INSERT INTO requests (
      user_id, type, category_id, title, description, volume, unit,
      budget_min, budget_max, currency, region_id, delivery_address, deadline
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *
  `, [
    req.user.id, type, category_id, title, description, volume, unit,
    budget_min, budget_max, currency || 'RUB', region_id, delivery_address, deadline
  ]);
  
  const request = result.rows[0];
  
  // Trigger matching
  await findMatches(request);
  
  res.status(201).json(request);
});

// Get request by ID
app.get('/api/requests/:id', authMiddleware, async (req, res) => {
  const result = await pool.query(`
    SELECT r.*, 
           c.name as category_name, c.icon as category_icon,
           reg.name as region_name,
           u.first_name || ' ' || COALESCE(u.last_name, '') as user_name,
           u.company_name, u.rating as user_rating, u.is_verified
    FROM requests r
    LEFT JOIN categories c ON r.category_id = c.id
    LEFT JOIN regions reg ON r.region_id = reg.id
    JOIN users u ON r.user_id = u.id
    WHERE r.id = $1
  `, [req.params.id]);
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Request not found' });
  }
  
  // Increment view count
  await pool.query('UPDATE requests SET view_count = view_count + 1 WHERE id = $1', [req.params.id]);
  
  res.json(result.rows[0]);
});

// Update request
app.put('/api/requests/:id', authMiddleware, async (req, res) => {
  const {
    title, description, volume, unit, budget_min, budget_max,
    region_id, delivery_address, deadline, status
  } = req.body;
  
  const result = await pool.query(`
    UPDATE requests SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      volume = COALESCE($3, volume),
      unit = COALESCE($4, unit),
      budget_min = COALESCE($5, budget_min),
      budget_max = COALESCE($6, budget_max),
      region_id = COALESCE($7, region_id),
      delivery_address = COALESCE($8, delivery_address),
      deadline = COALESCE($9, deadline),
      status = COALESCE($10, status),
      updated_at = NOW()
    WHERE id = $11 AND user_id = $12
    RETURNING *
  `, [
    title, description, volume, unit, budget_min, budget_max,
    region_id, delivery_address, deadline, status, req.params.id, req.user.id
  ]);
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Request not found or access denied' });
  }
  
  res.json(result.rows[0]);
});

// =====================================================
// MATCHING ENGINE
// =====================================================

async function findMatches(request) {
  const oppositeType = request.type === 'buy' ? 'sell' : 'buy';
  
  // Find potential matches
  const candidates = await pool.query(`
    SELECT r.*, u.rating as user_rating, u.successful_deals
    FROM requests r
    JOIN users u ON r.user_id = u.id
    WHERE r.type = $1
      AND r.status = 'active'
      AND r.user_id != $2
      AND r.category_id = $3
  `, [oppositeType, request.user_id, request.category_id]);
  
  for (const candidate of candidates.rows) {
    const score = calculateMatchScore(request, candidate);
    
    if (score >= 70) {  // Minimum threshold
      // Insert match
      await pool.query(`
        INSERT INTO matches (request_id, counterparty_request_id, score, category_score, region_score, budget_score, rating_score)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (request_id, counterparty_request_id) DO UPDATE SET
          score = EXCLUDED.score,
          category_score = EXCLUDED.category_score,
          region_score = EXCLUDED.region_score,
          budget_score = EXCLUDED.budget_score,
          rating_score = EXCLUDED.rating_score
      `, [
        request.id, candidate.id, score,
        40,  // Category match = 40%
        request.region_id === candidate.region_id ? 25 : 15,
        calculateBudgetScore(request, candidate),
        (candidate.user_rating || 0) * 2  // Rating * 2 (max 10%)
      ]);
      
      // Update match counts
      await pool.query('UPDATE requests SET match_count = match_count + 1 WHERE id = $1', [request.id]);
      await pool.query('UPDATE requests SET match_count = match_count + 1 WHERE id = $1', [candidate.id]);
      
      // Send notification
      await sendMatchNotification(request, candidate, score);
    }
  }
}

function calculateMatchScore(request, candidate) {
  let score = 0;
  
  // Category match (40%)
  if (request.category_id === candidate.category_id) {
    score += 40;
  }
  
  // Region match (25%)
  if (request.region_id === candidate.region_id) {
    score += 25;
  } else {
    score += 15;  // Partial score for different regions
  }
  
  // Budget overlap (20%)
  score += calculateBudgetScore(request, candidate);
  
  // Rating bonus (10%)
  score += Math.min((candidate.user_rating || 0) * 2, 10);
  
  // Response speed bonus (5%)
  score += 5;  // Default for now
  
  return Math.min(score, 100);
}

function calculateBudgetScore(request, candidate) {
  // Check if budgets overlap
  const reqMin = request.budget_min || 0;
  const reqMax = request.budget_max || Infinity;
  const candMin = candidate.budget_min || 0;
  const candMax = candidate.budget_max || Infinity;
  
  if (reqMin <= candMax && candMin <= reqMax) {
    return 20;  // Full overlap
  }
  
  // Calculate proximity
  const gap = Math.min(
    Math.abs(reqMin - candMax),
    Math.abs(candMin - reqMax)
  );
  const avgBudget = (reqMin + reqMax + candMin + candMax) / 4;
  
  if (gap < avgBudget * 0.2) {
    return 10;  // Close enough
  }
  
  return 0;
}

async function sendMatchNotification(request, candidate, score) {
  // Get users
  const users = await pool.query(
    'SELECT telegram_id FROM users WHERE id IN ($1, $2)',
    [request.user_id, candidate.user_id]
  );
  
  for (const user of users.rows) {
    try {
      await bot.telegram.sendMessage(user.telegram_id,
        `🎯 Новый матч!\n\n` +
        `Найден подходящий контрагент (совместимость ${score}%)\n\n` +
        `Откройте приложение для просмотра деталей.`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: '👀 Посмотреть', web_app: { url: `${config.telegram.webAppUrl}?view=matches` } }]
            ]
          }
        }
      );
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }
}

// =====================================================
// MATCHES
// =====================================================

// Get matches for a request
app.get('/api/requests/:id/matches', authMiddleware, async (req, res) => {
  const result = await pool.query(`
    SELECT m.*,
           r.title, r.description, r.volume, r.budget_min, r.budget_max,
           c.name as category_name,
           reg.name as region_name,
           u.first_name || ' ' || COALESCE(u.last_name, '') as user_name,
           u.company_name, u.rating, u.is_verified, u.successful_deals
    FROM matches m
    JOIN requests r ON m.counterparty_request_id = r.id
    LEFT JOIN categories c ON r.category_id = c.id
    LEFT JOIN regions reg ON r.region_id = reg.id
    JOIN users u ON r.user_id = u.id
    WHERE m.request_id = $1
    ORDER BY m.score DESC
  `, [req.params.id]);
  
  res.json(result.rows);
});

// Mark match as viewed
app.post('/api/matches/:id/view', authMiddleware, async (req, res) => {
  await pool.query(
    'UPDATE matches SET is_viewed = true, viewed_at = NOW() WHERE id = $1',
    [req.params.id]
  );
  res.json({ success: true });
});

// Contact match (start negotiation)
app.post('/api/matches/:id/contact', authMiddleware, async (req, res) => {
  const result = await pool.query(`
    UPDATE matches SET is_contacted = true, contacted_at = NOW()
    WHERE id = $1
    RETURNING *
  `, [req.params.id]);
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Match not found' });
  }
  
  // Update request statuses
  await pool.query(`
    UPDATE requests SET status = 'negotiating'
    WHERE id IN ($1, $2)
  `, [result.rows[0].request_id, result.rows[0].counterparty_request_id]);
  
  res.json(result.rows[0]);
});

// =====================================================
// DEALS
// =====================================================

// Create deal from match
app.post('/api/deals', authMiddleware, async (req, res) => {
  const { match_id, amount, title, description } = req.body;
  
  // Get match details
  const matchResult = await pool.query(`
    SELECT m.*, 
           r1.user_id as request_user_id, r1.type as request_type,
           r2.user_id as counterparty_user_id
    FROM matches m
    JOIN requests r1 ON m.request_id = r1.id
    JOIN requests r2 ON m.counterparty_request_id = r2.id
    WHERE m.id = $1
  `, [match_id]);
  
  if (matchResult.rows.length === 0) {
    return res.status(404).json({ error: 'Match not found' });
  }
  
  const match = matchResult.rows[0];
  
  // Determine buyer and seller
  const buyerId = match.request_type === 'buy' ? match.request_user_id : match.counterparty_user_id;
  const sellerId = match.request_type === 'sell' ? match.request_user_id : match.counterparty_user_id;
  
  // Create deal
  const result = await pool.query(`
    INSERT INTO deals (
      buyer_id, seller_id, buyer_request_id, seller_request_id, match_id,
      title, description, amount, commission_rate
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `, [
    buyerId, sellerId,
    match.request_type === 'buy' ? match.request_id : match.counterparty_request_id,
    match.request_type === 'sell' ? match.request_id : match.counterparty_request_id,
    match_id, title, description, amount, config.commission.rate
  ]);
  
  // Update request statuses
  await pool.query(`
    UPDATE requests SET status = 'deal'
    WHERE id IN ($1, $2)
  `, [match.request_id, match.counterparty_request_id]);
  
  // Create deal event
  await pool.query(`
    INSERT INTO deal_events (deal_id, event_type, description, created_by)
    VALUES ($1, 'created', 'Сделка создана', $2)
  `, [result.rows[0].id, req.user.id]);
  
  res.status(201).json(result.rows[0]);
});

// Get my deals
app.get('/api/deals/my', authMiddleware, async (req, res) => {
  const result = await pool.query(`
    SELECT d.*,
           b.first_name || ' ' || COALESCE(b.last_name, '') as buyer_name,
           b.company_name as buyer_company,
           s.first_name || ' ' || COALESCE(s.last_name, '') as seller_name,
           s.company_name as seller_company
    FROM deals d
    JOIN users b ON d.buyer_id = b.id
    JOIN users s ON d.seller_id = s.id
    WHERE d.buyer_id = $1 OR d.seller_id = $1
    ORDER BY d.created_at DESC
  `, [req.user.id]);
  
  res.json(result.rows);
});

// Update deal stage
app.put('/api/deals/:id/stage', authMiddleware, async (req, res) => {
  const { stage, progress, notes } = req.body;
  
  const stageProgress = {
    negotiation: 10,
    documents: 30,
    payment: 50,
    escrow: 60,
    delivery: 80,
    completed: 100
  };
  
  const result = await pool.query(`
    UPDATE deals SET
      stage = $1,
      progress = $2,
      notes = COALESCE($3, notes),
      completed_at = CASE WHEN $1 = 'completed' THEN NOW() ELSE completed_at END,
      updated_at = NOW()
    WHERE id = $4 AND (buyer_id = $5 OR seller_id = $5)
    RETURNING *
  `, [stage, progress || stageProgress[stage], notes, req.params.id, req.user.id]);
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Deal not found or access denied' });
  }
  
  // Create event
  await pool.query(`
    INSERT INTO deal_events (deal_id, event_type, description, created_by)
    VALUES ($1, 'stage_changed', $2, $3)
  `, [req.params.id, `Этап изменён на: ${stage}`, req.user.id]);
  
  // If completed, update user stats
  if (stage === 'completed') {
    await pool.query(`
      UPDATE users SET 
        total_deals = total_deals + 1,
        successful_deals = successful_deals + 1
      WHERE id IN ($1, $2)
    `, [result.rows[0].buyer_id, result.rows[0].seller_id]);
  }
  
  res.json(result.rows[0]);
});

// =====================================================
// ANALYTICS
// =====================================================

// Dashboard stats
app.get('/api/stats/dashboard', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  
  const stats = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM requests WHERE user_id = $1 AND status = 'active') as active_requests,
      (SELECT COUNT(*) FROM matches m JOIN requests r ON m.request_id = r.id WHERE r.user_id = $1 AND m.is_viewed = false) as new_matches,
      (SELECT COUNT(*) FROM deals WHERE (buyer_id = $1 OR seller_id = $1) AND stage NOT IN ('completed', 'cancelled')) as active_deals,
      (SELECT COALESCE(SUM(amount), 0) FROM deals WHERE (buyer_id = $1 OR seller_id = $1) AND stage = 'completed') as total_volume,
      (SELECT COALESCE(SUM(commission_amount), 0) FROM deals WHERE (buyer_id = $1 OR seller_id = $1) AND stage = 'completed') as total_commission
  `, [userId]);
  
  res.json(stats.rows[0]);
});

// =====================================================
// HEALTH CHECK
// =====================================================
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// =====================================================
// START SERVER
// =====================================================
async function start() {
  // Test database connection
  try {
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
  
  // Start bot
  if (config.telegram.botToken) {
    bot.launch();
    console.log('✅ Telegram bot started');
  }
  
  // Start server
  app.listen(config.port, () => {
    console.log(`✅ Server running on port ${config.port}`);
  });
}

start();

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

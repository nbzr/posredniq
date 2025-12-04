import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Request, User, Match, Category, RequestType } from '../types';
import type { Database } from '../types/database';

type DbRequest = Database['public']['Tables']['requests']['Row'];
type DbUser = Database['public']['Tables']['users']['Row'];
type DbMatch = Database['public']['Tables']['matches']['Row'];

// ============================================
// USERS API
// ============================================

export const usersApi = {
  // Получить или создать пользователя по Telegram ID
  async getOrCreate(telegramUser: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
  }): Promise<User | null> {
    if (!isSupabaseConfigured()) return null;

    const { data: existing } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramUser.id)
      .single();

    if (existing) {
      return mapDbUserToUser(existing);
    }

    const { data: created, error } = await supabase
      .from('users')
      .insert({
        telegram_id: telegramUser.id,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name || null,
        telegram_username: telegramUser.username || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return null;
    }

    return created ? mapDbUserToUser(created) : null;
  },

  // Получить пользователя по ID
  async getById(userId: string): Promise<User | null> {
    if (!isSupabaseConfigured()) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data ? mapDbUserToUser(data) : null;
  },

  // Обновить профиль пользователя
  async update(userId: string, updates: Partial<User>): Promise<User | null> {
    if (!isSupabaseConfigured()) return null;

    const { data, error } = await supabase
      .from('users')
      .update({
        company_name: updates.company,
        phone: updates.phone,
        company_inn: updates.inn,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return null;
    }

    return data ? mapDbUserToUser(data) : null;
  },
};

// ============================================
// REQUESTS API
// ============================================

export const requestsApi = {
  // Получить список заявок с фильтрами
  async getAll(filters?: {
    type?: RequestType;
    category?: string;
    region?: string;
  }): Promise<Request[]> {
    if (!isSupabaseConfigured()) return [];

    let query = supabase
      .from('v_active_requests')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching requests:', error);
      return [];
    }

    return data ? data.map(mapDbRequestToRequest) : [];
  },

  // Получить мои заявки
  async getMy(userId: string): Promise<Request[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching my requests:', error);
      return [];
    }

    return data ? data.map(mapDbRequestToRequest) : [];
  },

  // Создать заявку
  async create(requestData: {
    userId: string;
    type: RequestType;
    category: string;
    title: string;
    description: string;
    volume: string;
    unit: string;
    budget?: number;
    price?: number;
    region: string;
  }): Promise<Request | null> {
    if (!isSupabaseConfigured()) return null;

    // Найти category_id по slug
    const { data: categories } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', requestData.category)
      .single();

    // Найти region_id по name
    const { data: regions } = await supabase
      .from('regions')
      .select('id')
      .eq('name', requestData.region)
      .single();

    const { data, error } = await supabase
      .from('requests')
      .insert({
        user_id: requestData.userId,
        type: requestData.type,
        category_id: categories?.id || null,
        title: requestData.title,
        description: requestData.description,
        volume: requestData.volume,
        unit: requestData.unit,
        budget_min: requestData.budget || null,
        budget_max: requestData.budget || null,
        region_id: regions?.id || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating request:', error);
      return null;
    }

    return data ? mapDbRequestToRequest(data) : null;
  },

  // Обновить заявку
  async update(requestId: string, updates: Partial<Request>): Promise<Request | null> {
    if (!isSupabaseConfigured()) return null;

    const { data, error } = await supabase
      .from('requests')
      .update({
        status: updates.status,
        title: updates.title,
        description: updates.description,
      })
      .eq('id', requestId)
      .select()
      .single();

    if (error) {
      console.error('Error updating request:', error);
      return null;
    }

    return data ? mapDbRequestToRequest(data) : null;
  },

  // Удалить заявку
  async delete(requestId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    const { error } = await supabase
      .from('requests')
      .delete()
      .eq('id', requestId);

    if (error) {
      console.error('Error deleting request:', error);
      return false;
    }

    return true;
  },

  // Поиск заявок
  async search(query: string): Promise<Request[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('v_active_requests')
      .select('*')
      .textSearch('title', query)
      .limit(20);

    if (error) {
      console.error('Error searching requests:', error);
      return [];
    }

    return data ? data.map(mapDbRequestToRequest) : [];
  },
};

// ============================================
// MATCHES API
// ============================================

export const matchesApi = {
  // Получить матчи для заявки
  async getForRequest(requestId: string): Promise<Match[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        counterparty_request:counterparty_request_id (*)
      `)
      .eq('request_id', requestId)
      .order('score', { ascending: false });

    if (error) {
      console.error('Error fetching matches:', error);
      return [];
    }

    return data ? data.map(mapDbMatchToMatch) : [];
  },

  // Отметить матч как просмотренный
  async markViewed(matchId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    const { error } = await supabase
      .from('matches')
      .update({ is_viewed: true, viewed_at: new Date().toISOString() })
      .eq('id', matchId);

    if (error) {
      console.error('Error marking match as viewed:', error);
      return false;
    }

    return true;
  },
};

// ============================================
// CATEGORIES & REGIONS API
// ============================================

export const referencesApi = {
  async getCategories(): Promise<{ id: number; name: string; slug: string; icon: string }[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, icon')
      .eq('is_active', true)
      .order('sort_order');

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return data || [];
  },

  async getRegions(): Promise<{ id: number; name: string; code: string }[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('regions')
      .select('id, name, code')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching regions:', error);
      return [];
    }

    return data || [];
  },
};

// ============================================
// MAPPERS (DB -> App Types)
// ============================================

function mapDbUserToUser(dbUser: DbUser): User {
  return {
    id: dbUser.id,
    telegramId: dbUser.telegram_id,
    name: `${dbUser.first_name} ${dbUser.last_name || ''}`.trim(),
    company: dbUser.company_name || undefined,
    phone: dbUser.phone || undefined,
    inn: dbUser.company_inn || undefined,
    role: dbUser.role === 'user' ? 'buyer' : 'both',
    rating: dbUser.rating,
    dealsCount: dbUser.total_deals,
    verified: dbUser.is_verified,
    createdAt: new Date(dbUser.created_at),
  };
}

function mapDbRequestToRequest(dbReq: any): Request {
  return {
    id: dbReq.id,
    userId: dbReq.user_id,
    type: dbReq.type as RequestType,
    category: dbReq.category_icon ?
      Object.entries(dbReq).find(([k, v]) => k === 'category_icon')?.[0] as Category || 'other'
      : 'other',
    title: dbReq.title,
    description: dbReq.description || '',
    volume: dbReq.volume || '',
    unit: dbReq.unit || '',
    budget: dbReq.budget_min || undefined,
    price: dbReq.budget_max || undefined,
    region: dbReq.region_name || dbReq.region || '',
    status: dbReq.status,
    createdAt: new Date(dbReq.created_at),
    expiresAt: dbReq.expires_at ? new Date(dbReq.expires_at) : undefined,
    matchesCount: dbReq.match_count || 0,
  };
}

function mapDbMatchToMatch(dbMatch: any): Match {
  return {
    id: dbMatch.id,
    requestId: dbMatch.request_id,
    counterpartyId: dbMatch.counterparty_request_id,
    counterpartyRequest: dbMatch.counterparty_request
      ? mapDbRequestToRequest(dbMatch.counterparty_request)
      : undefined,
    score: dbMatch.score,
    status: dbMatch.is_viewed ? 'accepted' : 'pending',
    createdAt: new Date(dbMatch.created_at),
  };
}

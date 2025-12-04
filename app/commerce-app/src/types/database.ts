// Типы для Supabase Database
// Автоматически генерируются из схемы БД

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          telegram_id: number
          telegram_username: string | null
          first_name: string
          last_name: string | null
          phone: string | null
          email: string | null
          company_name: string | null
          company_inn: string | null
          role: 'user' | 'agent' | 'admin'
          rating: number
          total_deals: number
          successful_deals: number
          is_verified: boolean
          verified_at: string | null
          is_premium: boolean
          premium_until: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          telegram_id: number
          telegram_username?: string | null
          first_name: string
          last_name?: string | null
          phone?: string | null
          email?: string | null
          company_name?: string | null
          company_inn?: string | null
          role?: 'user' | 'agent' | 'admin'
          rating?: number
          total_deals?: number
          successful_deals?: number
          is_verified?: boolean
          verified_at?: string | null
          is_premium?: boolean
          premium_until?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          telegram_id?: number
          telegram_username?: string | null
          first_name?: string
          last_name?: string | null
          phone?: string | null
          email?: string | null
          company_name?: string | null
          company_inn?: string | null
          role?: 'user' | 'agent' | 'admin'
          rating?: number
          total_deals?: number
          successful_deals?: number
          is_verified?: boolean
          verified_at?: string | null
          is_premium?: boolean
          premium_until?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          slug: string
          parent_id: number | null
          icon: string | null
          is_active: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          parent_id?: number | null
          icon?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          parent_id?: number | null
          icon?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      regions: {
        Row: {
          id: number
          name: string
          code: string | null
          country: string
          timezone: string | null
          is_active: boolean
        }
        Insert: {
          id?: number
          name: string
          code?: string | null
          country?: string
          timezone?: string | null
          is_active?: boolean
        }
        Update: {
          id?: number
          name?: string
          code?: string | null
          country?: string
          timezone?: string | null
          is_active?: boolean
        }
      }
      requests: {
        Row: {
          id: string
          user_id: string
          type: 'buy' | 'sell'
          category_id: number | null
          title: string
          description: string | null
          volume: string | null
          unit: string | null
          budget_min: number | null
          budget_max: number | null
          currency: string
          region_id: number | null
          delivery_address: string | null
          deadline: string | null
          status: 'active' | 'matched' | 'negotiating' | 'deal' | 'completed' | 'cancelled'
          match_count: number
          view_count: number
          is_boosted: boolean
          boosted_until: string | null
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'buy' | 'sell'
          category_id?: number | null
          title: string
          description?: string | null
          volume?: string | null
          unit?: string | null
          budget_min?: number | null
          budget_max?: number | null
          currency?: string
          region_id?: number | null
          delivery_address?: string | null
          deadline?: string | null
          status?: 'active' | 'matched' | 'negotiating' | 'deal' | 'completed' | 'cancelled'
          match_count?: number
          view_count?: number
          is_boosted?: boolean
          boosted_until?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'buy' | 'sell'
          category_id?: number | null
          title?: string
          description?: string | null
          volume?: string | null
          unit?: string | null
          budget_min?: number | null
          budget_max?: number | null
          currency?: string
          region_id?: number | null
          delivery_address?: string | null
          deadline?: string | null
          status?: 'active' | 'matched' | 'negotiating' | 'deal' | 'completed' | 'cancelled'
          match_count?: number
          view_count?: number
          is_boosted?: boolean
          boosted_until?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          request_id: string
          counterparty_request_id: string
          score: number
          category_score: number | null
          region_score: number | null
          budget_score: number | null
          rating_score: number | null
          is_viewed: boolean
          viewed_at: string | null
          is_contacted: boolean
          contacted_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          request_id: string
          counterparty_request_id: string
          score: number
          category_score?: number | null
          region_score?: number | null
          budget_score?: number | null
          rating_score?: number | null
          is_viewed?: boolean
          viewed_at?: string | null
          is_contacted?: boolean
          contacted_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          counterparty_request_id?: string
          score?: number
          category_score?: number | null
          region_score?: number | null
          budget_score?: number | null
          rating_score?: number | null
          is_viewed?: boolean
          viewed_at?: string | null
          is_contacted?: boolean
          contacted_at?: string | null
          created_at?: string
        }
      }
      deals: {
        Row: {
          id: string
          deal_number: string
          buyer_id: string
          seller_id: string
          buyer_request_id: string | null
          seller_request_id: string | null
          match_id: string | null
          title: string
          description: string | null
          amount: number
          currency: string
          commission_rate: number
          commission_amount: number | null
          stage: 'negotiation' | 'documents' | 'payment' | 'escrow' | 'delivery' | 'completed' | 'cancelled'
          progress: number
          escrow_id: string | null
          escrow_status: string | null
          contract_url: string | null
          delivery_tracking: string | null
          notes: string | null
          completed_at: string | null
          cancelled_at: string | null
          cancel_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          deal_number: string
          buyer_id: string
          seller_id: string
          buyer_request_id?: string | null
          seller_request_id?: string | null
          match_id?: string | null
          title: string
          description?: string | null
          amount: number
          currency?: string
          commission_rate?: number
          commission_amount?: number | null
          stage?: 'negotiation' | 'documents' | 'payment' | 'escrow' | 'delivery' | 'completed' | 'cancelled'
          progress?: number
          escrow_id?: string | null
          escrow_status?: string | null
          contract_url?: string | null
          delivery_tracking?: string | null
          notes?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          cancel_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          deal_number?: string
          buyer_id?: string
          seller_id?: string
          buyer_request_id?: string | null
          seller_request_id?: string | null
          match_id?: string | null
          title?: string
          description?: string | null
          amount?: number
          currency?: string
          commission_rate?: number
          commission_amount?: number | null
          stage?: 'negotiation' | 'documents' | 'payment' | 'escrow' | 'delivery' | 'completed' | 'cancelled'
          progress?: number
          escrow_id?: string | null
          escrow_status?: string | null
          contract_url?: string | null
          delivery_tracking?: string | null
          notes?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          cancel_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      v_active_requests: {
        Row: {
          id: string
          user_id: string
          type: 'buy' | 'sell'
          category_id: number | null
          title: string
          description: string | null
          volume: string | null
          unit: string | null
          budget_min: number | null
          budget_max: number | null
          currency: string
          region_id: number | null
          status: string
          match_count: number
          view_count: number
          created_at: string
          user_name: string
          company_name: string | null
          user_rating: number
          user_verified: boolean
          category_name: string | null
          category_icon: string | null
          region_name: string | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      request_type: 'buy' | 'sell'
      request_status: 'active' | 'matched' | 'negotiating' | 'deal' | 'completed' | 'cancelled'
      deal_stage: 'negotiation' | 'documents' | 'payment' | 'escrow' | 'delivery' | 'completed' | 'cancelled'
      user_role: 'user' | 'agent' | 'admin'
    }
  }
}

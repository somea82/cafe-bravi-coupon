export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      campaigns: {
        Row: {
          created_at: string
          discount_percent: number
          ends_at: string | null
          id: string
          is_active: boolean
          slug: string
          starts_at: string | null
          store_id: string
          title: string
          validity_days: number
        }
        Insert: {
          created_at?: string
          discount_percent: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          slug: string
          starts_at?: string | null
          store_id: string
          title: string
          validity_days: number
        }
        Update: {
          created_at?: string
          discount_percent?: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          slug?: string
          starts_at?: string | null
          store_id?: string
          title?: string
          validity_days?: number
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_events: {
        Row: {
          action: Database["public"]["Enums"]["coupon_event_action"]
          coupon_id: string
          created_at: string
          id: string
          staff_id: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["coupon_event_action"]
          coupon_id: string
          created_at?: string
          id?: string
          staff_id?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["coupon_event_action"]
          coupon_id?: string
          created_at?: string
          id?: string
          staff_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupon_events_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          access_token_hash: string
          campaign_id: string
          claim_slot_active: boolean
          code: string
          created_at: string
          expires_at: string
          id: string
          issued_at: string
          used_at: string | null
          used_by: string | null
          visitor_id: string
        }
        Insert: {
          access_token_hash: string
          campaign_id: string
          claim_slot_active?: boolean
          code: string
          created_at?: string
          expires_at: string
          id?: string
          issued_at: string
          used_at?: string | null
          used_by?: string | null
          visitor_id: string
        }
        Update: {
          access_token_hash?: string
          campaign_id?: string
          claim_slot_active?: boolean
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          issued_at?: string
          used_at?: string | null
          used_by?: string | null
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupons_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupons_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitors"
            referencedColumns: ["id"]
          },
        ]
      }
      qr_entries: {
        Row: {
          campaign_id: string
          created_at: string
          expires_at: string
          id: string
          verified_at: string
          visitor_id: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          expires_at?: string
          id?: string
          verified_at?: string
          visitor_id: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          verified_at?: string
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "qr_entries_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qr_entries_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitors"
            referencedColumns: ["id"]
          },
        ]
      }
      qr_tokens: {
        Row: {
          campaign_id: string
          created_at: string
          id: string
          is_active: boolean
          token_hash: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          token_hash: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          token_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "qr_tokens_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          created_at: string
          google_url: string | null
          id: string
          kakao_url: string | null
          name: string
          naver_url: string | null
          slug: string
        }
        Insert: {
          created_at?: string
          google_url?: string | null
          id?: string
          kakao_url?: string | null
          name: string
          naver_url?: string | null
          slug: string
        }
        Update: {
          created_at?: string
          google_url?: string | null
          id?: string
          kakao_url?: string | null
          name?: string
          naver_url?: string | null
          slug?: string
        }
        Relationships: []
      }
      visitors: {
        Row: {
          created_at: string
          id: string
          visitor_key_hash: string
        }
        Insert: {
          created_at?: string
          id?: string
          visitor_key_hash: string
        }
        Update: {
          created_at?: string
          id?: string
          visitor_key_hash?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_coupon: {
        Args: {
          p_access_token_hash: string
          p_campaign_id: string
          p_code: string
          p_coupon_id: string
          p_visitor_id: string
        }
        Returns: Json
      }
      get_campaign_dashboard_stats: {
        Args: { p_campaign_slug: string }
        Returns: Json
      }
      has_valid_qr_entry: {
        Args: { p_campaign_slug: string; p_visitor_key_hash: string }
        Returns: boolean
      }
      record_qr_entry: {
        Args: { p_campaign_id: string; p_visitor_id: string }
        Returns: {
          campaign_id: string
          created_at: string
          expires_at: string
          id: string
          verified_at: string
          visitor_id: string
        }
        SetofOptions: {
          from: "*"
          to: "qr_entries"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      redeem_coupon: {
        Args: { p_code: string; p_staff_id: string }
        Returns: Json
      }
      verify_qr_token: {
        Args: { p_campaign_slug: string; p_token_hash: string }
        Returns: {
          campaign_id: string
          campaign_slug: string
        }[]
      }
    }
    Enums: {
      coupon_event_action:
        | "ISSUED"
        | "VIEWED"
        | "SHARED"
        | "REDEEMED"
        | "EXPIRED_VIEWED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      coupon_event_action: [
        "ISSUED",
        "VIEWED",
        "SHARED",
        "REDEEMED",
        "EXPIRED_VIEWED",
      ],
    },
  },
} as const

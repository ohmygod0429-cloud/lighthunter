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
  public: {
    Tables: {
      membership_applications: {
        Row: {
          agree_chatham: boolean
          agree_etiquette: boolean
          agree_house_rules: boolean
          agree_no_selling: boolean
          agree_truthful: boolean
          birth_date: string | null
          business_email: string
          contact: string | null
          core_value: string
          created_at: string
          full_name: string
          headshot_path: string | null
          id: string
          industry: string
          licenses: string | null
          life_photo_path: string | null
          liquid_assets: string
          meeting_time_pref: string | null
          messenger: string | null
          phone: string | null
          pillars: string | null
          prior_orgs: string | null
          referrer: string | null
          revenue_band: string
          title_company: string
        }
        Insert: {
          agree_chatham?: boolean
          agree_etiquette?: boolean
          agree_house_rules?: boolean
          agree_no_selling?: boolean
          agree_truthful?: boolean
          birth_date?: string | null
          business_email: string
          contact?: string | null
          core_value: string
          created_at?: string
          full_name: string
          headshot_path?: string | null
          id?: string
          industry: string
          licenses?: string | null
          life_photo_path?: string | null
          liquid_assets: string
          meeting_time_pref?: string | null
          messenger?: string | null
          phone?: string | null
          pillars?: string | null
          prior_orgs?: string | null
          referrer?: string | null
          revenue_band: string
          title_company: string
        }
        Update: {
          agree_chatham?: boolean
          agree_etiquette?: boolean
          agree_house_rules?: boolean
          agree_no_selling?: boolean
          agree_truthful?: boolean
          birth_date?: string | null
          business_email?: string
          contact?: string | null
          core_value?: string
          created_at?: string
          full_name?: string
          headshot_path?: string | null
          id?: string
          industry?: string
          licenses?: string | null
          life_photo_path?: string | null
          liquid_assets?: string
          meeting_time_pref?: string | null
          messenger?: string | null
          phone?: string | null
          pillars?: string | null
          prior_orgs?: string | null
          referrer?: string | null
          revenue_band?: string
          title_company?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string
          email: string
          id: string
          industry: string | null
          intent: string
          interests: string | null
          line_id: string | null
          message: string | null
          name: string
          phone: string
          plan: string
          reasons: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          industry?: string | null
          intent: string
          interests?: string | null
          line_id?: string | null
          message?: string | null
          name: string
          phone: string
          plan: string
          reasons?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          industry?: string | null
          intent?: string
          interests?: string | null
          line_id?: string | null
          message?: string | null
          name?: string
          phone?: string
          plan?: string
          reasons?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

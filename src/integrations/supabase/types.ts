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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      course_registrations: {
        Row: {
          attended: boolean
          course_id: string
          created_at: string
          email: string
          id: string
          messenger: string
          name: string
          note: string
          phone: string
        }
        Insert: {
          attended?: boolean
          course_id: string
          created_at?: string
          email?: string
          id?: string
          messenger?: string
          name: string
          note?: string
          phone: string
        }
        Update: {
          attended?: boolean
          course_id?: string
          created_at?: string
          email?: string
          id?: string
          messenger?: string
          name?: string
          note?: string
          phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_registrations_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          capacity: number
          course_date: string
          created_at: string
          description: string
          end_time: string
          id: string
          is_published: boolean
          location: string
          map_url: string
          name: string
          region: string
          start_time: string
          teacher_id: string | null
        }
        Insert: {
          capacity?: number
          course_date: string
          created_at?: string
          description?: string
          end_time?: string
          id?: string
          is_published?: boolean
          location?: string
          map_url?: string
          name: string
          region: string
          start_time?: string
          teacher_id?: string | null
        }
        Update: {
          capacity?: number
          course_date?: string
          created_at?: string
          description?: string
          end_time?: string
          id?: string
          is_published?: boolean
          location?: string
          map_url?: string
          name?: string
          region?: string
          start_time?: string
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      gathering_poll_options: {
        Row: {
          end_time: string
          id: string
          option_date: string
          poll_id: string
          start_time: string
        }
        Insert: {
          end_time?: string
          id?: string
          option_date: string
          poll_id: string
          start_time?: string
        }
        Update: {
          end_time?: string
          id?: string
          option_date?: string
          poll_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "gathering_poll_options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "gathering_polls"
            referencedColumns: ["id"]
          },
        ]
      }
      gathering_polls: {
        Row: {
          created_at: string
          description: string
          id: string
          is_open: boolean
          region: string
          theme: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          is_open?: boolean
          region?: string
          theme: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_open?: boolean
          region?: string
          theme?: string
          title?: string
        }
        Relationships: []
      }
      gathering_registrations: {
        Row: {
          agree_ride_safety: boolean
          attended: boolean
          created_at: string
          driver_code: string
          email: string
          gathering_id: string
          id: string
          license_plate: string
          messenger: string
          name: string
          note: string
          paid: boolean
          phone: string
          ride_conditions: string
          ride_driver_id: string | null
          ride_meet_location: string
          ride_meet_time: string
          ride_role: string
          seats: number
        }
        Insert: {
          agree_ride_safety?: boolean
          attended?: boolean
          created_at?: string
          driver_code?: string
          email?: string
          gathering_id: string
          id?: string
          license_plate?: string
          messenger?: string
          name: string
          note?: string
          paid?: boolean
          phone: string
          ride_conditions?: string
          ride_driver_id?: string | null
          ride_meet_location?: string
          ride_meet_time?: string
          ride_role?: string
          seats?: number
        }
        Update: {
          agree_ride_safety?: boolean
          attended?: boolean
          created_at?: string
          driver_code?: string
          email?: string
          gathering_id?: string
          id?: string
          license_plate?: string
          messenger?: string
          name?: string
          note?: string
          paid?: boolean
          phone?: string
          ride_conditions?: string
          ride_driver_id?: string | null
          ride_meet_location?: string
          ride_meet_time?: string
          ride_role?: string
          seats?: number
        }
        Relationships: [
          {
            foreignKeyName: "gathering_registrations_gathering_id_fkey"
            columns: ["gathering_id"]
            isOneToOne: false
            referencedRelation: "gatherings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gathering_registrations_ride_driver_id_fkey"
            columns: ["ride_driver_id"]
            isOneToOne: false
            referencedRelation: "gathering_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      gathering_votes: {
        Row: {
          created_at: string
          id: string
          option_id: string
          voter_key: string
        }
        Insert: {
          created_at?: string
          id?: string
          option_id: string
          voter_key: string
        }
        Update: {
          created_at?: string
          id?: string
          option_id?: string
          voter_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "gathering_votes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "gathering_poll_options"
            referencedColumns: ["id"]
          },
        ]
      }
      gathering_wish_joins: {
        Row: {
          contact: string
          created_at: string
          id: string
          messenger: string
          name: string
          phone: string
          voter_key: string
          wish_id: string
        }
        Insert: {
          contact?: string
          created_at?: string
          id?: string
          messenger?: string
          name?: string
          phone?: string
          voter_key: string
          wish_id: string
        }
        Update: {
          contact?: string
          created_at?: string
          id?: string
          messenger?: string
          name?: string
          phone?: string
          voter_key?: string
          wish_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gathering_wish_joins_wish_id_fkey"
            columns: ["wish_id"]
            isOneToOne: false
            referencedRelation: "gathering_wishes"
            referencedColumns: ["id"]
          },
        ]
      }
      gathering_wishes: {
        Row: {
          conditions: string
          contact: string
          content: string
          created_at: string
          id: string
          meet_location: string
          min_people: number
          nickname: string
          status: string
          theme: string
        }
        Insert: {
          conditions?: string
          contact?: string
          content: string
          created_at?: string
          id?: string
          meet_location?: string
          min_people?: number
          nickname?: string
          status?: string
          theme: string
        }
        Update: {
          conditions?: string
          contact?: string
          content?: string
          created_at?: string
          id?: string
          meet_location?: string
          min_people?: number
          nickname?: string
          status?: string
          theme?: string
        }
        Relationships: []
      }
      gatherings: {
        Row: {
          capacity: number
          created_at: string
          description: string
          end_time: string
          event_date: string
          fee: number
          id: string
          is_published: boolean
          location: string
          location_photo_path: string
          map_url: string
          meet_point: string
          min_people: number
          payment_note: string
          payment_qr_path: string
          payment_url: string
          performer_ids: string[]
          perks: string
          region: string
          rideshare_enabled: boolean
          start_time: string
          status: string
          status_note: string
          theme: string
          title: string
        }
        Insert: {
          capacity?: number
          created_at?: string
          description?: string
          end_time?: string
          event_date: string
          fee?: number
          id?: string
          is_published?: boolean
          location?: string
          location_photo_path?: string
          map_url?: string
          meet_point?: string
          min_people?: number
          payment_note?: string
          payment_qr_path?: string
          payment_url?: string
          performer_ids?: string[]
          perks?: string
          region: string
          rideshare_enabled?: boolean
          start_time?: string
          status?: string
          status_note?: string
          theme: string
          title: string
        }
        Update: {
          capacity?: number
          created_at?: string
          description?: string
          end_time?: string
          event_date?: string
          fee?: number
          id?: string
          is_published?: boolean
          location?: string
          location_photo_path?: string
          map_url?: string
          meet_point?: string
          min_people?: number
          payment_note?: string
          payment_qr_path?: string
          payment_url?: string
          performer_ids?: string[]
          perks?: string
          region?: string
          rideshare_enabled?: boolean
          start_time?: string
          status?: string
          status_note?: string
          theme?: string
          title?: string
        }
        Relationships: []
      }
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
      performers: {
        Row: {
          created_at: string
          id: string
          is_published: boolean
          kind: string
          name: string
          photo_path: string
          summary: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_published?: boolean
          kind?: string
          name: string
          photo_path?: string
          summary?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_published?: boolean
          kind?: string
          name?: string
          photo_path?: string
          summary?: string
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
          referrer: string | null
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
          referrer?: string | null
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
          referrer?: string | null
        }
        Relationships: []
      }
      section_external_links: {
        Row: {
          is_published: boolean
          links: Json
          slot_id: string
          updated_at: string
        }
        Insert: {
          is_published?: boolean
          links?: Json
          slot_id: string
          updated_at?: string
        }
        Update: {
          is_published?: boolean
          links?: Json
          slot_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      section_media: {
        Row: {
          file_name: string
          file_path: string
          file_title: string
          is_published: boolean
          slot_id: string
          updated_at: string
          video_path: string
          video_title: string
          video_url: string
        }
        Insert: {
          file_name?: string
          file_path?: string
          file_title?: string
          is_published?: boolean
          slot_id: string
          updated_at?: string
          video_path?: string
          video_title?: string
          video_url?: string
        }
        Update: {
          file_name?: string
          file_path?: string
          file_title?: string
          is_published?: boolean
          slot_id?: string
          updated_at?: string
          video_path?: string
          video_title?: string
          video_url?: string
        }
        Relationships: []
      }
      teacher_reviews: {
        Row: {
          content: string
          course_id: string | null
          created_at: string
          id: string
          is_published: boolean
          nickname: string
          teacher_id: string
        }
        Insert: {
          content: string
          course_id?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          nickname: string
          teacher_id: string
        }
        Update: {
          content?: string
          course_id?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          nickname?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_reviews_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_reviews_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          category: string
          contact: string
          created_at: string
          experience: string
          gallery_paths: string[]
          id: string
          is_published: boolean
          name: string
          photo_path: string
          regions: string[]
          summary: string
          title: string
        }
        Insert: {
          category?: string
          contact?: string
          created_at?: string
          experience?: string
          gallery_paths?: string[]
          id?: string
          is_published?: boolean
          name: string
          photo_path?: string
          regions?: string[]
          summary?: string
          title?: string
        }
        Update: {
          category?: string
          contact?: string
          created_at?: string
          experience?: string
          gallery_paths?: string[]
          id?: string
          is_published?: boolean
          name?: string
          photo_path?: string
          regions?: string[]
          summary?: string
          title?: string
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

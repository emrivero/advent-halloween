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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      movies: {
        Row: {
          created_at: string
          id: string
          poster_url: string | null
          rating_num: number | null
          runtime_min: number | null
          tags: string[] | null
          title: string
          tmdb_id: number | null
          year: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          poster_url?: string | null
          rating_num?: number | null
          runtime_min?: number | null
          tags?: string[] | null
          title: string
          tmdb_id?: number | null
          year?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          poster_url?: string | null
          rating_num?: number | null
          runtime_min?: number | null
          tags?: string[] | null
          title?: string
          tmdb_id?: number | null
          year?: number | null
        }
        Relationships: []
      }
      movies_cache: {
        Row: {
          genres_es: string[] | null
          imdb_id: string | null
          overview_es: string | null
          poster_path: string | null
          raw: Json | null
          release_date: string | null
          runtime_min: number | null
          title_es: string
          tmdb_id: number
          updated_at: string
        }
        Insert: {
          genres_es?: string[] | null
          imdb_id?: string | null
          overview_es?: string | null
          poster_path?: string | null
          raw?: Json | null
          release_date?: string | null
          runtime_min?: number | null
          title_es: string
          tmdb_id: number
          updated_at?: string
        }
        Update: {
          genres_es?: string[] | null
          imdb_id?: string | null
          overview_es?: string | null
          poster_path?: string | null
          raw?: Json | null
          release_date?: string | null
          runtime_min?: number | null
          title_es?: string
          tmdb_id?: number
          updated_at?: string
        }
        Relationships: []
      }
      movies_slasher_cache: {
        Row: {
          genres_es: string[] | null
          imdb_id: string | null
          overview_es: string | null
          poster_path: string | null
          raw: Json | null
          release_date: string | null
          runtime_min: number | null
          title_es: string
          tmdb_id: number
          updated_at: string
        }
        Insert: {
          genres_es?: string[] | null
          imdb_id?: string | null
          overview_es?: string | null
          poster_path?: string | null
          raw?: Json | null
          release_date?: string | null
          runtime_min?: number | null
          title_es: string
          tmdb_id: number
          updated_at?: string
        }
        Update: {
          genres_es?: string[] | null
          imdb_id?: string | null
          overview_es?: string | null
          poster_path?: string | null
          raw?: Json | null
          release_date?: string | null
          runtime_min?: number | null
          title_es?: string
          tmdb_id?: number
          updated_at?: string
        }
        Relationships: []
      }
      movies_spooky_cache: {
        Row: {
          genres_es: string[] | null
          imdb_id: string | null
          overview_es: string | null
          poster_path: string | null
          raw: Json | null
          release_date: string | null
          runtime_min: number | null
          title_es: string
          tmdb_id: number
          updated_at: string
        }
        Insert: {
          genres_es?: string[] | null
          imdb_id?: string | null
          overview_es?: string | null
          poster_path?: string | null
          raw?: Json | null
          release_date?: string | null
          runtime_min?: number | null
          title_es: string
          tmdb_id: number
          updated_at?: string
        }
        Update: {
          genres_es?: string[] | null
          imdb_id?: string | null
          overview_es?: string | null
          poster_path?: string | null
          raw?: Json | null
          release_date?: string | null
          runtime_min?: number | null
          title_es?: string
          tmdb_id?: number
          updated_at?: string
        }
        Relationships: []
      }
      movies_supernatural_cache: {
        Row: {
          genres_es: string[] | null
          imdb_id: string | null
          overview_es: string | null
          poster_path: string | null
          raw: Json | null
          release_date: string | null
          runtime_min: number | null
          title_es: string
          tmdb_id: number
          updated_at: string
        }
        Insert: {
          genres_es?: string[] | null
          imdb_id?: string | null
          overview_es?: string | null
          poster_path?: string | null
          raw?: Json | null
          release_date?: string | null
          runtime_min?: number | null
          title_es: string
          tmdb_id: number
          updated_at?: string
        }
        Update: {
          genres_es?: string[] | null
          imdb_id?: string | null
          overview_es?: string | null
          poster_path?: string | null
          raw?: Json | null
          release_date?: string | null
          runtime_min?: number | null
          title_es?: string
          tmdb_id?: number
          updated_at?: string
        }
        Relationships: []
      }
      plan_days: {
        Row: {
          day_date: string
          id: string
          movie_id: string
          plan_id: string
          status: Database["public"]["Enums"]["plan_status"]
          unlocked_at: string | null
          watched_at: string | null
        }
        Insert: {
          day_date: string
          id?: string
          movie_id: string
          plan_id: string
          status?: Database["public"]["Enums"]["plan_status"]
          unlocked_at?: string | null
          watched_at?: string | null
        }
        Update: {
          day_date?: string
          id?: string
          movie_id?: string
          plan_id?: string
          status?: Database["public"]["Enums"]["plan_status"]
          unlocked_at?: string | null
          watched_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plan_days_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_days_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          cadence: string | null
          created_at: string
          end_date: string
          id: string
          name: string | null
          start_date: string
          user_id: string
        }
        Insert: {
          cadence?: string | null
          created_at?: string
          end_date: string
          id?: string
          name?: string | null
          start_date: string
          user_id: string
        }
        Update: {
          cadence?: string | null
          created_at?: string
          end_date?: string
          id?: string
          name?: string | null
          start_date?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          tz: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          tz?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          tz?: string
          user_id?: string
        }
        Relationships: []
      }
      search_cache: {
        Row: {
          q_normalized: string
          results: Json
          updated_at: string
        }
        Insert: {
          q_normalized: string
          results: Json
          updated_at?: string
        }
        Update: {
          q_normalized?: string
          results?: Json
          updated_at?: string
        }
        Relationships: []
      }
      share_links: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          plan_id: string
          token: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_id: string
          token: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "share_links_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_catalog: {
        Row: {
          allowed: boolean
          movie_id: string
          updated_at: string
          user_id: string
          weight: number
        }
        Insert: {
          allowed?: boolean
          movie_id: string
          updated_at?: string
          user_id: string
          weight?: number
        }
        Update: {
          allowed?: boolean
          movie_id?: string
          updated_at?: string
          user_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_catalog_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      shared_plan_days: {
        Row: {
          day_date: string | null
          id: string | null
          movie_id: string | null
          plan_id: string | null
          poster_url: string | null
          runtime_min: number | null
          status: Database["public"]["Enums"]["plan_status"] | null
          tags: string[] | null
          title: string | null
          token: string | null
          unlocked_at: string | null
          watched_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plan_days_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_days_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      plan_status: "locked" | "unlocked" | "watched" | "skipped"
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
  public: {
    Enums: {
      plan_status: ["locked", "unlocked", "watched", "skipped"],
    },
  },
} as const

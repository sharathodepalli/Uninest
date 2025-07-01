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
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          photo_url: string | null
          role: 'host' | 'seeker' | 'admin'
          university: string | null
          year: number | null
          bio: string | null
          phone: string | null
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          photo_url?: string | null
          role?: 'host' | 'seeker' | 'admin'
          university?: string | null
          year?: number | null
          bio?: string | null
          phone?: string | null
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          photo_url?: string | null
          role?: 'host' | 'seeker' | 'admin'
          university?: string | null
          year?: number | null
          bio?: string | null
          phone?: string | null
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      listings: {
        Row: {
          id: string
          host_id: string
          title: string
          description: string
          address: string
          latitude: number | null
          longitude: number | null
          rent: number
          deposit: number | null
          available_date: string
          photos_urls: string[]
          bedrooms: number
          bathrooms: number
          square_feet: number | null
          amenities: string[]
          preferences: Json
          status: 'active' | 'inactive' | 'pending' | 'rented'
          view_count: number
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          host_id: string
          title: string
          description: string
          address: string
          latitude?: number | null
          longitude?: number | null
          rent: number
          deposit?: number | null
          available_date: string
          photos_urls?: string[]
          bedrooms?: number
          bathrooms?: number
          square_feet?: number | null
          amenities?: string[]
          preferences?: Json
          status?: 'active' | 'inactive' | 'pending' | 'rented'
          view_count?: number
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          host_id?: string
          title?: string
          description?: string
          address?: string
          latitude?: number | null
          longitude?: number | null
          rent?: number
          deposit?: number | null
          available_date?: string
          photos_urls?: string[]
          bedrooms?: number
          bathrooms?: number
          square_feet?: number | null
          amenities?: string[]
          preferences?: Json
          status?: 'active' | 'inactive' | 'pending' | 'rented'
          view_count?: number
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          listing_id: string
          sender_id: string
          receiver_id: string
          content: string
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          sender_id: string
          receiver_id: string
          content: string
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          sender_id?: string
          receiver_id?: string
          content?: string
          read_at?: string | null
          created_at?: string
        }
      }
      listing_views: {
        Row: {
          id: string
          listing_id: string
          viewer_id: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          viewer_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          viewer_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          listing_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          listing_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          listing_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'host' | 'seeker' | 'admin'
      listing_status: 'active' | 'inactive' | 'pending' | 'rented'
    }
  }
}
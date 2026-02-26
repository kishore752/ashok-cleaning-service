export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type AppRole = 'customer' | 'employee' | 'admin'
export type SubmissionStatus =
  | 'new'
  | 'contacted'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
export type ReviewStatus = 'pending' | 'approved' | 'rejected'
export type NotificationType = 'confirmation' | 'update' | 'promo' | 'reminder'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: AppRole
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          email_notifications: boolean
          email_promos: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: AppRole
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          email_notifications?: boolean
          email_promos?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      contact_submissions: {
        Row: {
          id: string
          user_id: string | null
          first_name: string
          last_name: string
          email: string
          phone: string
          service_type: string | null
          message: string | null
          status: SubmissionStatus
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          first_name: string
          last_name: string
          email: string
          phone: string
          service_type?: string | null
          message?: string | null
          status?: SubmissionStatus
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['contact_submissions']['Insert']>
      }
      reviews: {
        Row: {
          id: string
          user_id: string | null
          author_name: string
          author_role: string | null
          rating: number
          comment: string
          service_type: string | null
          status: ReviewStatus
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          author_name: string
          author_role?: string | null
          rating: number
          comment: string
          service_type?: string | null
          status?: ReviewStatus
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
      employee_invites: {
        Row: {
          id: string
          email: string
          role: AppRole
          token: string
          created_by: string | null
          used_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          role?: AppRole
          token: string
          created_by?: string | null
          used_at?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['employee_invites']['Insert']>
      }
      notifications_log: {
        Row: {
          id: string
          user_id: string | null
          email: string | null
          type: NotificationType
          title: string
          body: string | null
          sent_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          email?: string | null
          type: NotificationType
          title: string
          body?: string | null
          sent_at?: string
        }
        Update: Partial<Database['public']['Tables']['notifications_log']['Insert']>
      }
    }
  }
}

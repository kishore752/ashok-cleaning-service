export type AppRole = 'customer' | 'employee' | 'admin'
export type SubmissionStatus =
  | 'new'
  | 'contacted'
  | 'scheduled'
  | 'in_progress'
  | 'pending_review'
  | 'completed'
  | 'cancelled'
export type ReviewStatus = 'pending' | 'approved' | 'rejected'
export type NotificationType = 'confirmation' | 'update' | 'promo' | 'reminder'

export interface Profile {
  id: string
  role: AppRole
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  email_notifications: boolean
  email_promos: boolean
  sms_optin: boolean
  created_at: string
  updated_at: string
}

export interface ContactSubmission {
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

export interface Review {
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

export interface EmployeeInvite {
  id: string
  email: string
  role: AppRole
  token: string
  created_by: string | null
  used_at: string | null
  created_at: string
}

export interface NotificationLog {
  id: string
  user_id: string | null
  email: string | null
  type: NotificationType
  title: string
  body: string | null
  sent_at: string
}

export interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  service: string
  message: string
}

export interface StatusUpdate {
  id: string
  submission_id: string
  old_status: string | null
  new_status: string
  note: string | null
  images: string[] | null
  updated_by: string | null
  updater_name?: string
  created_at: string
}

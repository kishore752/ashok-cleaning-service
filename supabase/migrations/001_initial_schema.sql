-- Ashok Cleaning Services: roles, storage, interactions, reviews, notifications
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor) for free-tier storage.

-- Custom types
CREATE TYPE app_role AS ENUM ('customer', 'employee', 'admin');
CREATE TYPE submission_status AS ENUM ('new', 'contacted', 'scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE notification_type AS ENUM ('confirmation', 'update', 'promo', 'reminder');

-- Profiles (extends auth.users): role and notification preferences
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'customer',
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  email_promos BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contact form submissions (free-tier storage for all customer-provided details)
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_type TEXT,
  message TEXT,
  status submission_status NOT NULL DEFAULT 'new',
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Real customer reviews (replaces system-generated testimonials)
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_role TEXT,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  service_type TEXT,
  status review_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Employee invites (admin creates; employee signs up with invite token)
CREATE TABLE public.employee_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  role app_role NOT NULL DEFAULT 'employee',
  token TEXT NOT NULL UNIQUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Notifications log (for sending ads/updates based on interactions)
CREATE TABLE public.notifications_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_contact_submissions_user_id ON public.contact_submissions(user_id);
CREATE INDEX idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);
CREATE INDEX idx_reviews_status ON public.reviews(status);
CREATE INDEX idx_reviews_created_at ON public.reviews(created_at DESC);
CREATE INDEX idx_notifications_log_user_id ON public.notifications_log(user_id);

-- RLS: enable
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications_log ENABLE ROW LEVEL SECURITY;

-- Profiles: users see own; employees/admins see all (for admin panel)
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins and employees can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'employee'))
  );

-- Contact submissions: anyone can insert (form); customers see own; employees/admin see all
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Customers see own submissions" ON public.contact_submissions
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'employee'))
  );

CREATE POLICY "Employees and admin can update submissions" ON public.contact_submissions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'employee'))
  );

-- Reviews: anyone can insert; public can read approved; admin can update (approve/reject)
CREATE POLICY "Anyone can submit review" ON public.reviews
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can read approved reviews" ON public.reviews
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can read own reviews" ON public.reviews
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can update reviews" ON public.reviews
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can read all reviews" ON public.reviews
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- Employee invites: only admin can manage
CREATE POLICY "Admins can manage invites" ON public.employee_invites
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- Notifications log: service role used from backend; optional read for users
CREATE POLICY "Users can read own notifications" ON public.notifications_log
  FOR SELECT USING (auth.uid() = user_id);

-- Trigger: create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RPC: use employee invite token (called by new user after signup)
CREATE OR REPLACE FUNCTION public.use_employee_invite(token_text TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inv record;
  uid uuid;
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  SELECT * INTO inv FROM public.employee_invites
  WHERE token = token_text AND used_at IS NULL
  LIMIT 1;
  IF inv IS NULL THEN
    RAISE EXCEPTION 'Invalid or already used invite';
  END IF;
  UPDATE public.profiles SET role = inv.role, updated_at = now() WHERE id = uid;
  UPDATE public.employee_invites SET used_at = now() WHERE id = inv.id;
END;
$$;

-- Optional: set first user as admin (run manually after first signup)
-- UPDATE public.profiles SET role = 'admin' WHERE id = 'YOUR_USER_UUID';
COMMENT ON TABLE public.contact_submissions IS 'Free-tier storage for all customer-provided details from contact form and interactions';

-- ==================================================
-- Ashok Cleaning Services – Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL)
-- ==================================================

-- ── 1. Profiles (extends auth.users) ───────────────────────────

create table if not exists public.profiles (
  id                  uuid references auth.users on delete cascade primary key,
  role                text not null default 'customer' check (role in ('customer','employee','admin')),
  full_name           text,
  phone               text,
  avatar_url          text,
  email_notifications boolean not null default true,
  email_promos        boolean not null default true,
  sms_optin           boolean not null default false,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

alter table public.profiles enable row level security;

-- Users read/update own profile
create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Helper function: get current user's role WITHOUT hitting RLS (breaks recursion)
create or replace function public.get_my_role()
returns text as $$
  select role from public.profiles where id = auth.uid();
$$ language sql security definer stable;

-- Employees and admins can read all profiles
create policy "Staff read all profiles"
  on public.profiles for select
  using (public.get_my_role() in ('employee','admin'));

-- Auto-create profile on signup via trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'customer'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ── 2. Contact Submissions ────────────────────────────────────

create table if not exists public.contact_submissions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references public.profiles(id) on delete set null,
  first_name    text not null,
  last_name     text not null,
  email         text not null,
  phone         text not null,
  service_type  text,
  message       text,
  status        text not null default 'new' check (status in ('new','contacted','scheduled','in_progress','pending_review','completed','cancelled')),
  assigned_to   uuid references public.profiles(id),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table public.contact_submissions enable row level security;

-- Clients see own submissions
create policy "Clients see own submissions"
  on public.contact_submissions for select
  using (user_id = auth.uid());

-- Anyone can insert (guest or logged-in)
create policy "Anyone can submit"
  on public.contact_submissions for insert
  with check (true);

-- Staff see all
create policy "Staff see all submissions"
  on public.contact_submissions for select
  using (public.get_my_role() in ('employee','admin'));

-- Staff update (status changes)
create policy "Staff update submissions"
  on public.contact_submissions for update
  using (public.get_my_role() in ('employee','admin'));


-- ── 3. Reviews ────────────────────────────────────────────────

create table if not exists public.reviews (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references public.profiles(id) on delete set null,
  author_name   text not null,
  author_role   text,
  rating        int not null check (rating between 1 and 5),
  comment       text not null,
  service_type  text,
  status        text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at    timestamptz default now()
);

alter table public.reviews enable row level security;

-- Approved reviews are publicly readable
create policy "Public read approved reviews"
  on public.reviews for select
  using (status = 'approved');

-- Authenticated users can insert reviews
create policy "Authenticated users insert reviews"
  on public.reviews for insert
  with check (auth.uid() is not null);

-- Staff can read all reviews (including pending)
create policy "Staff read all reviews"
  on public.reviews for select
  using (public.get_my_role() in ('employee','admin'));

-- Admin update reviews (approve/reject)
create policy "Admin update reviews"
  on public.reviews for update
  using (public.get_my_role() = 'admin');


-- ── 4. Employee Invites ──────────────────────────────────────

create table if not exists public.employee_invites (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  role        text not null default 'employee' check (role in ('employee','admin')),
  token       text not null unique,
  created_by  uuid references public.profiles(id),
  used_at     timestamptz,
  created_at  timestamptz default now()
);

alter table public.employee_invites enable row level security;

-- Only admin can read/insert invites
create policy "Admin manage invites"
  on public.employee_invites for all
  using (public.get_my_role() = 'admin');

-- RPC: use_employee_invite (called on signup with invite token)
create or replace function public.use_employee_invite(token_text text)
returns void as $$
declare
  inv record;
begin
  select * into inv from public.employee_invites
    where token = token_text and used_at is null;

  if inv is null then
    raise exception 'Invalid or expired invite token';
  end if;

  update public.profiles set role = inv.role where id = auth.uid();
  update public.employee_invites set used_at = now() where id = inv.id;
end;
$$ language plpgsql security definer;


-- ── 5. Notification Log ──────────────────────────────────────

create table if not exists public.notification_logs (
  id       uuid primary key default gen_random_uuid(),
  user_id  uuid references public.profiles(id) on delete set null,
  email    text,
  type     text not null check (type in ('confirmation','update','promo','reminder')),
  title    text not null,
  body     text,
  sent_at  timestamptz default now()
);

alter table public.notification_logs enable row level security;

-- Users see own notifications
create policy "Users see own notifications"
  on public.notification_logs for select
  using (user_id = auth.uid());

-- Staff can insert
create policy "Staff insert notifications"
  on public.notification_logs for insert
  with check (public.get_my_role() in ('employee','admin'));


-- ── 7. Status Updates (audit trail for milestone tracking) ───

create table if not exists public.status_updates (
  id              uuid primary key default gen_random_uuid(),
  submission_id   uuid references public.contact_submissions(id) on delete cascade,
  old_status      text,
  new_status      text not null,
  note            text,
  images          text[],
  updated_by      uuid references public.profiles(id),
  created_at      timestamptz default now()
);

alter table public.status_updates enable row level security;

-- Clients see updates for their own submissions
create policy "Clients see own status updates"
  on public.status_updates for select
  using (
    exists (
      select 1 from public.contact_submissions
      where id = submission_id and user_id = auth.uid()
    )
  );

-- Staff can insert status updates
create policy "Staff insert status updates"
  on public.status_updates for insert
  with check (public.get_my_role() in ('employee','admin'));

-- Staff can read all status updates
create policy "Staff read all status updates"
  on public.status_updates for select
  using (public.get_my_role() in ('employee','admin'));


-- ── 8. Enable Supabase Realtime on key tables ───────────────

alter publication supabase_realtime add table public.contact_submissions;
alter publication supabase_realtime add table public.status_updates;


-- ── 6. Seed Approved Reviews ─────────────────────────────────

insert into public.reviews (author_name, author_role, rating, comment, service_type, status, created_at)
values
  ('Sarah Mitchell', 'Homeowner', 5,
   'Ashok Cleaning transformed my home! Every corner was spotless and they even folded the towels into little swans. Absolutely worth every penny.',
   'house', 'approved', now() - interval '30 days'),
  ('James Chen', 'Office Manager', 5,
   'Reliable, professional, and thorough. Our office has never looked better. The team always works quietly and efficiently — highly recommend!',
   'office', 'approved', now() - interval '25 days'),
  ('Patricia Nguyen', 'Property Manager', 5,
   'The move-out clean was flawless. Helped our tenants get their full deposit back. I use Ashok for all our 12 properties now.',
   'movein', 'approved', now() - interval '20 days'),
  ('David Thompson', 'Restaurant Owner', 5,
   'Best commercial cleaning service in the area. Deep-cleaned our kitchen overnight — health inspectors gave us a perfect score the next morning!',
   'deep', 'approved', now() - interval '15 days'),
  ('Linda Hassan', 'New Homeowner', 5,
   'The post-construction clean was incredible. They removed every speck of dust and debris. My new home was truly move-in ready.',
   'construction', 'approved', now() - interval '12 days'),
  ('Maria Gonzalez', 'Condo Owner', 5,
   'I have been using Ashok for 3 years now and the quality has never dropped. They are courteous, on time, and my place smells amazing every time.',
   'house', 'approved', now() - interval '10 days'),
  ('Robert Kim', 'Startup Founder', 4,
   'Great service for our 5,000 sq ft office. The team was flexible with our schedule and worked after hours. Minor feedback: could dust the server room more carefully.',
   'office', 'approved', now() - interval '8 days'),
  ('Emily Patel', 'Homeowner', 5,
   'Hired them for a deep clean before Diwali and they exceeded every expectation. The grout in our bathrooms looks brand new! Will definitely use again.',
   'deep', 'approved', now() - interval '5 days'),
  ('Tom Richards', 'Real Estate Agent', 5,
   'I recommend Ashok to all my clients for move-in/move-out cleans. Professional, affordable, and they always deliver a show-ready property.',
   'movein', 'approved', now() - interval '3 days'),
  ('Priya Sharma', 'Working Parent', 5,
   'As a busy mom of two, Ashok Cleaning is a lifesaver. Their eco-friendly products mean I feel safe letting my toddler crawl on the freshly cleaned floors.',
   'eco', 'approved', now() - interval '1 day');

# Security review (pre–admin setup)

Summary of what was reviewed and fixed so it’s safe to create your admin role.

---

## Fixed issues

### 1. Role escalation (critical)

- **Risk:** A user could call the profile update with `role: 'admin'` and promote themselves.
- **Fixes:**
  - **Frontend:** `updateProfile()` no longer sends `role` or `id` to Supabase; only safe fields (e.g. notification prefs, name) are sent.
  - **Backend:** Run the migration `supabase/migrations/002_security_prevent_role_escalation.sql` in the Supabase SQL Editor. It adds a trigger so users cannot change their own `role`; only the employee-invite flow or your manual SQL can set roles.

**Action:** If you already ran `001_initial_schema.sql`, run `002_security_prevent_role_escalation.sql` in the SQL Editor now.

### 2. Open redirect

- **Risk:** A link like `/login?redirect=https://evil.com` could send a logged-in user to an external site after login.
- **Fix:** The router now only accepts redirect targets that are same-origin paths (start with `/` and not `//`). Anything else is replaced with `/dashboard`.

---

## Already in good shape

- **.env / secrets:** `.env` and `.env.local` are in `.gitignore`; do not commit them. Use Netlify (or similar) env vars in production.
- **Supabase keys:** Only the **Publishable** key is used in the frontend (`VITE_SUPABASE_ANON_KEY`). The **Secret** key must never be in the frontend or in `VITE_*` vars.
- **RLS:** Row Level Security is enabled and policies restrict who can read/update what (customers see only their data; admin/employee policies are correct).
- **Auth:** Admin/employee routes are protected by router guards and by RLS; the database enforces access even if someone bypasses the UI.
- **Employee invites:** Invite tokens are random, single-use, and applied only via the `use_employee_invite` RPC after signup.

---

## Optional hardening

- **Contact form / send-email:** The Netlify function that sends email has no auth; anyone who can hit the URL could trigger emails. To reduce abuse you can add rate limiting in Netlify or require a shared secret header that only your frontend sends.
- **Password rules:** Supabase’s default password rules apply; you can tighten them under Authentication → Settings in the dashboard if you want (e.g. minimum length, complexity).

---

## Safe way to create your admin role

1. Run `002_security_prevent_role_escalation.sql` in Supabase if you haven’t already.
2. Sign up once in the app with the account you want as admin.
3. In Supabase: **Authentication** → **Users** → copy that user’s **UUID**.
4. In **SQL Editor** run (replace with your UUID):
   ```sql
   UPDATE public.profiles SET role = 'admin' WHERE id = 'your-user-uuid-here';
   ```
5. Log in again (or refresh). Only this user (and anyone you promote the same way) can access the Admin area; no one can self-assign the admin role.

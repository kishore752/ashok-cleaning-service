# Run the service locally

After running the Supabase migration (and seeing "Success. No rows returned"), follow these steps.

## 1. Get your Supabase keys

1. Open your [Supabase Dashboard](https://supabase.com/dashboard) and select your project.
2. Go to **Project Settings** (gear icon) → **API**.
3. Copy:
   - **Project URL** (e.g. `https://abcdefgh.supabase.co`)
   - **Publishable** key (the one safe for browser/frontend — *do not* use the Secret key here).

## 2. Set environment variables

In the project root, edit **`.env`** and replace the placeholders:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Paste your real **Project URL** and **Publishable** key. Save the file.  
*(The env var is still `VITE_SUPABASE_ANON_KEY`; use the Publishable key as its value. Do **not** use the Secret key in the frontend.)*

## 3. Start the app

```bash
npm run dev
```

Open the URL shown (e.g. `http://localhost:5173`). You should see the site with **Login** / **Sign up** in the header.

## 4. Create your first account (and make yourself admin)

1. Click **Sign up** and create an account (email + password).
2. In Supabase Dashboard go to **Authentication** → **Users** and copy your user **UUID**.
3. Open **SQL Editor** and run (replace with your UUID):

   ```sql
   UPDATE public.profiles SET role = 'admin' WHERE id = 'your-user-uuid-here';
   ```

4. Refresh the app and log in again. You should see **Admin** in the header and be able to open **Admin** to invite employees, manage submissions, and approve reviews.

## 5. Optional: test the contact form and Netlify functions locally

To run the contact form and email/notification functions locally:

```bash
npx netlify dev
```

Use the URL it prints (e.g. `http://localhost:8888`). Ensure your `.env` has valid `SENDGRID_*` and `ADMIN_EMAIL` for the contact form to send emails.

---

**Troubleshooting**

- **"Supabase env missing" in console**  
  Restart the dev server after changing `.env` (`Ctrl+C` then `npm run dev` again). Vite only reads env at startup.

- **Login/Sign up does nothing or errors**  
  Confirm you used the **Publishable** key (not the Secret) for `VITE_SUPABASE_ANON_KEY`, and that the migration was run in the same Supabase project.

- **Dashboard is empty**  
  Submit a request via the Contact form (logged in or not). If logged in, it will appear under **Dashboard** → Previous interactions.

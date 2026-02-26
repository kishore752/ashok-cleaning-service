# Ashok Cleaning Services

A professional cleaning services website built with Vue 3 and TypeScript.

## About Us

Ashok Cleaning Services provides professional cleaning solutions for homes and offices. Our experienced team uses eco-friendly products and modern techniques to deliver exceptional cleaning results.

## Services

- Residential Cleaning
- Office Cleaning
- Deep Cleaning
- Post-Construction Cleaning
- Carpet Cleaning
- Window Cleaning

## Features

- Modern, responsive design
- Easy quote request system
- Professional image gallery
- Contact form with email notifications
- Mobile-friendly interface
- Automated deployment with GitHub Actions

## Technology Stack

- Vue 3
- TypeScript
- Vite
- Pinia (auth state)
- Supabase (optional): auth, roles, free-tier storage, real reviews
- Netlify Functions + SendGrid (email and notifications)
- GitHub Actions for CI/CD

## Backend & auth (optional)

To enable **secured backend with roles**, **customer history**, **real reviews**, and **notification service**:

1. **Supabase (free tier)**  
   - Create a project at [supabase.com](https://supabase.com).  
   - In SQL Editor, run the migration: `supabase/migrations/001_initial_schema.sql`.  
   - In Project Settings → API, copy **Project URL** and **Publishable** key (use this for the frontend; do not use the Secret key).

2. **Environment variables**  
   - **Local:** create `.env` or `.env.local` with:
     - `VITE_SUPABASE_URL=` your project URL  
     - `VITE_SUPABASE_ANON_KEY=` your **Publishable** key  
   - **Netlify:** add the same `VITE_*` vars and your existing SendGrid/email vars.  
   - Optional: `SEND_CUSTOMER_CONFIRMATION=true` to email customers a confirmation when they submit the contact form.  
   - Optional: `NOTIFICATION_SECRET` to protect the `/.netlify/functions/send-notification` endpoint (for ads/updates).

3. **First admin**  
   After signing up your first user, in Supabase SQL Editor run:
   ```sql
   UPDATE public.profiles SET role = 'admin' WHERE id = 'YOUR_USER_UUID';
   ```
   (Find your user UUID in Authentication → Users.)

4. **Roles**  
   - **Customer:** sign up or log in; use Dashboard to see previous interactions and notification preferences.  
   - **Employee:** admin creates an invite (Admin → Invite employee), then the employee signs up via the invite link.  
   - **Admin:** manage employees, submissions, and approve/reject reviews.

5. **Notifications**  
   - Contact form submissions can send a confirmation email when `SEND_CUSTOMER_CONFIRMATION=true`.  
   - Use `POST /.netlify/functions/send-notification` with `{ "to": "email", "title": "...", "body": "..." }` (and optional `Authorization: Bearer NOTIFICATION_SECRET`) to send updates or promos; hook this to a cron or Supabase webhook for behavior based on user interactions.

## Development

```sh
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment Status

[![Netlify Status](https://api.netlify.com/api/v1/badges/644ad5ee-c0f2-4329-9408-b93821f209eb/deploy-status)](https://app.netlify.com/sites/guileless-belekoy-267fdf/deploys)

## Contact

For more information about our services, please visit our website or contact us directly.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

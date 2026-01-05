# Supabase Setup Guide

## Step-by-Step Instructions

### 1. Create Supabase Account & Project

1. Go to **https://supabase.com**
2. Click **"Start your project"** or **"Sign up"**
3. Sign up with GitHub (recommended) or email
4. Click **"New Project"**
5. Fill in:
   - **Name**: MEFE (or any name you like)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free (Hobby) is perfect for development
6. Click **"Create new project"**
7. Wait 2-3 minutes for the project to be created

### 2. Get Your Connection String

1. Once your project is ready, go to **Settings** (gear icon in left sidebar)
2. Click **"Database"** in the settings menu
3. Scroll down to **"Connection string"**
4. Select **"URI"** tab
5. Copy the connection string (it looks like this):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
6. **Important**: Replace `[YOUR-PASSWORD]` with the database password you created in step 1

### 3. Update Your .env File

Open the `.env` file in the project root and update the `DATABASE_URL`:

```env
DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
```

Replace:
- `YOUR_ACTUAL_PASSWORD` with your database password
- The rest of the connection string with what you copied from Supabase

### 4. Set Up the Database Schema

After updating `.env`, run:

```bash
npx prisma db push
```

This will create all the necessary tables in your Supabase database.

### 5. Start the App

```bash
npm run dev
```

## Quick Checklist

- [ ] Created Supabase account
- [ ] Created new project
- [ ] Saved database password
- [ ] Copied connection string from Settings → Database
- [ ] Updated `.env` file with connection string (replaced [YOUR-PASSWORD])
- [ ] Ran `npx prisma db push`
- [ ] Started app with `npm run dev`

## Need Help?

If you get stuck:
- Make sure you replaced `[YOUR-PASSWORD]` in the connection string
- Check that your Supabase project is fully created (green status)
- Verify the connection string format matches exactly what Supabase shows







# 🚀 Quick Start Guide

## Step 1: Set Up Environment Variables

Create a `.env` file in the root directory with the following content:

```env
# Database Connection
# Option 1: Use Supabase (Free - Recommended)
# Get your connection string from: https://supabase.com/dashboard
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres"

# Option 2: Use Neon (Free - Recommended for Serverless)
# Get your connection string from: https://neon.tech
# DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"

# Option 3: Local PostgreSQL
# DATABASE_URL="postgresql://username:password@localhost:5432/mefe?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="Q6B1z6z/Bm86WrB9zvfCZASXxWMMqCKZQ7BPVUy6P+g="

# Optional: Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Optional: OpenAI API (for AI outfit suggestions)
OPENAI_API_KEY=""
```

### Quick Database Setup Options:

#### Option A: Supabase (Easiest - 2 minutes)
1. Go to https://supabase.com
2. Sign up (free)
3. Create a new project
4. Go to Settings → Database
5. Copy the connection string (looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`)
6. Replace `[YOUR-PASSWORD]` with your database password
7. Paste into `.env` as `DATABASE_URL`

#### Option B: Neon (Great for Serverless)
1. Go to https://neon.tech
2. Sign up (free)
3. Create a new project
4. Copy the connection string
5. Paste into `.env` as `DATABASE_URL`

#### Option C: Local PostgreSQL
1. Install PostgreSQL: `brew install postgresql` (Mac) or download from postgresql.org
2. Start PostgreSQL: `brew services start postgresql`
3. Create database: `createdb mefe`
4. Use: `DATABASE_URL="postgresql://$(whoami)@localhost:5432/mefe?schema=public"`

## Step 2: Set Up Database Schema

Once you have your `.env` file with `DATABASE_URL` set, run:

```bash
npx prisma db push
```

This will create all the necessary tables in your database.

## Step 3: Start the App

```bash
npm run dev
```

Open http://localhost:3000 in your browser!

## Step 4: Sign In

You can sign in with:
- **Email/Password**: Use any email (demo mode - no password required)
- **Google**: If you set up Google OAuth credentials

## What's Next?

1. **Add wardrobe items**: Go to Wardrobe page and upload your clothing
2. **Create outfits**: Combine items into outfits
3. **Plan outfits**: Schedule outfits on the calendar
4. **Log moods**: Track how different looks make you feel
5. **View insights**: See patterns in your style-mood connections
6. **Get AI suggestions**: Ask for outfit recommendations based on desired mood

## Troubleshooting

### "Can't reach database server"
- Make sure your DATABASE_URL is correct
- For Supabase/Neon, check that your project is active
- For local PostgreSQL, make sure it's running: `pg_isready`

### "Prisma Client not generated"
Run: `npx prisma generate`

### "NEXTAUTH_SECRET not set"
The secret is already generated in the example above. Make sure it's in your `.env` file.

## Need Help?

Check `SETUP.md` for detailed setup instructions.








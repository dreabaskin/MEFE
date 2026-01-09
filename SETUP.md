# MEFE App Setup Guide

## Quick Setup

### Option 1: Automated Setup (Recommended)

Run the setup script:
```bash
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

Follow these steps:

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then update `.env` with your actual values:

### Required Variables

```env
# Database - Choose one option:

# Option A: Local PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/mefe?schema=public"

# Option B: Supabase (Free tier available)
# Get connection string from: https://supabase.com/dashboard/project/_/settings/database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres"

# Option C: Neon (Free tier available)
# Get connection string from: https://neon.tech
DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-key-here-generate-with-openssl-rand-base64-32"

# Optional: Google OAuth (for Google sign-in)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Optional: OpenAI API (for AI outfit suggestions)
OPENAI_API_KEY=""
```

### Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

## 3. Set Up Database

### Option A: Local PostgreSQL

1. Install PostgreSQL:
   - macOS: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`
   - Windows: Download from https://www.postgresql.org/download/

2. Create database:
```bash
createdb mefe
# Or using psql:
psql -U postgres
CREATE DATABASE mefe;
\q
```

3. Update DATABASE_URL in `.env`

### Option B: Supabase (Recommended for Quick Start)

1. Go to https://supabase.com
2. Create a free account
3. Create a new project
4. Go to Settings > Database
5. Copy the connection string
6. Update DATABASE_URL in `.env`

### Option C: Neon (Recommended for Serverless)

1. Go to https://neon.tech
2. Create a free account
3. Create a new project
4. Copy the connection string
5. Update DATABASE_URL in `.env`

## 4. Initialize Database Schema

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push
```

## 5. (Optional) Set Up Google OAuth

1. Go to https://console.cloud.google.com
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env`

## 6. (Optional) Set Up OpenAI API

1. Go to https://platform.openai.com
2. Create an account
3. Get your API key from https://platform.openai.com/api-keys
4. Add to `.env` as `OPENAI_API_KEY`

## 7. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Troubleshooting

### Database Connection Issues

- Make sure PostgreSQL is running: `pg_isready`
- Check your DATABASE_URL format
- For Supabase/Neon, ensure SSL is enabled

### Prisma Issues

- Run `npx prisma generate` if you see Prisma Client errors
- Run `npx prisma db push` to sync schema

### NextAuth Issues

- Make sure NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your app URL

## Database Management

View your database:
```bash
npx prisma studio
```

Reset database (WARNING: Deletes all data):
```bash
npx prisma migrate reset
```

## Need Help?

- Check the README.md for more information
- Prisma docs: https://www.prisma.io/docs
- Next.js docs: https://nextjs.org/docs








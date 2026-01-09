# MEFE Deployment Guide

## Step 1: Initialize Git Repository

If git is not initialized, run:
```bash
git init
git add .
git commit -m "Initial commit: MEFE app ready for deployment"
```

## Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `mefe` (or your preferred name)
3. **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Copy the repository URL (e.g., `https://github.com/yourusername/mefe.git`)

## Step 3: Push to GitHub

```bash
git remote add origin https://github.com/yourusername/mefe.git
git branch -M main
git push -u origin main
```

## Step 4: Deploy to Vercel (Recommended for Next.js)

### Option A: Deploy via Vercel Dashboard (Easiest)

1. Go to https://vercel.com
2. Sign up/Login with your GitHub account
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure environment variables (see below)
6. Click "Deploy"

### Option B: Deploy via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

## Step 5: Environment Variables

You'll need to add these in Vercel Dashboard → Settings → Environment Variables:

### Required:
- `DATABASE_URL` - Your PostgreSQL connection string (Supabase/Neon)
- `NEXTAUTH_URL` - Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`

### Optional:
- `GOOGLE_CLIENT_ID` - For Google OAuth
- `GOOGLE_CLIENT_SECRET` - For Google OAuth
- `OPENAI_API_KEY` - For AI suggestions

## Step 6: Database Setup

1. Make sure your database (Supabase/Neon) is accessible from Vercel
2. Run migrations on production:
   ```bash
   npx prisma migrate deploy
   ```
   Or use Vercel's build command to auto-migrate

## Step 7: Update Vercel Build Settings

In Vercel Dashboard → Settings → General → Build & Development Settings:

**Build Command:**
```bash
npm run build
```

**Install Command:**
```bash
npm install
```

**Output Directory:**
```
.next
```

## Step 8: Post-Deployment Checklist

- [ ] Test all pages load correctly
- [ ] Test authentication (sign in/sign up)
- [ ] Test database connections
- [ ] Update `NEXTAUTH_URL` to production URL
- [ ] Test image uploads (if using Cloudinary)
- [ ] Verify environment variables are set
- [ ] Check that Prisma migrations ran successfully

## Troubleshooting

### Build Errors
- Check that all environment variables are set
- Verify `DATABASE_URL` is correct
- Ensure Prisma Client is generated: `npx prisma generate`

### Database Connection Issues
- Verify database allows connections from Vercel IPs
- Check SSL is enabled in connection string
- Ensure database is not paused (for free tiers)

### Authentication Issues
- Verify `NEXTAUTH_URL` matches your deployment URL
- Check `NEXTAUTH_SECRET` is set
- Update OAuth redirect URLs in Google Console

## Alternative Deployment Options

### Netlify
- Similar to Vercel
- Good for Next.js apps
- Free tier available

### Railway
- Includes database hosting
- Easy PostgreSQL setup
- Good for full-stack apps

### Render
- Free tier available
- Automatic deployments from GitHub
- PostgreSQL included

## Need Help?

If you encounter issues:
1. Check Vercel build logs
2. Verify all environment variables
3. Test database connection
4. Check Next.js documentation for deployment






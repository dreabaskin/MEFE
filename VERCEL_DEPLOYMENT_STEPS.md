# Step-by-Step Vercel Deployment Guide

## Part 1: Push Code to GitHub

### Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `mefe` (or any name you prefer)
3. Description: "MEFE - Your Digital Closet & Emotional Wellness Styling"
4. Choose: **Public** or **Private** (your choice)
5. **IMPORTANT**: Do NOT check "Add a README file"
6. Click **"Create repository"**

### Step 2: Copy Repository URL
After creating, GitHub will show you a URL like:
```
https://github.com/yourusername/mefe.git
```
Copy this URL - you'll need it!

### Step 3: Push Your Code (Run in Terminal)

Open Terminal and navigate to your project:
```bash
cd /Users/johanadiaz/MEFE\ 
```

Then run these commands one by one:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: MEFE app"

# Connect to GitHub (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/mefe.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**Note**: When you run `git push`, GitHub will ask for your credentials:
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your GitHub password)
  - Create one at: https://github.com/settings/tokens
  - Click "Generate new token (classic)"
  - Give it a name like "MEFE Deployment"
  - Select scope: `repo` (full control)
  - Click "Generate token"
  - Copy the token and use it as your password

---

## Part 2: Deploy to Vercel

### Step 1: Sign Up for Vercel
1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### Step 2: Import Your Project
1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. You'll see your GitHub repositories
3. Find and click **"Import"** next to your `mefe` repository

### Step 3: Configure Project
Vercel will auto-detect Next.js settings, but verify:

**Framework Preset**: Next.js (should be auto-detected)

**Root Directory**: `./` (leave as default)

**Build Command**: `npm run build` (should be auto-filled)

**Output Directory**: `.next` (should be auto-filled)

**Install Command**: `npm install` (should be auto-filled)

### Step 4: Add Environment Variables
Click **"Environment Variables"** and add these:

#### Required Variables:

1. **DATABASE_URL**
   - Name: `DATABASE_URL`
   - Value: Your PostgreSQL connection string (from Supabase/Neon)
   - Example: `postgresql://user:password@host:5432/dbname?sslmode=require`
   - Add to: Production, Preview, Development (check all three)

2. **NEXTAUTH_URL**
   - Name: `NEXTAUTH_URL`
   - Value: Leave empty for now (Vercel will auto-fill after first deploy)
   - Or use: `https://your-app-name.vercel.app` (after first deploy)
   - Add to: Production, Preview, Development

3. **NEXTAUTH_SECRET**
   - Name: `NEXTAUTH_SECRET`
   - Value: Generate one by running in terminal:
     ```bash
     openssl rand -base64 32
     ```
   - Copy the output and paste as the value
   - Add to: Production, Preview, Development

#### Optional Variables (if you're using them):

4. **GOOGLE_CLIENT_ID**
   - Name: `GOOGLE_CLIENT_ID`
   - Value: Your Google OAuth Client ID
   - Add to: Production, Preview, Development

5. **GOOGLE_CLIENT_SECRET**
   - Name: `GOOGLE_CLIENT_SECRET`
   - Value: Your Google OAuth Client Secret
   - Add to: Production, Preview, Development

6. **OPENAI_API_KEY**
   - Name: `OPENAI_API_KEY`
   - Value: Your OpenAI API key (if using AI features)
   - Add to: Production, Preview, Development

### Step 5: Deploy!
1. Click **"Deploy"** button
2. Wait 2-3 minutes for build to complete
3. You'll see a success message with your live URL!

### Step 6: Update NEXTAUTH_URL
After first deployment:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Find `NEXTAUTH_URL`
3. Update value to: `https://your-actual-vercel-url.vercel.app`
4. Redeploy (or it will auto-redeploy)

---

## Part 3: Database Setup

### If using Supabase:
1. Your database should already be accessible
2. Make sure connection string includes `?sslmode=require`
3. Vercel can connect to Supabase automatically

### If using Neon:
1. Your database should already be accessible
2. Connection string should work from Vercel
3. No additional setup needed

### Run Database Migrations:
After deployment, you may need to run:
```bash
npx prisma migrate deploy
```

Or add this to Vercel's build command:
```bash
npm run build && npx prisma migrate deploy
```

---

## Troubleshooting

### Build Fails
- Check Vercel build logs for errors
- Verify all environment variables are set
- Make sure `DATABASE_URL` is correct

### Database Connection Issues
- Verify database allows external connections
- Check SSL is enabled in connection string
- Ensure database isn't paused (free tiers)

### Authentication Not Working
- Verify `NEXTAUTH_URL` matches your Vercel URL
- Check `NEXTAUTH_SECRET` is set
- Update OAuth redirect URLs in Google Console

---

## Success! 🎉

Once deployed, your app will be live at:
`https://your-app-name.vercel.app`

Vercel will automatically:
- Deploy on every git push
- Provide HTTPS
- Handle CDN
- Scale automatically





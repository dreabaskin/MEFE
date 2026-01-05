# Quick Deploy to Vercel - Step by Step

## 🚀 Fastest Way: Use Vercel CLI (Recommended)

### Option 1: Deploy Directly from Your Computer

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```
   (This will open your browser to authenticate)

3. **Deploy:**
   ```bash
   cd /Users/johanadiaz/MEFE\ 
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project? **No** (first time)
   - Project name? **mefe** (or press Enter)
   - Directory? **./** (press Enter)
   - Override settings? **No** (press Enter)

4. **Add Environment Variables:**
   After first deploy, run:
   ```bash
   vercel env add DATABASE_URL
   vercel env add NEXTAUTH_SECRET
   vercel env add NEXTAUTH_URL
   ```
   (It will ask for values - paste them)

5. **Redeploy with env vars:**
   ```bash
   vercel --prod
   ```

---

## 📦 Alternative: GitHub + Vercel Dashboard

### Step 1: Push to GitHub

**Option A: Using Terminal (if git works)**

```bash
cd /Users/johanadiaz/MEFE\ 

# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/mefe.git
git branch -M main
git push -u origin main
```

**Option B: Using GitHub Desktop (Easier!)**

1. Download GitHub Desktop: https://desktop.github.com
2. Install and sign in with your GitHub account
3. Click "File" → "Add Local Repository"
4. Browse to: `/Users/johanadiaz/MEFE `
5. Click "Publish repository"
6. Choose name: `mefe`
7. Click "Publish repository"

### Step 2: Deploy on Vercel

1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "Add New Project"
4. Find your `mefe` repository
5. Click "Import"
6. Add environment variables (see below)
7. Click "Deploy"

---

## 🔑 Environment Variables Needed

In Vercel Dashboard → Settings → Environment Variables, add:

### Required:
1. **DATABASE_URL**
   - Your PostgreSQL connection string
   - Get from Supabase/Neon dashboard

2. **NEXTAUTH_SECRET**
   - Generate: `openssl rand -base64 32`
   - Or use any random 32+ character string

3. **NEXTAUTH_URL**
   - After first deploy, use: `https://your-app.vercel.app`
   - Or leave empty for first deploy, then update

### Optional:
4. **GOOGLE_CLIENT_ID** (if using Google sign-in)
5. **GOOGLE_CLIENT_SECRET** (if using Google sign-in)
6. **OPENAI_API_KEY** (if using AI features)

---

## ✅ After Deployment

1. Your site will be live at: `https://your-app.vercel.app`
2. Test all features
3. Update `NEXTAUTH_URL` to your actual Vercel URL
4. Update Google OAuth redirect URL to: `https://your-app.vercel.app/api/auth/callback/google`

---

## 🆘 Need Help?

If you get stuck:
- Check Vercel build logs
- Verify environment variables are set
- Make sure database is accessible from internet
- Check that Prisma Client is generated





# 🚀 Deployment Checklist

## Required Environment Variables

Before deploying, make sure you have these ready:

### 1. **DATABASE_URL** (Required)
- Your PostgreSQL connection string
- Format: `postgresql://user:password@host:5432/dbname?sslmode=require`
- Get from: Supabase/Neon dashboard

### 2. **NEXTAUTH_SECRET** (Required)
- Generate with: `openssl rand -base64 32`
- Or any random 32+ character string
- Used for JWT token encryption

### 3. **NEXTAUTH_URL** (Required)
- Will be: `https://your-app-name.vercel.app`
- Set this AFTER first deployment
- Or leave empty for first deploy, then update

### 4. **GOOGLE_CLIENT_ID** (Optional - if using Google sign-in)
- From Google Cloud Console
- OAuth 2.0 Client ID

### 5. **GOOGLE_CLIENT_SECRET** (Optional - if using Google sign-in)
- From Google Cloud Console
- OAuth 2.0 Client Secret

### 6. **OPENAI_API_KEY** (Optional - if using AI features)
- From OpenAI dashboard
- For AI outfit suggestions

---

## Quick Deploy Steps

1. **Login to Vercel:**
   ```bash
   npx vercel login
   ```

2. **Deploy:**
   ```bash
   npx vercel
   ```
   - Link to existing project? → **No**
   - Project name? → **mefe** (or press Enter)
   - Directory? → **./** (press Enter)

3. **Add Environment Variables:**
   After first deploy, add them in Vercel dashboard:
   - Go to: Project → Settings → Environment Variables
   - Add each variable above

4. **Redeploy:**
   ```bash
   npx vercel --prod
   ```

---

## After Deployment

1. ✅ Update `NEXTAUTH_URL` to your actual Vercel URL
2. ✅ Update Google OAuth redirect URL to: `https://your-app.vercel.app/api/auth/callback/google`
3. ✅ Test all features
4. ✅ Check database connection




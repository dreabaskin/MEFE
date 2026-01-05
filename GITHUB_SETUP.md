# 🐙 Push to GitHub - Step by Step

## Step 1: Create GitHub Repository

1. Go to: **https://github.com/new**
2. Repository name: `mefe` (or any name you prefer)
3. Description: "MEFE - Your Digital Closet & Emotional Wellness Styling"
4. Choose: **Public** or **Private** (your choice)
5. ⚠️ **IMPORTANT**: Do NOT check "Add a README file"
6. ⚠️ **IMPORTANT**: Do NOT check "Add .gitignore" (we already have one)
7. ⚠️ **IMPORTANT**: Do NOT check "Choose a license"
8. Click **"Create repository"**

## Step 2: Copy Repository URL

After creating, GitHub will show you commands. You'll see a URL like:
```
https://github.com/YOUR_USERNAME/mefe.git
```

Copy this URL - you'll need it!

## Step 3: Connect and Push

Run these commands in your terminal (replace YOUR_USERNAME with your GitHub username):

```bash
cd /Users/johanadiaz/MEFE\ 

# Connect to GitHub
git remote add origin https://github.com/YOUR_USERNAME/mefe.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 4: Authentication

When you run `git push`, GitHub will ask for credentials:

- **Username**: Your GitHub username
- **Password**: Use a **Personal Access Token** (NOT your GitHub password)

### How to Create Personal Access Token:

1. Go to: **https://github.com/settings/tokens**
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `MEFE Deployment`
4. Select scope: Check **`repo`** (full control of private repositories)
5. Click **"Generate token"**
6. **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)
7. Use this token as your password when pushing

---

## Alternative: Use GitHub Desktop (Easier!)

If you prefer a visual interface:

1. Download: **https://desktop.github.com**
2. Install and sign in with your GitHub account
3. Click **"File"** → **"Add Local Repository"**
4. Browse to: `/Users/johanadiaz/MEFE `
5. Click **"Publish repository"**
6. Choose name: `mefe`
7. Click **"Publish repository"**

---

## After Pushing to GitHub

Once your code is on GitHub, you can:

1. **Import to Vercel:**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Find your `mefe` repository
   - Click "Import"

2. **Add Environment Variables** in Vercel dashboard
3. **Deploy!**




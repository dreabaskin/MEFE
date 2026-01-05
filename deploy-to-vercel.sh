#!/bin/bash

echo "🚀 MEFE - Vercel Deployment Helper"
echo "===================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI installed!"
    echo ""
fi

echo "🔐 Step 1: Login to Vercel"
echo "This will open your browser..."
vercel login

echo ""
echo "📤 Step 2: Deploying to Vercel..."
echo "Follow the prompts:"
echo "  - Link to existing project? → No (first time)"
echo "  - Project name? → mefe (or press Enter)"
echo "  - Directory? → ./ (press Enter)"
echo ""
vercel

echo ""
echo "✅ Deployment started!"
echo ""
echo "📝 Next steps:"
echo "1. After deployment, add environment variables in Vercel dashboard:"
echo "   - DATABASE_URL"
echo "   - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)"
echo "   - NEXTAUTH_URL (your Vercel URL)"
echo ""
echo "2. Redeploy: vercel --prod"
echo ""





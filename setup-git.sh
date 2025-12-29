#!/bin/bash

# MEFE Git Setup Script
# Run this script to initialize git and prepare for GitHub

echo "🚀 Setting up Git repository for MEFE..."

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: MEFE app ready for deployment"

echo ""
echo "✅ Git repository initialized!"
echo ""
echo "📝 Next steps:"
echo "1. Go to https://github.com/new"
echo "2. Create a new repository (don't initialize with README)"
echo "3. Copy the repository URL"
echo "4. Run these commands:"
echo "   git remote add origin YOUR_REPO_URL"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "Then follow the DEPLOYMENT_GUIDE.md for deployment instructions!"



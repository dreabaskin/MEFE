#!/bin/bash

echo "🚀 Setting up MEFE App..."

# Check if .env exists
if [ ! -f .env ]; then
  echo "📝 Creating .env file..."
  cp .env.example .env
  echo "✅ Created .env file. Please update it with your database credentials."
else
  echo "✅ .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Check if DATABASE_URL is set
if grep -q "postgresql://user:password@localhost" .env; then
  echo "⚠️  WARNING: Please update DATABASE_URL in .env with your actual database connection string"
  echo ""
  echo "For local development, you can use:"
  echo "  - PostgreSQL: postgresql://username:password@localhost:5432/mefe"
  echo "  - Or use a service like Supabase, Neon, or Railway"
  echo ""
  read -p "Have you updated the DATABASE_URL? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please update .env and run: npx prisma db push"
    exit 1
  fi
fi

# Push database schema
echo "🗄️  Setting up database schema..."
npx prisma db push

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Make sure your database is running"
echo "2. Update .env with your API keys (OPENAI_API_KEY, etc.)"
echo "3. Run 'npm run dev' to start the development server"
echo ""







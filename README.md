# MEFE - Your Digital Closet & Emotional Wellness Styling

MEFE helps you understand how clothing affects your mood, confidence, and identity. Dress with intention.

## Features

- 👕 **Digital Wardrobe**: Organize and manage your clothing items
- 👔 **Outfit Builder**: Create and save outfit combinations
- 📅 **Calendar Planning**: Plan outfits for upcoming events
- 😊 **Mood Tracking**: Log how different outfits make you feel
- 📊 **Insights & Analytics**: Discover patterns in your style and mood
- 🔍 **Discover**: Find inspiration and save outfits
- 👥 **Community**: Share and discover outfit inspiration
- 🌍 **Multi-language**: Support for multiple languages

## Tech Stack

- **Framework**: Next.js 14
- **Database**: PostgreSQL (via Prisma)
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (Supabase, Neon, or local)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mefe.git
cd mefe
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update `.env` with your values:
```env
DATABASE_URL="your-postgresql-connection-string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

5. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

## Project Structure

```
/app              # Next.js app directory
  /api            # API routes
  /auth           # Authentication pages
  /dashboard      # Dashboard page
  /wardrobe       # Wardrobe management
  /outfits        # Outfit builder
  /calendar       # Calendar planning
  /mood           # Mood tracking
  /insights       # Analytics
  /community      # Community feed
  /search         # Discover page
/components       # React components
/lib              # Utilities and configurations
/prisma           # Database schema
/public           # Static assets
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.

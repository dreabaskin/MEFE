# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MEFE is a Next.js 14 full-stack application for digital wardrobe management and emotional wellness styling. Users can manage clothing items, create outfits, track moods, plan outfits on a calendar, and receive AI-powered outfit suggestions.

## Common Commands

```bash
npm run dev          # Start development server at http://localhost:3000
npm run build        # Production build (runs prisma generate && next build)
npm run lint         # Run ESLint
npm run db:push      # Push Prisma schema to database without migrations
npm run db:studio    # Open Prisma Studio GUI for database inspection
npm run db:generate  # Generate Prisma Client
```

## Architecture

### Tech Stack
- **Frontend**: Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL
- **Auth**: NextAuth.js with JWT sessions (Google OAuth + credentials)
- **AI**: OpenAI API for outfit suggestions
- **Images**: Cloudinary for storage/optimization

### Directory Structure
```
src/
├── app/                 # Next.js App Router
│   ├── api/            # REST API routes (wardrobe, outfits, calendar, mood-logs, etc.)
│   ├── auth/           # Auth pages (signin, signup, forgot-password)
│   ├── [feature]/      # Feature pages (dashboard, wardrobe, outfits, calendar, mood, insights)
│   ├── layout.tsx      # Root layout
│   └── providers.tsx   # Auth, theme, language context providers
├── components/
│   ├── ui/             # Shadcn/Radix UI primitives (button, card, dialog, etc.)
│   └── [component].tsx # Feature components (navbar, feedback-button, etc.)
├── lib/
│   ├── auth.ts         # NextAuth configuration
│   ├── prisma.ts       # Prisma Client singleton
│   ├── cloudinary.ts   # Image upload integration
│   ├── ai-suggestions.ts # OpenAI outfit suggestions
│   └── insights.ts     # Analytics generation logic
├── contexts/           # React Context (language state)
└── types/              # TypeScript definitions
prisma/
└── schema.prisma       # Database schema (13 models)
```

### Key Patterns

**Authentication**: All protected API routes use `getServerSession()` from NextAuth. Returns 401 if unauthenticated.

**API Routes**: RESTful design with consistent patterns:
- `GET/POST /api/[resource]` for list/create
- `GET/PUT/DELETE /api/[resource]/[id]` for individual operations
- FormData for image uploads, JSON for other operations

**Data Fetching**: Server Components fetch data directly with Prisma. Client Components use fetch to API routes.

**Styling**: Tailwind CSS with HSL CSS variables for theming. Dark mode via class strategy with next-themes.

### Database Models (Prisma)
Core models: User, WardrobeItem, Outfit, OutfitItem, CalendarEvent, MoodLog, Insight, SavedOutfit, CommunityPost, Feedback

### Environment Variables
Required:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - App URL (http://localhost:3000 for dev)
- `NEXTAUTH_SECRET` - JWT secret (generate with `openssl rand -base64 32`)

Optional:
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - Google OAuth
- `OPENAI_API_KEY` - AI outfit suggestions

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getOutfitSuggestion } from '@/lib/ai-suggestions'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { desiredMood, occasion } = body

    if (!desiredMood) {
      return NextResponse.json(
        { error: 'Missing required field: desiredMood' },
        { status: 400 }
      )
    }

    const suggestion = await getOutfitSuggestion(
      session.user.id,
      desiredMood,
      occasion
    )

    return NextResponse.json({ suggestion })
  } catch (error) {
    console.error('Error generating AI suggestion:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


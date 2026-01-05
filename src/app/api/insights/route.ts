import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const insights = await prisma.insight.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
    })

    // Also fetch mood logs for charting
    const moodLogs = await prisma.moodLog.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'asc' },
      select: {
        id: true,
        date: true,
        mood: true,
        energy: true,
        confidence: true,
        outfitId: true,
      },
    })

    return NextResponse.json({
      insights: Array.isArray(insights) ? insights : [],
      moodLogs: Array.isArray(moodLogs) ? moodLogs : [],
    })
  } catch (error) {
    console.error('Error fetching insights:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateInsights } from '@/lib/insights'

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const logs = await prisma.moodLog.findMany({
      where: { userId: session.user.id },
      include: {
        outfit: {
          include: {
            items: {
              include: {
                wardrobeItem: true,
              },
            },
          },
        },
      },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error('Error fetching mood logs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { date, mood, energy, confidence, notes, outfitId } = body

    if (!date || !mood || energy === undefined || confidence === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const log = await prisma.moodLog.create({
      data: {
        userId: session.user.id,
        date: new Date(date),
        mood,
        energy: parseInt(energy),
        confidence: parseInt(confidence),
        notes,
        outfitId: outfitId || null,
      },
      include: {
        outfit: {
          include: {
            items: {
              include: {
                wardrobeItem: true,
              },
            },
          },
        },
      },
    })

    // Generate insights asynchronously
    generateInsights(session.user.id).catch(console.error)

    return NextResponse.json(log)
  } catch (error) {
    console.error('Error creating mood log:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}







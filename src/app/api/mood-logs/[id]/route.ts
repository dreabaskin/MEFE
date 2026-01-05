import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateInsights } from '@/lib/insights'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const log = await prisma.moodLog.update({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
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

    // Regenerate insights after update
    generateInsights(session.user.id).catch(console.error)

    return NextResponse.json(log)
  } catch (error) {
    console.error('Error updating mood log:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.moodLog.delete({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    // Regenerate insights after deletion
    generateInsights(session.user.id).catch(console.error)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting mood log:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}







import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { uploadImage } from '@/lib/cloudinary'

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start')
    const endDate = searchParams.get('end')

    const events = await prisma.calendarEvent.findMany({
      where: {
        userId: session.user.id,
        ...(startDate && endDate
          ? {
              date: {
                gte: new Date(startDate),
                lte: new Date(endDate),
              },
            }
          : {}),
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
      orderBy: { date: 'asc' },
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching calendar events:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const date = formData.get('date') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string | null
    const outfitId = formData.get('outfitId') as string | null
    const eventType = formData.get('eventType') as string | null
    const file = formData.get('image') as File | null

    if (!date || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let imageUrl: string | null = null
    if (file && file.size > 0) {
      imageUrl = await uploadImage(file)
    }

    const event = await prisma.calendarEvent.create({
      data: {
        userId: session.user.id,
        date: new Date(date),
        title,
        description,
        outfitId: outfitId || null,
        eventType: eventType || null,
        imageUrl: imageUrl || null,
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

    return NextResponse.json(event)
  } catch (error) {
    console.error('Error creating calendar event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


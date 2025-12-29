import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { uploadImage } from '@/lib/cloudinary'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get existing event to preserve imageUrl if no new image
    const existingEvent = await prisma.calendarEvent.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
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

    let imageUrl = existingEvent.imageUrl
    if (file && file.size > 0) {
      imageUrl = await uploadImage(file)
    }

    const event = await prisma.calendarEvent.update({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
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
    console.error('Error updating calendar event:', error)
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

    await prisma.calendarEvent.delete({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting calendar event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


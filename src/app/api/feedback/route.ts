import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      type, 
      title, 
      message, 
      page, 
      rating,
      priority,
      featureArea,
      frequencyOfUse,
      easeOfUse,
      designRating,
      functionalityRating,
      painPoints,
      whatTheyLove,
      stepsToReproduce,
      browserInfo,
      deviceInfo,
    } = body

    if (!type || !title || !message) {
      return NextResponse.json(
        { error: 'Type, title, and message are required' },
        { status: 400 }
      )
    }

    const feedback = await prisma.feedback.create({
      data: {
        userId: session.user.id,
        type,
        title,
        message,
        page: page || null,
        rating: rating ? parseInt(rating) : null,
        priority: priority || null,
        featureArea: featureArea || null,
        frequencyOfUse: frequencyOfUse || null,
        easeOfUse: easeOfUse ? parseInt(easeOfUse) : null,
        designRating: designRating ? parseInt(designRating) : null,
        functionalityRating: functionalityRating ? parseInt(functionalityRating) : null,
        painPoints: painPoints || null,
        whatTheyLove: whatTheyLove || null,
        stepsToReproduce: stepsToReproduce || null,
        browserInfo: browserInfo || null,
        deviceInfo: deviceInfo || null,
        status: 'pending',
      },
    })

    return NextResponse.json(feedback)
  } catch (error) {
    console.error('Error creating feedback:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}




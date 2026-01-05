import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = "force-dynamic"

// Debug endpoint to check user session and data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: 'No session or user ID',
        session: session,
        hasSession: !!session,
        hasUserId: !!session?.user?.id
      }, { status: 401 })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        wardrobeItems: { select: { id: true } },
        outfits: { select: { id: true } },
        moodLogs: { select: { id: true } },
        calendarEvents: { select: { id: true } },
        communityPosts: { select: { id: true } },
      },
    })

    if (!user) {
      return NextResponse.json({ 
        error: 'User not found in database',
        sessionUserId: session.user.id,
        sessionEmail: session.user.email
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      session: {
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
      database: {
        userId: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        dataCounts: {
          wardrobeItems: user.wardrobeItems.length,
          outfits: user.outfits.length,
          moodLogs: user.moodLogs.length,
          calendarEvents: user.calendarEvents.length,
          communityPosts: user.communityPosts.length,
        }
      }
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}





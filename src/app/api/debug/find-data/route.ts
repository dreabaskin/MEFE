import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = "force-dynamic"

// This endpoint helps find your data even if it's associated with a different user ID
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ 
        error: 'No session',
        session: session
      }, { status: 401 })
    }

    const sessionUserId = session.user.id
    const sessionEmail = session.user.email

    // Find user by email (in case there are multiple accounts)
    const usersByEmail = await prisma.user.findMany({
      where: { 
        email: {
          equals: sessionEmail,
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      }
    })

    // Get data counts for current session user
    const currentUserData = {
      wardrobeItems: await prisma.wardrobeItem.count({ where: { userId: sessionUserId } }),
      outfits: await prisma.outfit.count({ where: { userId: sessionUserId } }),
      moodLogs: await prisma.moodLog.count({ where: { userId: sessionUserId } }),
      calendarEvents: await prisma.calendarEvent.count({ where: { userId: sessionUserId } }),
      communityPosts: await prisma.communityPost.count({ where: { userId: sessionUserId } }),
    }

    // Get data counts for all users with same email
    const allUsersData = await Promise.all(
      usersByEmail.map(async (user) => ({
        userId: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        data: {
          wardrobeItems: await prisma.wardrobeItem.count({ where: { userId: user.id } }),
          outfits: await prisma.outfit.count({ where: { userId: user.id } }),
          moodLogs: await prisma.moodLog.count({ where: { userId: user.id } }),
          calendarEvents: await prisma.calendarEvent.count({ where: { userId: user.id } }),
          communityPosts: await prisma.communityPost.count({ where: { userId: user.id } }),
        }
      }))
    )

    // Find which user has the most data
    const userWithMostData = allUsersData.reduce((prev, current) => {
      const prevTotal = Object.values(prev.data).reduce((a, b) => a + b, 0)
      const currentTotal = Object.values(current.data).reduce((a, b) => a + b, 0)
      return currentTotal > prevTotal ? current : prev
    }, allUsersData[0])

    return NextResponse.json({
      session: {
        userId: sessionUserId,
        email: sessionEmail,
      },
      currentUserData,
      allUsersWithSameEmail: allUsersData,
      userWithMostData: userWithMostData.userId === sessionUserId 
        ? 'Your current session' 
        : `Different user ID: ${userWithMostData.userId}`,
      recommendation: userWithMostData.userId !== sessionUserId
        ? `Your data appears to be associated with user ID: ${userWithMostData.userId}, but you're logged in as: ${sessionUserId}`
        : 'Your data is correctly associated with your current session'
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}





import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if already liked
    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: params.id,
        },
      },
    })

    if (existingLike) {
      return NextResponse.json({ message: 'Already liked' })
    }

    // Create like and increment count
    await prisma.$transaction([
      prisma.postLike.create({
        data: {
          userId: session.user.id,
          postId: params.id,
        },
      }),
      prisma.communityPost.update({
        where: { id: params.id },
        data: {
          likesCount: {
            increment: 1,
          },
        },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error liking post:', error)
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

    // Delete like and decrement count
    await prisma.$transaction([
      prisma.postLike.deleteMany({
        where: {
          userId: session.user.id,
          postId: params.id,
        },
      }),
      prisma.communityPost.update({
        where: { id: params.id },
        data: {
          likesCount: {
            decrement: 1,
          },
        },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error unliking post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}







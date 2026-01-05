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

    const posts = await prisma.communityPost.findMany({
      where: { isPublic: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        outfit: {
          select: {
            id: true,
            name: true,
          },
        },
        likes: {
          where: {
            userId: session.user.id,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Transform to include isLiked flag
    const postsWithLikes = posts.map(post => {
      const { likes, ...postWithoutLikes } = post
      return {
        ...postWithoutLikes,
        isLiked: likes.length > 0,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      }
    })

    return NextResponse.json(postsWithLikes)
  } catch (error) {
    console.error('Error fetching community posts:', error)
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
    const title = formData.get('title') as string
    const description = formData.get('description') as string | null
    const file = formData.get('image') as File | null
    const outfitId = formData.get('outfitId') as string | null
    const mood = formData.get('mood') as string | null
    const category = formData.get('category') as string | null
    const tagsString = formData.get('tags') as string | null
    const tags = tagsString ? tagsString.split(',').map(t => t.trim()).filter(Boolean) : []

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: 'Image file is required' },
        { status: 400 }
      )
    }

    const imageUrl = await uploadImage(file)

    const post = await prisma.communityPost.create({
      data: {
        userId: session.user.id,
        title,
        description,
        imageUrl,
        outfitId: outfitId || null,
        mood: mood || null,
        category: category || null,
        tags: tags,
        isPublic: true,
        likesCount: 0,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        outfit: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      isLiked: false,
    })
  } catch (error) {
    console.error('Error creating community post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


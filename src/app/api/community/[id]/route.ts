import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { uploadImage } from '@/lib/cloudinary'

export const dynamic = "force-dynamic"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if post exists and belongs to user
    const existingPost = await prisma.communityPost.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found or unauthorized' }, { status: 404 })
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

    let imageUrl = existingPost.imageUrl
    if (file && file.size > 0) {
      imageUrl = await uploadImage(file)
    }

    const post = await prisma.communityPost.update({
      where: { id: params.id },
      data: {
        title,
        description,
        imageUrl,
        outfitId: outfitId || null,
        mood: mood || null,
        category: category || null,
        tags: tags,
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
    console.error('Error updating community post:', error)
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

    // Check if post exists and belongs to user
    const existingPost = await prisma.communityPost.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found or unauthorized' }, { status: 404 })
    }

    await prisma.communityPost.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting community post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}







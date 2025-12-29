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

    const formData = await request.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string | null
    const category = formData.get('category') as string
    const color = formData.get('color') as string | null
    const brand = formData.get('brand') as string | null
    const tags = (formData.get('tags') as string)?.split(',').map(t => t.trim()).filter(Boolean) || []
    const file = formData.get('image') as File | null

    if (!name || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get existing item to preserve imageUrl if no new image
    const existingItem = await prisma.wardrobeItem.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    let imageUrl = existingItem.imageUrl
    if (file && file.size > 0) {
      imageUrl = await uploadImage(file)
    }

    const item = await prisma.wardrobeItem.update({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        name,
        description,
        category,
        color,
        brand,
        tags,
        imageUrl,
      },
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error updating wardrobe item:', error)
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

    await prisma.wardrobeItem.delete({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting wardrobe item:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


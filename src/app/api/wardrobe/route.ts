import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { uploadImage } from '@/lib/cloudinary'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Debug logging
    console.log('Wardrobe GET - Session User ID:', session.user.id)
    console.log('Wardrobe GET - Session Email:', session.user.email)

    const items = await prisma.wardrobeItem.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    console.log('Wardrobe GET - Found items:', items.length)

    // Also check if there are items with different user IDs (for debugging)
    const allItemsCount = await prisma.wardrobeItem.count()
    console.log('Wardrobe GET - Total items in database:', allItemsCount)

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching wardrobe:', error)
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
    const name = formData.get('name') as string
    const description = formData.get('description') as string | null
    const category = formData.get('category') as string
    const color = formData.get('color') as string | null
    const brand = formData.get('brand') as string | null
    const tags = (formData.get('tags') as string)?.split(',').map(t => t.trim()).filter(Boolean) || []
    const file = formData.get('image') as File | null

    if (!name || !category) {
      return NextResponse.json(
        { error: 'Name and category are required' },
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

    const item = await prisma.wardrobeItem.create({
      data: {
        userId: session.user.id,
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
    console.error('Error creating wardrobe item:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


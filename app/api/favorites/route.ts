import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const savedOutfits = await prisma.savedOutfit.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(savedOutfits)
  } catch (error) {
    console.error('Error fetching saved outfits:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, imageUrl, storeName, storeUrl, price, brand, category, tags } = body

    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: 'Title and image URL are required' },
        { status: 400 }
      )
    }

    const savedOutfit = await prisma.savedOutfit.create({
      data: {
        userId: session.user.id,
        title,
        description,
        imageUrl,
        storeName,
        storeUrl,
        price,
        brand,
        category,
        tags: tags || [],
        isFavorite: false,
      },
    })

    return NextResponse.json(savedOutfit)
  } catch (error) {
    console.error('Error saving outfit:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}







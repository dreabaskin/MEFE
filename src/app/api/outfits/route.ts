import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Debug logging
    console.log('Outfits GET - Session User ID:', session.user.id)
    console.log('Outfits GET - Session Email:', session.user.email)

    const outfits = await prisma.outfit.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            wardrobeItem: true,
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    console.log('Outfits GET - Found outfits:', outfits.length)

    // Also check if there are outfits with different user IDs (for debugging)
    const allOutfitsCount = await prisma.outfit.count()
    console.log('Outfits GET - Total outfits in database:', allOutfitsCount)

    return NextResponse.json(outfits)
  } catch (error) {
    console.error('Error fetching outfits:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if it's a form data (photo upload) or JSON (wardrobe-based)
    const contentType = request.headers.get('content-type')
    
    if (contentType?.includes('multipart/form-data')) {
      // Photo-based outfit
      const formData = await request.formData()
      const name = formData.get('name') as string
      const description = formData.get('description') as string | null
      const file = formData.get('image') as File | null

      if (!name || !file || file.size === 0) {
        return NextResponse.json(
          { error: 'Name and image are required for photo outfits' },
          { status: 400 }
        )
      }

      // Import uploadImage function
      const { uploadImage } = await import('@/lib/cloudinary')
      const imageUrl = await uploadImage(file)

      const outfit = await prisma.outfit.create({
        data: {
          userId: session.user.id,
          name,
          description,
          imageUrl,
          type: 'photo',
        },
      })

      return NextResponse.json(outfit)
    } else {
      // Wardrobe-based outfit
      const body = await request.json()
      const { name, description, wardrobeItemIds } = body

      if (!name || !wardrobeItemIds || wardrobeItemIds.length === 0) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        )
      }

      const outfit = await prisma.outfit.create({
        data: {
          userId: session.user.id,
          name,
          description,
          type: 'wardrobe',
          items: {
            create: wardrobeItemIds.map((itemId: string, index: number) => ({
              wardrobeItemId: itemId,
              order: index,
            })),
          },
        },
        include: {
          items: {
            include: {
              wardrobeItem: true,
            },
          },
        },
      })

      return NextResponse.json(outfit)
    }
  } catch (error) {
    console.error('Error creating outfit:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    // Get existing outfit to check type
    const existingOutfit = await prisma.outfit.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingOutfit) {
      return NextResponse.json({ error: 'Outfit not found' }, { status: 404 })
    }

    // Check if it's a form data (photo upload) or JSON (wardrobe-based)
    const contentType = request.headers.get('content-type')
    
    if (contentType?.includes('multipart/form-data')) {
      // Photo-based outfit update
      const formData = await request.formData()
      const name = formData.get('name') as string
      const description = formData.get('description') as string | null
      const file = formData.get('image') as File | null

      if (!name) {
        return NextResponse.json(
          { error: 'Name is required' },
          { status: 400 }
        )
      }

      let imageUrl = existingOutfit.imageUrl
      if (file && file.size > 0) {
        const { uploadImage } = await import('@/lib/cloudinary')
        imageUrl = await uploadImage(file)
      }

      const outfit = await prisma.outfit.update({
        where: {
          id: params.id,
          userId: session.user.id,
        },
        data: {
          name,
          description,
          imageUrl,
        },
      })

      return NextResponse.json(outfit)
    } else {
      // Wardrobe-based outfit update
      const body = await request.json()
      const { name, description, wardrobeItemIds } = body

      if (!name || !wardrobeItemIds || wardrobeItemIds.length === 0) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        )
      }

      // Delete existing items
      await prisma.outfitItem.deleteMany({
        where: {
          outfitId: params.id,
        },
      })

      // Update outfit and create new items
      const outfit = await prisma.outfit.update({
        where: {
          id: params.id,
          userId: session.user.id,
        },
        data: {
          name,
          description,
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
    console.error('Error updating outfit:', error)
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

    await prisma.outfit.delete({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting outfit:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


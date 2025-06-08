import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAdmin } from '../../../auth/middleware'

const prisma = new PrismaClient()

// GET /api/admin/products/[id] - Get product with variants
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAdmin(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: {
          orderBy: [{ size: 'asc' }, { color: 'asc' }]
        },
        images: {
          orderBy: [
            { isPrimary: 'desc' },
            { createdAt: 'asc' }
          ]
        }
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/admin/products/[id] - Update product details
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAdmin(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const body = await request.json()
    const { name, description, price, stock, imageUrl, categoryId } = body

    // Build update data object with only provided fields
    const updateData: any = {}
    
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (price !== undefined) {
      const numPrice = parseFloat(price)
      if (isNaN(numPrice) || numPrice < 0) {
        return NextResponse.json({ error: 'Invalid price value' }, { status: 400 })
      }
      updateData.price = numPrice
    }
    if (stock !== undefined) {
      const numStock = parseInt(stock)
      if (isNaN(numStock) || numStock < 0) {
        return NextResponse.json({ error: 'Invalid stock value' }, { status: 400 })
      }
      updateData.stock = numStock
    }
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl
    if (categoryId !== undefined) updateData.categoryId = categoryId

    // Generate slug if name is being updated
    if (name) {
      updateData.slug = name.toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-')
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        variants: {        orderBy: [{ size: 'asc' }, { color: 'asc' }]
        }
      }
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Error updating product:', error)
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'Product name or slug already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

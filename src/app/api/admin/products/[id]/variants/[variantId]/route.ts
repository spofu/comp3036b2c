import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAdmin } from '../../../../../auth/middleware'

const prisma = new PrismaClient()

// GET /api/admin/products/[id]/variants/[variantId] - Get specific variant
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  try {
    const user = await requireAdmin(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, variantId } = await params

    const variant = await prisma.productVariant.findFirst({
      where: {
        id: variantId,
        productId: id
      }
    })

    if (!variant) {
      return NextResponse.json({ error: 'Variant not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      variant: {
        id: variant.id,
        size: variant.size,
        color: variant.color,
        material: variant.material,
        sku: variant.sku,
        price: variant.price ? Number(variant.price) : null,
        stock: variant.stock,
        imageUrl: variant.imageUrl,
        createdAt: variant.createdAt,
        updatedAt: variant.updatedAt
      }
    })
  } catch (error) {
    console.error('Fetch variant error:', error)
    return NextResponse.json({ error: 'Failed to fetch variant' }, { status: 500 })
  }
}

// PUT /api/admin/products/[id]/variants/[variantId] - Update variant
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  try {
    const user = await requireAdmin(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, variantId } = await params
    const body = await request.json()
    const { size, color, material, sku, price, stock, imageUrl } = body

    // Validate stock value
    if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
      return NextResponse.json({ error: 'Invalid stock value' }, { status: 400 })
    }

    // Validate price value
    if (price !== null && price !== undefined && (typeof price !== 'number' || price < 0)) {
      return NextResponse.json({ error: 'Invalid price value' }, { status: 400 })
    }

    // Check if variant exists
    const existingVariant = await prisma.productVariant.findFirst({
      where: {
        id: variantId,
        productId: id
      }
    })

    if (!existingVariant) {
      return NextResponse.json({ error: 'Variant not found' }, { status: 404 })
    }

    // Check if updating size/color would create a duplicate
    if ((size !== undefined && size !== existingVariant.size) || 
        (color !== undefined && color !== existingVariant.color)) {
      const duplicateVariant = await prisma.productVariant.findFirst({
        where: {
          productId: id,
          size: size !== undefined ? size : existingVariant.size,
          color: color !== undefined ? color : existingVariant.color,
          id: { not: variantId }
        }
      })

      if (duplicateVariant) {
        return NextResponse.json({ 
          error: 'Another variant with this size/color combination already exists' 
        }, { status: 400 })
      }
    }

    // Update the variant
    const variant = await prisma.productVariant.update({
      where: { id: variantId },
      data: {
        ...(size !== undefined && { size }),
        ...(color !== undefined && { color }),
        ...(material !== undefined && { material }),
        ...(sku !== undefined && { sku }),
        ...(price !== undefined && { price }),
        ...(stock !== undefined && { stock }),
        ...(imageUrl !== undefined && { imageUrl })
      }
    })

    return NextResponse.json({ 
      message: 'Variant updated successfully',
      variant: {
        id: variant.id,
        size: variant.size,
        color: variant.color,
        material: variant.material,
        sku: variant.sku,
        price: variant.price ? Number(variant.price) : null,
        stock: variant.stock,
        imageUrl: variant.imageUrl,
        createdAt: variant.createdAt,
        updatedAt: variant.updatedAt
      }
    })
  } catch (error) {
    console.error('Update variant error:', error)
    return NextResponse.json({ error: 'Failed to update variant' }, { status: 500 })
  }
}

// DELETE /api/admin/products/[id]/variants/[variantId] - Delete variant
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  try {
    const user = await requireAdmin(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, variantId } = await params

    // Check if variant exists
    const existingVariant = await prisma.productVariant.findFirst({
      where: {
        id: variantId,
        productId: id
      }
    })

    if (!existingVariant) {
      return NextResponse.json({ error: 'Variant not found' }, { status: 404 })
    }

    // Delete the variant
    await prisma.productVariant.delete({
      where: { id: variantId }
    })

    return NextResponse.json({ 
      message: 'Variant deleted successfully',
      variantId
    })
  } catch (error) {
    console.error('Delete variant error:', error)
    return NextResponse.json({ error: 'Failed to delete variant' }, { status: 500 })
  }
}

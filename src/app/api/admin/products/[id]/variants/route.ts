import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAdmin } from '../../../../auth/middleware'

const prisma = new PrismaClient()

// GET /api/admin/products/[id]/variants - Get all variants for a product
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

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: {
          orderBy: [{ size: 'asc' }, { color: 'asc' }]
        }
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      variants: product.variants.map(variant => ({
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
      }))
    })
  } catch (error) {
    console.error('Fetch variants error:', error)
    return NextResponse.json({ error: 'Failed to fetch variants' }, { status: 500 })
  }
}

// POST /api/admin/products/[id]/variants - Create new variant
export async function POST(
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
    const { size, color, material, sku, price, stock = 0, imageUrl } = body    // Validate required fields - at least one variant attribute is required
    if (!size && !color && !material) {
      return NextResponse.json({ 
        error: 'At least one variant attribute (size, color, or material) is required' 
      }, { status: 400 })
    }

    if (typeof stock !== 'number' || stock < 0) {
      return NextResponse.json({ error: 'Invalid stock value' }, { status: 400 })
    }

    if (price !== null && price !== undefined && (typeof price !== 'number' || price < 0)) {
      return NextResponse.json({ error: 'Invalid price value' }, { status: 400 })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if variant already exists for this product
    const existingVariant = await prisma.productVariant.findFirst({
      where: {
        productId: id,
        size: size || null,
        color: color || null
      }
    })

    if (existingVariant) {
      return NextResponse.json({ 
        error: 'Variant with this size/color combination already exists for this product' 
      }, { status: 400 })
    }

    // Create the variant
    const variant = await prisma.productVariant.create({
      data: {
        productId: id,
        size: size || null,
        color: color || null,
        material: material || null,
        sku: sku || null,
        price: price || null,
        stock,
        imageUrl: imageUrl || null
      }
    })

    return NextResponse.json({ 
      message: 'Variant created successfully',
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
    console.error('Create variant error:', error)
    return NextResponse.json({ error: 'Failed to create variant' }, { status: 500 })
  }
}

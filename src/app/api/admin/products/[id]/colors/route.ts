import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAdmin } from '../../../../auth/middleware'

const prisma = new PrismaClient()

// POST /api/admin/products/[id]/colors - Create new color
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAdmin(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { color, stock = 0 } = body

    if (!color || typeof color !== 'string') {
      return NextResponse.json({ error: 'Color is required' }, { status: 400 })
    }

    if (typeof stock !== 'number' || stock < 0) {
      return NextResponse.json({ error: 'Invalid stock value' }, { status: 400 })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: params.id }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if color already exists for this product
    const existingColor = await prisma.productColor.findUnique({
      where: {
        productId_color: {
          productId: params.id,
          color: color.trim()
        }
      }
    })

    if (existingColor) {
      return NextResponse.json({ error: 'Color already exists for this product' }, { status: 400 })
    }

    const newColor = await prisma.productColor.create({
      data: {
        productId: params.id,
        color: color.trim(),
        stock
      }
    })

    return NextResponse.json(newColor)
  } catch (error) {
    console.error('Error creating color:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

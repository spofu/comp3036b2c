import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAdmin } from '../../../../auth/middleware'

const prisma = new PrismaClient()

// POST /api/admin/products/[id]/sizes - Create new size
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
    const { size, stock = 0 } = body

    if (!size || typeof size !== 'string') {
      return NextResponse.json({ error: 'Size is required' }, { status: 400 })
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

    // Check if size already exists for this product
    const existingSize = await prisma.productSize.findUnique({
      where: {
        productId_size: {
          productId: params.id,
          size: size.trim()
        }
      }
    })

    if (existingSize) {
      return NextResponse.json({ error: 'Size already exists for this product' }, { status: 400 })
    }

    const newSize = await prisma.productSize.create({
      data: {
        productId: params.id,
        size: size.trim(),
        stock
      }
    })

    return NextResponse.json(newSize)
  } catch (error) {
    console.error('Error creating size:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

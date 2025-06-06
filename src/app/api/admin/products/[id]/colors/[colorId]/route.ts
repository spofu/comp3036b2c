import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAdmin } from '../../../../../auth/middleware'

const prisma = new PrismaClient()

// PATCH /api/admin/products/[id]/colors/[colorId] - Update color stock
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; colorId: string } }
) {
  try {
    const user = await requireAdmin(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { stock } = body

    if (typeof stock !== 'number' || stock < 0) {
      return NextResponse.json({ error: 'Invalid stock value' }, { status: 400 })
    }

    const updatedColor = await prisma.productColor.update({
      where: { id: params.colorId },
      data: { stock }
    })

    return NextResponse.json(updatedColor)
  } catch (error) {
    console.error('Error updating color stock:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/products/[id]/colors/[colorId] - Delete color
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; colorId: string } }
) {
  try {
    const user = await requireAdmin(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.productColor.delete({
      where: { id: params.colorId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting color:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

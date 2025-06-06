import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAdmin } from '../../../../../auth/middleware'

const prisma = new PrismaClient()

// PATCH /api/admin/products/[id]/sizes/[sizeId] - Update size stock
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; sizeId: string } }
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

    const updatedSize = await prisma.productSize.update({
      where: { id: params.sizeId },
      data: { stock }
    })

    return NextResponse.json(updatedSize)
  } catch (error) {
    console.error('Error updating size stock:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/products/[id]/sizes/[sizeId] - Delete size
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; sizeId: string } }
) {
  try {
    const user = await requireAdmin(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.productSize.delete({
      where: { id: params.sizeId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting size:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

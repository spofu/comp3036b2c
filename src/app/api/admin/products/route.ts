import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(request: NextRequest) {
  try {
    const { id, stock } = await request.json();
    
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { stock: parseInt(stock) }
    });

    return NextResponse.json({ 
      success: true, 
      product: {
        id: updatedProduct.id,
        stock: updatedProduct.stock
      }
    });
  } catch (error) {
    console.error('Product update error:', error);
    return NextResponse.json({ error: 'Failed to update product stock' }, { status: 500 });
  }
}

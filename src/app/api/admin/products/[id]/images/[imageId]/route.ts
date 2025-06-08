import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '../../../../../auth/middleware';

const prisma = new PrismaClient();

// PATCH - Update image properties (e.g., set as primary)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const user = await requireAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, imageId } = await params;
    const body = await request.json();
    const { isPrimary, altText } = body;

    // Verify image belongs to this product
    const image = await prisma.productImage.findFirst({
      where: { 
        id: imageId,
        productId: id 
      }
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // If setting as primary, unset other primary images
    if (isPrimary === true) {
      await prisma.productImage.updateMany({
        where: { productId: id, isPrimary: true },
        data: { isPrimary: false }
      });
    }

    // Update the image
    const updatedImage = await prisma.productImage.update({
      where: { id: imageId },
      data: {
        ...(isPrimary !== undefined && { isPrimary }),
        ...(altText !== undefined && { altText })
      }
    });

    return NextResponse.json({ 
      message: 'Image updated successfully',
      image: updatedImage 
    });

  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete a specific image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const user = await requireAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, imageId } = await params;

    // Verify image belongs to this product
    const image = await prisma.productImage.findFirst({
      where: { 
        id: imageId,
        productId: id 
      }
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    await prisma.productImage.delete({
      where: { id: imageId }
    });

    return NextResponse.json({ message: 'Image deleted successfully' });

  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

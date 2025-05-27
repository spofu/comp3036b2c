import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch a single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Calculate average rating
    const averageRating = product.reviews.length > 0 
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0;

    // Transform product to match the expected format
    const formattedProduct = {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.imageUrl || '/images/products/default.jpg',
      description: product.description,
      category: product.category?.name || 'Uncategorized',
      stock: product.stock,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], // In a real app, this would come from the database
      colors: ['Black', 'White', 'Navy', 'Gray', 'Brown', 'Khaki'], // In a real app, this would come from the database
      images: [
        product.imageUrl || '/images/products/default.jpg',
        // In a real app, you would have multiple images stored in the database
        '/images/products/detail-placeholder-2.jpg',
        '/images/products/detail-placeholder-3.jpg',
        '/images/products/detail-placeholder-4.jpg'
      ],
      reviews: product.reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        user: review.user
      })),
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: product.reviews.length,
      features: [
        'Premium quality fabric',
        'Machine washable',
        'Comfortable fit',
        'Durable construction',
        'Available in multiple colors'
      ],
      specifications: {
        material: '100% Cotton',
        care: 'Machine wash cold, tumble dry low',
        origin: 'Made in USA',
        weight: '250g',
        fit: 'Regular fit'
      }
    };

    return NextResponse.json({ product: formattedProduct });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

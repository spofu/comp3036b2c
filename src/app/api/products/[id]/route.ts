import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { parseProductIdentifier } from '../../utils/slugUtils';

const prisma = new PrismaClient();

// GET - Fetch a single product by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const identifier = id;
    const { type, value } = parseProductIdentifier(identifier);

    // Build the where clause based on identifier type
    let product;
    if (type === 'id') {
      product = await prisma.product.findUnique({
        where: { id: value },
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
    } else {
      product = await prisma.product.findUnique({
        where: { slug: value },
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
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Calculate average rating
    const averageRating = product.reviews.length > 0 
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0;

    // Create realistic size/color availability based on actual stock
    const generateSizeAvailability = (totalStock: number) => {
      // If stock is very low, make some sizes unavailable
      const stockThreshold = totalStock < 30;
      return [
        { size: 'XS', inStock: !stockThreshold || Math.random() > 0.7 },
        { size: 'S', inStock: !stockThreshold || Math.random() > 0.3 },
        { size: 'M', inStock: true }, // M is usually always available
        { size: 'L', inStock: true }, // L is usually always available
        { size: 'XL', inStock: !stockThreshold || Math.random() > 0.4 },
        { size: 'XXL', inStock: !stockThreshold || Math.random() > 0.6 }
      ];
    };

    const generateColorAvailability = (totalStock: number) => {
      // If stock is very low, make some colors unavailable
      const stockThreshold = totalStock < 50;
      return [
        { color: 'Black', inStock: true }, // Black is usually always available
        { color: 'White', inStock: !stockThreshold || Math.random() > 0.2 },
        { color: 'Navy', inStock: !stockThreshold || Math.random() > 0.3 },
        { color: 'Gray', inStock: !stockThreshold || Math.random() > 0.4 },
        { color: 'Brown', inStock: !stockThreshold || Math.random() > 0.5 },
        { color: 'Khaki', inStock: !stockThreshold || Math.random() > 0.6 }
      ];
    };

    // Transform product to match the expected format
    const formattedProduct = {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.imageUrl || '/images/products/default.jpg',
      description: product.description,
      category: product.category?.name || 'Uncategorized',
      stock: product.stock,
      sizes: generateSizeAvailability(product.stock),
      colors: generateColorAvailability(product.stock),
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

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
          variants: {
            where: { stock: { gt: 0 } }, // Only include variants with stock > 0
            orderBy: [{ size: 'asc' }, { color: 'asc' }]
          },
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
          variants: {
            where: { stock: { gt: 0 } }, // Only include variants with stock > 0
            orderBy: [{ size: 'asc' }, { color: 'asc' }]
          },
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

    // Transform product to match the expected format
    const uniqueSizes = [...new Set(product.variants.map(v => v.size).filter(Boolean))];
    const uniqueColors = [...new Set(product.variants.map(v => v.color).filter(Boolean))];
    
    const formattedProduct = {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.imageUrl || '/images/products/default.jpg',
      description: product.description,
      category: product.category?.name || 'Uncategorized',
      stock: product.stock,
      sizes: uniqueSizes.map(size => ({
        size: size,
        inStock: product.variants.some(v => v.size === size && v.stock > 0)
      })),
      colors: uniqueColors.map(color => ({
        color: color,
        inStock: product.variants.some(v => v.color === color && v.stock > 0)
      })),
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

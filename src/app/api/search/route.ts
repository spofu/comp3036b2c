import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Search products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = searchParams.get('limit') || '5';

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ products: [] });
    }

    const searchTerm = query.trim().toLowerCase();

    // Search products by name, description, or category
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          },
          {
            description: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          },
          {
            category: {
              name: {
                contains: searchTerm,
                mode: 'insensitive'
              }
            }
          }
        ]
      },
      include: {
        category: true
      },
      take: parseInt(limit),
      orderBy: {
        name: 'asc'
      }
    });

    // Transform products to match the search result format
    const searchResults = products.map(product => ({
      id: product.id.toString(),
      name: product.name,
      category: product.category?.name || 'Uncategorized',
      price: Number(product.price),
      imageUrl: product.imageUrl || '/images/products/default.jpg',
      description: product.description
    }));

    return NextResponse.json({ products: searchResults });
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json({ error: 'Failed to search products' }, { status: 500 });
  }
}

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
        category: true,
        variants: { 
          where: { stock: { gt: 0 } },
          orderBy: [
            { size: 'asc' },
            { color: 'asc' }
          ]
        }
      },
      take: parseInt(limit),
      orderBy: {
        name: 'asc'
      }
    });

    // Transform products to match the search result format
    const searchResults = products.map(product => {
      // Extract unique sizes and colors from variants
      const uniqueSizes = [...new Set(product.variants.map(v => v.size).filter(Boolean))];
      const uniqueColors = [...new Set(product.variants.map(v => v.color).filter(Boolean))];
      
      // Calculate total stock from all variants
      const totalStock = product.variants.reduce((sum, variant) => sum + variant.stock, 0);

      return {
        id: product.id.toString(),
        name: product.name,
        category: product.category?.name || 'Uncategorized',
        price: Number(product.price),
        imageUrl: product.imageUrl || '/images/products/default.jpg',
        description: product.description,
        stock: totalStock,
        sizes: uniqueSizes.map(size => ({ 
          size, 
          inStock: product.variants.some(v => v.size === size && v.stock > 0) 
        })),
        colors: uniqueColors.map(color => ({ 
          color, 
          inStock: product.variants.some(v => v.color === color && v.stock > 0) 
        }))
      };
    });

    return NextResponse.json({ 
      products: searchResults,
      total: searchResults.length 
    });
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json({ error: 'Failed to search products' }, { status: 500 });
  }
}

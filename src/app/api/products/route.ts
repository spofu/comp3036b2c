import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');

    let whereClause = {};
    if (category) {
      whereClause = { category };
    }    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        variants: {
          where: { stock: { gt: 0 } }, // Only include variants with stock > 0
          orderBy: [{ size: 'asc' }, { color: 'asc' }]
        },
        images: {
          orderBy: [
            { isPrimary: 'desc' },
            { createdAt: 'asc' }
          ]
        }
      },
      orderBy: { id: 'asc' },
      ...(limit && { take: parseInt(limit) })
    });    // Transform products to match the expected format
    const formattedProducts = products.map(product => {
      // Extract unique sizes and colors from variants
      const uniqueSizes = [...new Set(product.variants.map(v => v.size).filter(Boolean))];
      const uniqueColors = [...new Set(product.variants.map(v => v.color).filter(Boolean))];
      
      // Get primary image or first image, fallback to old imageUrl or default
      const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
      const imageUrl = primaryImage ? primaryImage.imageData : (product.imageUrl || '/images/products/default.jpg');
      
      return {
        id: product.id.toString(),
        name: product.name,
        price: Number(product.price), // Convert Decimal to number
        image: imageUrl,
        description: product.description,
        category: product.category?.name || 'Uncategorized',
        sizes: uniqueSizes.map(size => ({
          size: size,
          inStock: product.variants.some(v => v.size === size && v.stock > 0)
        })),
        colors: uniqueColors.map(color => ({
          color: color,
          inStock: product.variants.some(v => v.color === color && v.stock > 0)
        }))
      };
    });

    return NextResponse.json({ products: formattedProducts });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

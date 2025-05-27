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
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true, // Include category information
      },
      orderBy: { id: 'asc' },
      ...(limit && { take: parseInt(limit) })
    });

    // Transform products to match the expected format
    const formattedProducts = products.map(product => ({
      id: product.id.toString(),
      name: product.name,
      price: Number(product.price), // Convert Decimal to number
      image: product.imageUrl || '/images/products/default.jpg',
      description: product.description,
      category: product.category?.name || 'Uncategorized',
      sizes: ['S', 'M', 'L', 'XL'], // Default sizes - in a real app, this would come from the database
      colors: ['Black', 'White', 'Navy', 'Gray'] // Default colors - in a real app, this would come from the database
    }));

    return NextResponse.json({ products: formattedProducts });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

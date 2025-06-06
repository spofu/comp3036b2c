import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST - Check inventory availability for cart items
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ 
        error: 'Items array is required' 
      }, { status: 400 });
    }

    const inventoryChecks = [];

    for (const item of items) {
      const { productId, quantity, size, color } = item;

      if (!productId || !quantity) {
        return NextResponse.json({ 
          error: 'Each item must have productId and quantity' 
        }, { status: 400 });
      }

      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          sizes: true,
          colors: true
        }
      });

      if (!product) {
        inventoryChecks.push({
          productId,
          available: false,
          error: 'Product not found',
          requestedQuantity: quantity,
          availableQuantity: 0
        });
        continue;
      }

      let availableQuantity = product.stock;
      let available = true;
      let error = null;

      // Check main product stock
      if (product.stock < quantity) {
        available = false;
        error = `Insufficient stock. Available: ${product.stock}, Requested: ${quantity}`;
      }

      // Check size-specific stock if size is specified
      if (available && size && size !== 'One Size') {
        const sizeStock = product.sizes.find(s => s.size === size);
        if (!sizeStock) {
          available = false;
          error = `Size ${size} not available`;
          availableQuantity = 0;
        } else if (sizeStock.stock < quantity) {
          available = false;
          error = `Insufficient stock for size ${size}. Available: ${sizeStock.stock}, Requested: ${quantity}`;
          availableQuantity = sizeStock.stock;
        } else {
          availableQuantity = Math.min(availableQuantity, sizeStock.stock);
        }
      }

      // Check color-specific stock if color is specified
      if (available && color && color !== 'Default') {
        const colorStock = product.colors.find(c => c.color === color);
        if (!colorStock) {
          available = false;
          error = `Color ${color} not available`;
          availableQuantity = 0;
        } else if (colorStock.stock < quantity) {
          available = false;
          error = `Insufficient stock for color ${color}. Available: ${colorStock.stock}, Requested: ${quantity}`;
          availableQuantity = Math.min(availableQuantity, colorStock.stock);
        } else {
          availableQuantity = Math.min(availableQuantity, colorStock.stock);
        }
      }

      inventoryChecks.push({
        productId,
        productName: product.name,
        available,
        error,
        requestedQuantity: quantity,
        availableQuantity,
        size: size || null,
        color: color || null
      });
    }

    // Check if all items are available
    const allAvailable = inventoryChecks.every(check => check.available);
    const unavailableItems = inventoryChecks.filter(check => !check.available);

    return NextResponse.json({
      success: allAvailable,
      allItemsAvailable: allAvailable,
      inventoryChecks,
      unavailableItems,
      message: allAvailable 
        ? 'All items are available' 
        : `${unavailableItems.length} item(s) have insufficient stock`
    });

  } catch (error) {
    console.error('Inventory check error:', error);
    return NextResponse.json({ 
      error: 'Failed to check inventory',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET - Get current stock levels for a specific product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ 
        error: 'Product ID is required' 
      }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        sizes: true,
        colors: true
      }
    });

    if (!product) {
      return NextResponse.json({ 
        error: 'Product not found' 
      }, { status: 404 });
    }

    return NextResponse.json({
      productId: product.id,
      productName: product.name,
      totalStock: product.stock,
      sizes: product.sizes.map(size => ({
        size: size.size,
        stock: size.stock
      })),
      colors: product.colors.map(color => ({
        color: color.color,
        stock: color.stock
      }))
    });

  } catch (error) {
    console.error('Error fetching product stock:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch product stock' 
    }, { status: 500 });
  }
}

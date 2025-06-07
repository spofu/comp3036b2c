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
      const { productId, productVariantId, quantity } = item;

      if (!productId || !quantity) {
        return NextResponse.json({ 
          error: 'Each item must have productId and quantity' 
        }, { status: 400 });
      }

      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          variants: true
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

      let availableQuantity = 0;
      let available = true;
      let error = null;
      let variant = null;
      let size = null;
      let color = null;

      // If productVariantId is specified, check specific variant stock
      if (productVariantId) {
        variant = product.variants.find(v => v.id === productVariantId);
        if (!variant) {
          available = false;
          error = 'Product variant not found';
          availableQuantity = 0;
        } else {
          availableQuantity = variant.stock;
          size = variant.size;
          color = variant.color;
          if (variant.stock < quantity) {
            available = false;
            error = `Insufficient stock for variant. Available: ${variant.stock}, Requested: ${quantity}`;
          }
        }
      } else {
        // If no specific variant, check total available stock across all variants
        availableQuantity = product.variants.reduce((total, v) => total + v.stock, 0);
        if (availableQuantity < quantity) {
          available = false;
          error = `Insufficient total stock. Available: ${availableQuantity}, Requested: ${quantity}`;
        }
      }

      inventoryChecks.push({
        productId,
        productVariantId: productVariantId || null,
        productName: product.name,
        available,
        error,
        requestedQuantity: quantity,
        availableQuantity,
        size,
        color
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
        variants: true
      }
    });

    if (!product) {
      return NextResponse.json({ 
        error: 'Product not found' 
      }, { status: 404 });
    }

    // Calculate total stock from all variants
    const totalStock = product.variants.reduce((total, variant) => total + variant.stock, 0);

    // Get unique sizes and colors with their available stock
    const sizeStockMap = new Map();
    const colorStockMap = new Map();

    product.variants.forEach(variant => {
      // Aggregate stock by size
      if (variant.size) {
        const currentSizeStock = sizeStockMap.get(variant.size) || 0;
        sizeStockMap.set(variant.size, currentSizeStock + variant.stock);
      }

      // Aggregate stock by color
      if (variant.color) {
        const currentColorStock = colorStockMap.get(variant.color) || 0;
        colorStockMap.set(variant.color, currentColorStock + variant.stock);
      }
    });

    return NextResponse.json({
      productId: product.id,
      productName: product.name,
      totalStock,
      variants: product.variants.map(variant => ({
        id: variant.id,
        size: variant.size,
        color: variant.color,
        stock: variant.stock
      })),
      sizes: Array.from(sizeStockMap.entries()).map(([size, stock]) => ({
        size,
        stock
      })),
      colors: Array.from(colorStockMap.entries()).map(([color, stock]) => ({
        color,
        stock
      }))
    });

  } catch (error) {
    console.error('Error fetching product stock:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch product stock' 
    }, { status: 500 });
  }
}

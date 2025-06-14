import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      items,            // Array of cart items with productId, quantity, size, color, price
      shippingAddress,  // Shipping address object
      paymentInfo,
      total
    } = body;

    // Validate required fields
    if (!userId || !items || items.length === 0 || !total || !shippingAddress) {
      return NextResponse.json({ 
        error: 'Missing required fields: userId, items, and total are required' 
      }, { status: 400 });
    }

    // Start a database transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create or get shipping address
      const address = await tx.address.create({
        data: {
          userId,
          street: shippingAddress.street,
          apartment: shippingAddress.apartment || '',
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country || 'United States'
        }
      });

      // 2. Validate inventory and check stock availability
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: {
            variants: true
          }
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        // If variant is specified, check variant stock
        if (item.productVariantId) {
          const variant = product.variants.find(v => v.id === item.productVariantId);
          if (!variant) {
            throw new Error(`Product variant not found for product ${product.name}`);
          }
          
          if (variant.stock < item.quantity) {
            throw new Error(`Insufficient stock for product ${product.name} variant. Available: ${variant.stock}, Requested: ${item.quantity}`);
          }
        } else {
          // Check main product stock if no specific variant
          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
          }
        }
      }

      // 3. Create the order
      const order = await tx.order.create({
        data: {
          userId,
          total: parseFloat(total.toString()),
          status: 'PENDING',
          addressId: address.id
        }
      });

      // 4. Create order items and update inventory
      for (const item of items) {
        // Create order item
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            productVariantId: item.productVariantId || null,
            quantity: item.quantity,
            price: parseFloat(item.price.toString())
          }
        });

        // Update stock
        if (item.productVariantId) {
          // Update variant stock
          await tx.productVariant.update({
            where: { id: item.productVariantId },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          });
        } else {
          // Update main product stock
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          });
        }
      }

      // 5. Clear the user's cart
      await tx.cartItem.deleteMany({
        where: { userId }
      });

      return {
        order,
        address,
        orderNumber: `ORD-${order.id.slice(-8).toUpperCase()}`
      };
    });

    // 6. Mark order as PAID (in a real app, this would happen after payment processing)
    await prisma.order.update({
      where: { id: result.order.id },
      data: { status: 'PAID' }
    });

    return NextResponse.json({
      success: true,
      order: {
        id: result.order.id,
        orderNumber: result.orderNumber,
        status: 'PAID',
        total: result.order.total,
        createdAt: result.order.createdAt,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        shippingAddress: result.address
      },
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('Checkout error:', error);
    
    // Handle specific error types
    if (error instanceof Error && error.message.includes('Insufficient stock')) {
      return NextResponse.json({ 
        error: error.message,
        type: 'STOCK_ERROR'
      }, { status: 409 });
    }

    return NextResponse.json({ 
      error: 'Failed to process checkout. Please try again.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET - Get order details by order ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const userId = searchParams.get('userId');

    if (!orderId || !userId) {
      return NextResponse.json({ 
        error: 'Order ID and User ID are required' 
      }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        address: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ 
        error: 'Order not found' 
      }, { status: 404 });
    }

    const formattedOrder = {
      id: order.id,
      orderNumber: `ORD-${order.id.slice(-8).toUpperCase()}`,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
      estimatedDelivery: new Date(order.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      items: order.items.map(item => ({
        id: item.id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        total: parseFloat(item.price.toString()) * item.quantity,
        image: item.product.imageUrl || '/images/products/default.jpg'
      })),
      shippingAddress: order.address ? {
        name: order.user.name,
        street: order.address.street,
        apartment: order.address.apartment,
        city: order.address.city,
        state: order.address.state,
        zipCode: order.address.zipCode,
        country: order.address.country
      } : null,
      customer: {
        name: order.user.name,
        email: order.user.email
      }
    };

    return NextResponse.json({ order: formattedOrder });

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch order details' 
    }, { status: 500 });
  }
}

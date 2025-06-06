import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get all orders for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ 
        error: 'User ID is required' 
      }, { status: 400 });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        },
        address: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: `ORD-${order.id.slice(-8).toUpperCase()}`,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
      estimatedDelivery: new Date(order.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      itemCount: order.items.length,
      items: order.items.map(item => ({
        id: item.id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        image: item.product.imageUrl || '/images/products/default.jpg'
      })),
      shippingAddress: {
        street: order.address.street,
        apartment: order.address.apartment,
        city: order.address.city,
        state: order.address.state,
        zipCode: order.address.zipCode,
        country: order.address.country
      }
    }));

    return NextResponse.json({ orders: formattedOrders });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch orders' 
    }, { status: 500 });
  }
}

// PATCH - Update order status (for admin use)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status, userId } = body;

    if (!orderId || !status) {
      return NextResponse.json({ 
        error: 'Order ID and status are required' 
      }, { status: 400 });
    }

    const validStatuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: 'Invalid status. Valid statuses are: ' + validStatuses.join(', ')
      }, { status: 400 });
    }

    // If userId is provided, ensure the order belongs to the user
    const whereClause = userId ? { id: orderId, userId } : { id: orderId };

    const updatedOrder = await prisma.order.update({
      where: whereClause,
      data: { status },
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

    return NextResponse.json({
      success: true,
      order: {
        id: updatedOrder.id,
        orderNumber: `ORD-${updatedOrder.id.slice(-8).toUpperCase()}`,
        status: updatedOrder.status,
        total: updatedOrder.total,
        createdAt: updatedOrder.createdAt,
        items: updatedOrder.items.map(item => ({
          id: item.id,
          name: item.product.name,
          price: item.price,
          quantity: item.quantity,
          image: item.product.imageUrl || '/images/products/default.jpg'
        }))
      },
      message: `Order status updated to ${status}`
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json({ 
        error: 'Order not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      error: 'Failed to update order status' 
    }, { status: 500 });
  }
}

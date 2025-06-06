import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get dashboard statistics
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();
    
    const revenueResult = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
    });
    
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
      },
    });

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalRevenue: Number(revenueResult._sum.total || 0),
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        total: Number(order.total),
        status: order.status,
        createdAt: order.createdAt,
        user: order.user
      }))
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}

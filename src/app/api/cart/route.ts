import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch cart items for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Fetch actual cart items from the database
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedCartItems = cartItems.map((item) => ({
      id: item.id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.imageUrl || '/images/products/default.jpg',
      quantity: item.quantity,
      color: item.color || 'Default',
      size: item.size || 'One Size',
      productId: item.productId
    }));

    return NextResponse.json({ cartItems: formattedCartItems });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return NextResponse.json({ error: 'Failed to fetch cart items' }, { status: 500 });
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId, quantity = 1, size, color } = body;

    if (!userId || !productId) {
      return NextResponse.json({ error: 'User ID and Product ID are required' }, { status: 400 });
    }

    // Fetch the product to get details
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if item already exists in cart with same size/color combination
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId_size_color: {
          userId,
          productId,
          size: size || null,
          color: color || null
        }
      }
    });

    let cartItem;

    if (existingCartItem) {
      // Update quantity if item already exists
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { 
          quantity: existingCartItem.quantity + quantity,
          updatedAt: new Date()
        },
        include: { product: true }
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
          size,
          color
        },
        include: { product: true }
      });
    }

    const formattedCartItem = {
      id: cartItem.id,
      name: cartItem.product.name,
      price: cartItem.product.price,
      image: cartItem.product.imageUrl || '/images/products/default.jpg',
      quantity: cartItem.quantity,
      size: cartItem.size,
      color: cartItem.color,
      productId: cartItem.productId
    };

    return NextResponse.json({ 
      message: existingCartItem ? 'Cart item updated' : 'Item added to cart', 
      cartItem: formattedCartItem 
    });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
  }
}

// PUT - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, itemId, quantity } = body;

    if (!userId || !itemId || quantity < 1) {
      return NextResponse.json({ error: 'Valid User ID, Item ID, and quantity are required' }, { status: 400 });
    }

    // Update the cart item quantity in the database
    const cartItem = await prisma.cartItem.update({
      where: { 
        id: itemId,
        userId: userId // Ensure user owns this cart item
      },
      data: { 
        quantity,
        updatedAt: new Date()
      },
      include: { product: true }
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    const formattedCartItem = {
      id: cartItem.id,
      name: cartItem.product.name,
      price: cartItem.product.price,
      image: cartItem.product.imageUrl || '/images/products/default.jpg',
      quantity: cartItem.quantity,
      size: cartItem.size,
      color: cartItem.color,
      productId: cartItem.productId
    };

    return NextResponse.json({ 
      message: 'Cart item updated', 
      cartItem: formattedCartItem 
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 });
  }
}

// DELETE - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const itemId = searchParams.get('itemId');

    if (!userId || !itemId) {
      return NextResponse.json({ error: 'User ID and Item ID are required' }, { status: 400 });
    }

    // Delete the cart item from the database
    const deletedCartItem = await prisma.cartItem.delete({
      where: { 
        id: itemId,
        userId: userId // Ensure user owns this cart item
      }
    });

    if (!deletedCartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Item removed from cart', 
      itemId: deletedCartItem.id 
    });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json({ error: 'Failed to remove cart item' }, { status: 500 });
  }
}

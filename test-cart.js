const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCartOperations() {
  try {
    console.log('🔍 Testing cart operations...');

    // Get the existing customer user
    const user = await prisma.user.findUnique({
      where: { email: 'customer@example.com' }
    });

    if (!user) {
      console.error('❌ Customer user not found!');
      return;
    }

    console.log('✅ Found user:', user.id, user.email);

    // Try to create a cart item
    console.log('🛒 Creating cart item...');
    
    // First, get a product to add to cart
    const product = await prisma.product.findFirst();
    if (!product) {
      console.error('❌ No products found!');
      return;
    }

    console.log('✅ Found product:', product.id, product.name);

    // Check if product variant exists
    const variant = await prisma.productVariant.findFirst({
      where: { productId: product.id }
    });

    console.log('🔍 Product variant:', variant ? variant.id : 'None found');

    // Try creating cart item
    const cartItem = await prisma.cartItem.create({
      data: {
        userId: user.id,
        productId: product.id,
        quantity: 1,
        productVariantId: variant ? variant.id : null
      },
      include: {
        product: true,
        productVariant: true
      }
    });

    console.log('✅ Cart item created successfully:', cartItem);

    // Clean up - delete the test cart item
    await prisma.cartItem.delete({
      where: { id: cartItem.id }
    });

    console.log('✅ Test cart item cleaned up');

  } catch (error) {
    console.error('❌ Error during cart operations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCartOperations();

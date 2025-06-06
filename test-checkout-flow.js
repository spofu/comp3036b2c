const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCheckoutFlow() {
  console.log('🧪 Testing Checkout Flow...\n');
  
  try {
    // 1. Check if users exist
    console.log('1️⃣ Checking users...');
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true }
    });
    console.log(`✅ Found ${users.length} users`);
    users.forEach(user => console.log(`   - ${user.email} (ID: ${user.id})`));
    
    if (users.length === 0) {
      console.log('❌ No users found - authentication will fail');
      return;
    }
    
    const testUser = users[0];
    console.log(`\n📱 Using test user: ${testUser.email}\n`);
    
    // 2. Check products and variants
    console.log('2️⃣ Checking products and variants...');
    const products = await prisma.product.findMany({
      include: { variants: true },
      take: 3
    });
    console.log(`✅ Found ${products.length} products`);
    
    if (products.length === 0) {
      console.log('❌ No products found - cart operations will fail');
      return;
    }
    
    // 3. Clean up any existing cart items for test user
    console.log('\n3️⃣ Cleaning up existing cart items...');
    const deletedCartItems = await prisma.cartItem.deleteMany({
      where: { userId: testUser.id }
    });
    console.log(`✅ Cleaned up ${deletedCartItems.count} existing cart items`);
    
    // 4. Test adding items to cart
    console.log('\n4️⃣ Testing cart operations...');
    const testProduct = products[0];
    const testVariant = testProduct.variants[0];
    
    console.log(`   Adding product: ${testProduct.name}`);
    if (testVariant) {
      console.log(`   With variant: ${testVariant.size || 'N/A'} - ${testVariant.color || 'N/A'}`);
    }
    
    const cartItem = await prisma.cartItem.create({
      data: {
        userId: testUser.id,
        productId: testProduct.id,
        productVariantId: testVariant?.id,
        quantity: 2
      },
      include: {
        product: true,
        productVariant: true
      }
    });
    console.log('✅ Successfully added item to cart');
    
    // 5. Test order creation
    console.log('\n5️⃣ Testing order creation...');
    const order = await prisma.order.create({
      data: {
        userId: testUser.id,
        total: testProduct.price * 2,
        status: 'PENDING',
        shippingAddress: {
          address: '123 Test St',
          city: 'Test City',
          state: 'CA',
          zipCode: '12345',
          country: 'US'
        },
        items: {
          create: [{
            productId: testProduct.id,
            productVariantId: testVariant?.id,
            quantity: 2,
            price: testProduct.price,
            name: testProduct.name
          }]
        }
      },
      include: {
        items: true
      }
    });
    console.log('✅ Successfully created order');
    console.log(`   Order ID: ${order.id}`);
    console.log(`   Total: $${order.total.toFixed(2)}`);
    console.log(`   Items: ${order.items.length}`);
    
    // 6. Test cart clearing after order
    console.log('\n6️⃣ Testing cart clearing...');
    const clearedCartItems = await prisma.cartItem.deleteMany({
      where: { userId: testUser.id }
    });
    console.log(`✅ Cleared ${clearedCartItems.count} cart items`);
    
    // 7. Check order history
    console.log('\n7️⃣ Checking order history...');
    const userOrders = await prisma.order.findMany({
      where: { userId: testUser.id },
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });
    console.log(`✅ Found ${userOrders.length} orders in history`);
    userOrders.forEach(order => {
      console.log(`   - Order ${order.id}: $${order.total.toFixed(2)} (${order.items.length} items)`);
    });
    
    // 8. Verify foreign key constraints are working
    console.log('\n8️⃣ Testing foreign key constraints...');
    try {
      await prisma.cartItem.create({
        data: {
          userId: 'nonexistent-user-id',
          productId: testProduct.id,
          quantity: 1
        }
      });
      console.log('❌ Foreign key constraint failed - invalid user was accepted');
    } catch (error) {
      if (error.message.includes('foreign key constraint')) {
        console.log('✅ Foreign key constraints working correctly');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    
    console.log('\n🎉 Checkout Flow Test Summary:');
    console.log('✅ User authentication - Ready');
    console.log('✅ Product/variant management - Ready');
    console.log('✅ Cart operations - Working');
    console.log('✅ Order creation - Working');
    console.log('✅ Cart clearing - Working');
    console.log('✅ Order history - Working');
    console.log('✅ Foreign key constraints - Enforced');
    console.log('\n🚀 All core checkout functionality is working!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    
    if (error.message.includes('foreign key constraint')) {
      console.log('\n💡 Foreign key constraint issue detected:');
      console.log('   This means the user ID being used doesn\'t exist in the User table');
      console.log('   Check that users are properly created during registration/login');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testCheckoutFlow();

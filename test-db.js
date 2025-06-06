const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking database contents...\n');
  
  // Check users
  const users = await prisma.user.findMany();
  console.log('👥 Users:', users.length);
  users.forEach(user => console.log(`  - ${user.email} (${user.role})`));
  
  // Check products
  const products = await prisma.product.findMany();
  console.log('\n📦 Products:', products.length);
  products.forEach(product => console.log(`  - ${product.id}: ${product.name} ($${product.price})`));
  
  // Check cart items
  const cartItems = await prisma.cartItem.findMany({
    include: {
      user: true,
      product: true
    }
  });
  console.log('\n🛒 Cart Items:', cartItems.length);
  cartItems.forEach(item => console.log(`  - User: ${item.user.email}, Product: ${item.product.name}, Qty: ${item.quantity}`));
  
  // If no products exist, create a test product
  if (products.length === 0) {
    console.log('\n➕ No products found, creating test product...');
    const testProduct = await prisma.product.create({
      data: {
        name: 'Test T-Shirt',
        description: 'A comfortable test t-shirt',
        price: 29.99,
        stock: 100,
        imageUrl: '/images/products/product-1.jpg',
        category: 'Clothing',
        subcategory: 'T-Shirts',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Blue', 'Red', 'Green']
      }
    });
    console.log(`✅ Created test product: ${testProduct.id}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

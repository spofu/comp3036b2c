import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Seed users for testing authentication
  console.log('Seeding users...');
  
  const hashedCustomerPassword = await bcrypt.hash('password123', 10);
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  
  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      hashedPassword: hashedCustomerPassword,
      name: 'John Customer',
      role: 'CUSTOMER'
    }
  });
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      hashedPassword: hashedAdminPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  });
  
  console.log(`Created customer user: ${customerUser.email}`);
  console.log(`Created admin user: ${adminUser.email}`);

  // Seed categories
  console.log('Seeding categories...');
  const tshirtCategory = await prisma.category.upsert({ 
    where: { name: "Men's T-Shirts" }, 
    update: {}, 
    create: { name: "Men's T-Shirts" } 
  });
  
  const jacketCategory = await prisma.category.upsert({ 
    where: { name: "Men's Jackets" }, 
    update: {}, 
    create: { name: "Men's Jackets" } 
  });
  
  const hoodieCategory = await prisma.category.upsert({ 
    where: { name: "Men's Hoodies" }, 
    update: {}, 
    create: { name: "Men's Hoodies" } 
  });
  
  const poloCategory = await prisma.category.upsert({ 
    where: { name: "Men's Polo Shirts" }, 
    update: {}, 
    create: { name: "Men's Polo Shirts" } 
  });
  
  const pantsCategory = await prisma.category.upsert({ 
    where: { name: "Men's Pants" }, 
    update: {}, 
    create: { name: "Men's Pants" } 
  });

  // Clear existing data to avoid conflicts
  await prisma.productSize.deleteMany({});
  await prisma.productColor.deleteMany({});

  // Seed Men's T-Shirts
  await prisma.product.createMany({
    data: [
      {
        name: 'Classic Cotton Crew Neck T-Shirt',
        description: 'Premium 100% cotton crew neck tee with comfortable fit and durable construction',
        price: 24.99,
        stock: 120,
        imageUrl: '/images/products/product-1.jpg',
        categoryId: tshirtCategory.id,
      },
      {
        name: 'Vintage Graphic Print T-Shirt',
        description: 'Retro-style graphic tee with distressed print and soft-wash finish',
        price: 29.99,
        stock: 85,
        imageUrl: '/images/products/product-2.jpg',
        categoryId: tshirtCategory.id,
      },
      {
        name: 'Performance Athletic T-Shirt',
        description: 'Moisture-wicking polyester blend tee perfect for workouts and active wear',
        price: 34.99,
        stock: 95,
        imageUrl: '/images/products/product-3.jpg',
        categoryId: tshirtCategory.id,
      },
    ],
    skipDuplicates: true
  });

  // Get created T-shirt products
  const tshirtProducts = await prisma.product.findMany({
    where: { categoryId: tshirtCategory.id }
  });

  // Add sizes and colors for T-Shirts
  for (const product of tshirtProducts) {
    // Add sizes
    await prisma.productSize.createMany({
      data: [
        { productId: product.id, size: 'S', stock: 20 },
        { productId: product.id, size: 'M', stock: 30 },
        { productId: product.id, size: 'L', stock: 25 },
        { productId: product.id, size: 'XL', stock: 15 },
      ],
      skipDuplicates: true
    });

    // Add colors
    await prisma.productColor.createMany({
      data: [
        { productId: product.id, color: 'Black', stock: 25 },
        { productId: product.id, color: 'White', stock: 30 },
        { productId: product.id, color: 'Navy', stock: 20 },
        { productId: product.id, color: 'Gray', stock: 15 },
      ],
      skipDuplicates: true
    });
  }

  // Seed Men's Jackets
  await prisma.product.createMany({
    data: [
      {
        name: 'Genuine Leather Biker Jacket',
        description: 'Premium genuine leather jacket with quilted shoulders and multiple pockets',
        price: 249.99,
        stock: 25,
        imageUrl: '/images/products/product-4.jpg',
        categoryId: jacketCategory.id,
      },
      {
        name: 'Waterproof Rain Jacket',
        description: 'Lightweight waterproof jacket with breathable fabric and adjustable hood',
        price: 89.99,
        stock: 60,
        imageUrl: '/images/products/product-5.jpg',
        categoryId: jacketCategory.id,
      },
      {
        name: 'Classic Denim Jacket',
        description: 'Timeless blue denim jacket with button closure and chest pockets',
        price: 79.99,
        stock: 45,
        imageUrl: '/images/products/product-6.jpg',
        categoryId: jacketCategory.id,
      },
    ],
    skipDuplicates: true
  });

  // Get created Jacket products
  const jacketProducts = await prisma.product.findMany({
    where: { categoryId: jacketCategory.id }
  });

  // Add sizes and colors for Jackets
  for (const product of jacketProducts) {
    // Add sizes
    await prisma.productSize.createMany({
      data: [
        { productId: product.id, size: 'M', stock: 8 },
        { productId: product.id, size: 'L', stock: 12 },
        { productId: product.id, size: 'XL', stock: 10 },
        { productId: product.id, size: 'XXL', stock: 5 },
      ],
      skipDuplicates: true
    });

    // Add colors (fewer colors for jackets)
    await prisma.productColor.createMany({
      data: [
        { productId: product.id, color: 'Black', stock: 15 },
        { productId: product.id, color: 'Brown', stock: 10 },
        { productId: product.id, color: 'Navy', stock: 8 },
      ],
      skipDuplicates: true
    });
  }

  // Seed Men's Hoodies
  await prisma.product.createMany({
    data: [
      {
        name: 'Pullover Fleece Hoodie',
        description: 'Cozy fleece-lined pullover hoodie with kangaroo pocket and drawstring hood',
        price: 54.99,
        stock: 75,
        imageUrl: '/images/products/product-7.jpg',
        categoryId: hoodieCategory.id,
      },
      {
        name: 'Zip-Up Athletic Hoodie',
        description: 'Full-zip hoodie with moisture-wicking fabric and athletic fit',
        price: 64.99,
        stock: 55,
        imageUrl: '/images/products/product-8.jpg',
        categoryId: hoodieCategory.id,
      },
      {
        name: 'Oversized Streetwear Hoodie',
        description: 'Trendy oversized hoodie with bold logo print and dropped shoulders',
        price: 69.99,
        stock: 40,
        imageUrl: '/images/products/product-9.jpg',
        categoryId: hoodieCategory.id,
      },
    ],
    skipDuplicates: true
  });

  // Get created Hoodie products
  const hoodieProducts = await prisma.product.findMany({
    where: { categoryId: hoodieCategory.id }
  });

  // Add sizes and colors for Hoodies
  for (const product of hoodieProducts) {
    // Add sizes
    await prisma.productSize.createMany({
      data: [
        { productId: product.id, size: 'S', stock: 12 },
        { productId: product.id, size: 'M', stock: 18 },
        { productId: product.id, size: 'L', stock: 20 },
        { productId: product.id, size: 'XL', stock: 15 },
        { productId: product.id, size: 'XXL', stock: 10 },
      ],
      skipDuplicates: true
    });

    // Add colors
    await prisma.productColor.createMany({
      data: [
        { productId: product.id, color: 'Black', stock: 20 },
        { productId: product.id, color: 'Gray', stock: 18 },
        { productId: product.id, color: 'Navy', stock: 15 },
        { productId: product.id, color: 'Maroon', stock: 12 },
      ],
      skipDuplicates: true
    });
  }

  // Seed Men's Polo Shirts
  await prisma.product.createMany({
    data: [
      {
        name: 'Classic Pique Polo Shirt',
        description: 'Traditional pique cotton polo with three-button placket and ribbed collar',
        price: 39.99,
        stock: 90,
        imageUrl: '/images/products/product-10.jpg',
        categoryId: poloCategory.id,
      },
      {
        name: 'Performance Golf Polo',
        description: 'Moisture-wicking golf polo with UV protection and stretch fabric',
        price: 49.99,
        stock: 70,
        imageUrl: '/images/products/product-11.jpg',
        categoryId: poloCategory.id,
      },
      {
        name: 'Slim Fit Modern Polo',
        description: 'Contemporary slim-fit polo with contrast collar and premium cotton blend',
        price: 44.99,
        stock: 65,
        imageUrl: '/images/products/product-12.jpg',
        categoryId: poloCategory.id,
      },
    ],
    skipDuplicates: true
  });

  // Get created Polo products
  const poloProducts = await prisma.product.findMany({
    where: { categoryId: poloCategory.id }
  });

  // Add sizes and colors for Polo Shirts
  for (const product of poloProducts) {
    // Add sizes
    await prisma.productSize.createMany({
      data: [
        { productId: product.id, size: 'S', stock: 15 },
        { productId: product.id, size: 'M', stock: 25 },
        { productId: product.id, size: 'L', stock: 22 },
        { productId: product.id, size: 'XL', stock: 18 },
      ],
      skipDuplicates: true
    });

    // Add colors
    await prisma.productColor.createMany({
      data: [
        { productId: product.id, color: 'White', stock: 25 },
        { productId: product.id, color: 'Navy', stock: 22 },
        { productId: product.id, color: 'Black', stock: 18 },
        { productId: product.id, color: 'Green', stock: 15 },
        { productId: product.id, color: 'Red', stock: 10 },
      ],
      skipDuplicates: true
    });
  }

  // Seed Men's Pants
  await prisma.product.createMany({
    data: [
      {
        name: 'Slim Fit Dark Wash Jeans',
        description: 'Premium denim jeans with slim fit, dark wash, and comfortable stretch',
        price: 79.99,
        stock: 80,
        imageUrl: '/images/products/product-13.jpg',
        categoryId: pantsCategory.id,
      },
      {
        name: 'Business Casual Chino Pants',
        description: 'Versatile cotton chino pants perfect for office or casual occasions',
        price: 59.99,
        stock: 100,
        imageUrl: '/images/products/product-14.jpg',
        categoryId: pantsCategory.id,
      },
      {
        name: 'Cargo Utility Pants',
        description: 'Durable cargo pants with multiple pockets and relaxed fit',
        price: 49.99,
        stock: 50,
        imageUrl: '/images/products/product-15.jpg',
        categoryId: pantsCategory.id,
      },
    ],
    skipDuplicates: true
  });

  // Get created Pants products
  const pantsProducts = await prisma.product.findMany({
    where: { categoryId: pantsCategory.id }
  });

  // Add sizes and colors for Pants
  for (const product of pantsProducts) {
    // Add sizes (waist sizes for pants)
    await prisma.productSize.createMany({
      data: [
        { productId: product.id, size: '30', stock: 12 },
        { productId: product.id, size: '32', stock: 20 },
        { productId: product.id, size: '34', stock: 18 },
        { productId: product.id, size: '36', stock: 15 },
        { productId: product.id, size: '38', stock: 10 },
      ],
      skipDuplicates: true
    });

    // Add colors
    await prisma.productColor.createMany({
      data: [
        { productId: product.id, color: 'Blue', stock: 20 },
        { productId: product.id, color: 'Black', stock: 18 },
        { productId: product.id, color: 'Khaki', stock: 15 },
        { productId: product.id, color: 'Gray', stock: 12 },
      ],
      skipDuplicates: true
    });
  }

  console.log('Seeded 5 categories with 3 products each (15 total products)');
}

main()
  .then(() => {
    console.log('Seed completed.');
  })
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
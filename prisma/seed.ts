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

  // Seed Men's T-Shirts
  await prisma.product.createMany({
    data: [
      {
        name: 'Classic Cotton Crew Neck T-Shirt',
        description: 'Premium 100% cotton crew neck tee with comfortable fit and durable construction',
        price: 24.99,
        stock: 120,
        imageUrl: 'https://example.com/images/mens-cotton-tshirt.jpg',
        categoryId: tshirtCategory.id,
      },
      {
        name: 'Vintage Graphic Print T-Shirt',
        description: 'Retro-style graphic tee with distressed print and soft-wash finish',
        price: 29.99,
        stock: 85,
        imageUrl: 'https://example.com/images/mens-graphic-tshirt.jpg',
        categoryId: tshirtCategory.id,
      },
      {
        name: 'Performance Athletic T-Shirt',
        description: 'Moisture-wicking polyester blend tee perfect for workouts and active wear',
        price: 34.99,
        stock: 95,
        imageUrl: 'https://example.com/images/mens-athletic-tshirt.jpg',
        categoryId: tshirtCategory.id,
      },
    ],
  });

  // Seed Men's Jackets
  await prisma.product.createMany({
    data: [
      {
        name: 'Genuine Leather Biker Jacket',
        description: 'Premium genuine leather jacket with quilted shoulders and multiple pockets',
        price: 249.99,
        stock: 25,
        imageUrl: 'https://example.com/images/mens-leather-jacket.jpg',
        categoryId: jacketCategory.id,
      },
      {
        name: 'Waterproof Rain Jacket',
        description: 'Lightweight waterproof jacket with breathable fabric and adjustable hood',
        price: 89.99,
        stock: 60,
        imageUrl: 'https://example.com/images/mens-rain-jacket.jpg',
        categoryId: jacketCategory.id,
      },
      {
        name: 'Classic Denim Jacket',
        description: 'Timeless blue denim jacket with button closure and chest pockets',
        price: 79.99,
        stock: 45,
        imageUrl: 'https://example.com/images/mens-denim-jacket.jpg',
        categoryId: jacketCategory.id,
      },
    ],
  });

  // Seed Men's Hoodies
  await prisma.product.createMany({
    data: [
      {
        name: 'Pullover Fleece Hoodie',
        description: 'Cozy fleece-lined pullover hoodie with kangaroo pocket and drawstring hood',
        price: 54.99,
        stock: 75,
        imageUrl: 'https://example.com/images/mens-pullover-hoodie.jpg',
        categoryId: hoodieCategory.id,
      },
      {
        name: 'Zip-Up Athletic Hoodie',
        description: 'Full-zip hoodie with moisture-wicking fabric and athletic fit',
        price: 64.99,
        stock: 55,
        imageUrl: 'https://example.com/images/mens-zip-hoodie.jpg',
        categoryId: hoodieCategory.id,
      },
      {
        name: 'Oversized Streetwear Hoodie',
        description: 'Trendy oversized hoodie with bold logo print and dropped shoulders',
        price: 69.99,
        stock: 40,
        imageUrl: 'https://example.com/images/mens-oversized-hoodie.jpg',
        categoryId: hoodieCategory.id,
      },
    ],
  });

  // Seed Men's Polo Shirts
  await prisma.product.createMany({
    data: [
      {
        name: 'Classic Pique Polo Shirt',
        description: 'Traditional pique cotton polo with three-button placket and ribbed collar',
        price: 39.99,
        stock: 90,
        imageUrl: 'https://example.com/images/mens-classic-polo.jpg',
        categoryId: poloCategory.id,
      },
      {
        name: 'Performance Golf Polo',
        description: 'Moisture-wicking golf polo with UV protection and stretch fabric',
        price: 49.99,
        stock: 70,
        imageUrl: 'https://example.com/images/mens-golf-polo.jpg',
        categoryId: poloCategory.id,
      },
      {
        name: 'Slim Fit Modern Polo',
        description: 'Contemporary slim-fit polo with contrast collar and premium cotton blend',
        price: 44.99,
        stock: 65,
        imageUrl: 'https://example.com/images/mens-slim-polo.jpg',
        categoryId: poloCategory.id,
      },
    ],
  });

  // Seed Men's Pants
  await prisma.product.createMany({
    data: [
      {
        name: 'Slim Fit Dark Wash Jeans',
        description: 'Premium denim jeans with slim fit, dark wash, and comfortable stretch',
        price: 79.99,
        stock: 80,
        imageUrl: 'https://example.com/images/mens-slim-jeans.jpg',
        categoryId: pantsCategory.id,
      },
      {
        name: 'Business Casual Chino Pants',
        description: 'Versatile cotton chino pants perfect for office or casual occasions',
        price: 59.99,
        stock: 100,
        imageUrl: 'https://example.com/images/mens-chino-pants.jpg',
        categoryId: pantsCategory.id,
      },
      {
        name: 'Cargo Utility Pants',
        description: 'Durable cargo pants with multiple pockets and relaxed fit',
        price: 49.99,
        stock: 50,
        imageUrl: 'https://example.com/images/mens-cargo-pants.jpg',
        categoryId: pantsCategory.id,
      },
    ],
  });

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
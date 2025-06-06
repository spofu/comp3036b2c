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
  
  console.log(`Created users: ${customerUser.email}, ${adminUser.email}`);

  // Seed categories - use upsert to handle existing categories
  console.log('Seeding categories...');
  const categoryNames = ["Men's T-Shirts", "Men's Jackets", "Men's Hoodies", "Men's Polo Shirts", "Men's Pants"];
  
  const categories = await Promise.all(
    categoryNames.map(name => 
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name }
      })
    )
  );

  const [tshirtCategory, jacketCategory, hoodieCategory, poloCategory, pantsCategory] = categories;

  // Product data with variants
  const productData = [
    // T-Shirts
    {
      name: 'Classic Cotton Crew Neck T-Shirt',
      slug: 'classic-cotton-crew-neck-tshirt',
      description: 'Premium 100% cotton crew neck tee with comfortable fit and durable construction',
      price: 24.99,
      imageUrl: '/images/products/product-1.jpg',
      categoryId: tshirtCategory.id,
      variants: [
        { size: 'S', color: 'Black', stock: 15, sku: 'CCT-S-BLK' },
        { size: 'S', color: 'White', stock: 20, sku: 'CCT-S-WHT' },
        { size: 'M', color: 'Black', stock: 25, sku: 'CCT-M-BLK' },
        { size: 'M', color: 'White', stock: 30, sku: 'CCT-M-WHT' },
        { size: 'L', color: 'Black', stock: 20, sku: 'CCT-L-BLK' },
        { size: 'L', color: 'White', stock: 25, sku: 'CCT-L-WHT' },
        { size: 'XL', color: 'Black', stock: 15, sku: 'CCT-XL-BLK' },
        { size: 'XL', color: 'White', stock: 18, sku: 'CCT-XL-WHT' }
      ]
    },
    {
      name: 'Vintage Graphic Print T-Shirt',
      slug: 'vintage-graphic-print-tshirt',
      description: 'Retro-style graphic tee with distressed print and soft-wash finish',
      price: 29.99,
      imageUrl: '/images/products/product-2.jpg',
      categoryId: tshirtCategory.id,
      variants: [
        { size: 'S', color: 'Navy', stock: 12, sku: 'VGT-S-NAV' },
        { size: 'M', color: 'Navy', stock: 18, sku: 'VGT-M-NAV' },
        { size: 'M', color: 'Gray', stock: 15, sku: 'VGT-M-GRY' },
        { size: 'L', color: 'Navy', stock: 20, sku: 'VGT-L-NAV' },
        { size: 'L', color: 'Gray', stock: 16, sku: 'VGT-L-GRY' },
        { size: 'XL', color: 'Navy', stock: 14, sku: 'VGT-XL-NAV' }
      ]
    },
    
    // Jackets
    {
      name: 'Genuine Leather Biker Jacket',
      slug: 'genuine-leather-biker-jacket',
      description: 'Premium genuine leather jacket with quilted shoulders and multiple pockets',
      price: 249.99,
      imageUrl: '/images/products/product-4.jpg',
      categoryId: jacketCategory.id,
      variants: [
        { size: 'M', color: 'Black', stock: 5, sku: 'LBJ-M-BLK' },
        { size: 'L', color: 'Black', stock: 8, sku: 'LBJ-L-BLK' },
        { size: 'L', color: 'Brown', stock: 6, sku: 'LBJ-L-BRN' },
        { size: 'XL', color: 'Black', stock: 6, sku: 'LBJ-XL-BLK' }
      ]
    },
    {
      name: 'Waterproof Rain Jacket',
      slug: 'waterproof-rain-jacket',
      description: 'Lightweight waterproof jacket with breathable fabric and adjustable hood',
      price: 89.99,
      imageUrl: '/images/products/product-5.jpg',
      categoryId: jacketCategory.id,
      variants: [
        { size: 'M', color: 'Navy', stock: 15, sku: 'WRJ-M-NAV' },
        { size: 'L', color: 'Navy', stock: 20, sku: 'WRJ-L-NAV' },
        { size: 'L', color: 'Black', stock: 18, sku: 'WRJ-L-BLK' },
        { size: 'XL', color: 'Navy', stock: 12, sku: 'WRJ-XL-NAV' }
      ]
    },

    // Hoodies
    {
      name: 'Pullover Fleece Hoodie',
      slug: 'pullover-fleece-hoodie',
      description: 'Cozy fleece-lined pullover hoodie with kangaroo pocket and drawstring hood',
      price: 54.99,
      imageUrl: '/images/products/product-7.jpg',
      categoryId: hoodieCategory.id,
      variants: [
        { size: 'S', color: 'Black', stock: 12, sku: 'PFH-S-BLK' },
        { size: 'M', color: 'Black', stock: 18, sku: 'PFH-M-BLK' },
        { size: 'M', color: 'Gray', stock: 15, sku: 'PFH-M-GRY' },
        { size: 'L', color: 'Black', stock: 20, sku: 'PFH-L-BLK' },
        { size: 'L', color: 'Gray', stock: 16, sku: 'PFH-L-GRY' },
        { size: 'XL', color: 'Black', stock: 14, sku: 'PFH-XL-BLK' }
      ]
    },

    // Polo Shirts
    {
      name: 'Classic Pique Polo Shirt',
      slug: 'classic-pique-polo-shirt',
      description: 'Traditional pique cotton polo with three-button placket and ribbed collar',
      price: 39.99,
      imageUrl: '/images/products/product-10.jpg',
      categoryId: poloCategory.id,
      variants: [
        { size: 'S', color: 'White', stock: 15, sku: 'CPP-S-WHT' },
        { size: 'M', color: 'White', stock: 20, sku: 'CPP-M-WHT' },
        { size: 'M', color: 'Navy', stock: 18, sku: 'CPP-M-NAV' },
        { size: 'L', color: 'White', stock: 22, sku: 'CPP-L-WHT' },
        { size: 'L', color: 'Navy', stock: 20, sku: 'CPP-L-NAV' },
        { size: 'XL', color: 'Navy', stock: 15, sku: 'CPP-XL-NAV' }
      ]
    },

    // Pants
    {
      name: 'Slim Fit Dark Wash Jeans',
      slug: 'slim-fit-dark-wash-jeans',
      description: 'Premium denim jeans with slim fit, dark wash, and comfortable stretch',
      price: 79.99,
      imageUrl: '/images/products/product-13.jpg',
      categoryId: pantsCategory.id,
      variants: [
        { size: '30', color: 'Blue', stock: 12, sku: 'SFJ-30-BLU' },
        { size: '32', color: 'Blue', stock: 20, sku: 'SFJ-32-BLU' },
        { size: '32', color: 'Black', stock: 18, sku: 'SFJ-32-BLK' },
        { size: '34', color: 'Blue', stock: 18, sku: 'SFJ-34-BLU' },
        { size: '34', color: 'Black', stock: 16, sku: 'SFJ-34-BLK' },
        { size: '36', color: 'Blue', stock: 12, sku: 'SFJ-36-BLU' }
      ]
    },
    {
      name: 'Business Casual Chino Pants',
      slug: 'business-casual-chino-pants',
      description: 'Versatile cotton chino pants perfect for office or casual occasions',
      price: 59.99,
      imageUrl: '/images/products/product-14.jpg',
      categoryId: pantsCategory.id,
      variants: [
        { size: '30', color: 'Khaki', stock: 15, sku: 'BCC-30-KHK' },
        { size: '32', color: 'Khaki', stock: 25, sku: 'BCC-32-KHK' },
        { size: '32', color: 'Gray', stock: 20, sku: 'BCC-32-GRY' },
        { size: '34', color: 'Khaki', stock: 22, sku: 'BCC-34-KHK' },
        { size: '34', color: 'Gray', stock: 18, sku: 'BCC-34-GRY' }
      ]
    }
  ];

  // Create products with variants
  console.log('Seeding products and variants...');
  
  for (const productInfo of productData) {
    const { variants, ...productData } = productInfo;
    
    // Calculate total stock from variants
    const totalStock = variants.reduce((sum, variant) => sum + variant.stock, 0);
    
    // Check if product already exists by slug
    const existingProduct = await prisma.product.findUnique({
      where: { slug: productData.slug }
    });
    
    if (existingProduct) {
      console.log(`Product already exists: ${productData.name}, skipping...`);
      continue;
    }
    
    // Create product
    const product = await prisma.product.create({
      data: {
        ...productData,
        stock: totalStock
      }
    });

    // Create variants for this product
    await prisma.productVariant.createMany({
      data: variants.map(variant => ({
        ...variant,
        productId: product.id
      }))
    });

    console.log(`Created product: ${product.name} with ${variants.length} variants`);
  }

  // Create sample addresses for the customer (use upsert to avoid duplicates)
  const existingAddress = await prisma.address.findFirst({
    where: { 
      userId: customerUser.id,
      street: '123 Main Street'
    }
  });

  if (!existingAddress) {
    await prisma.address.create({
      data: {
        userId: customerUser.id,
        street: '123 Main Street',
        apartment: 'Apt 4B',
        city: 'Sydney',
        state: 'NSW',
        zipCode: '2000',
        country: 'Australia'
      }
    });
    console.log('Created sample address for customer');
  } else {
    console.log('Sample address already exists, skipping...');
  }

  console.log('Seeding completed successfully!');
  console.log(`Categories: ${categories.length}`);
  console.log(`Products: ${productData.length}`);
  console.log(`Product variants: ${productData.reduce((sum, p) => sum + p.variants.length, 0)}`);
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
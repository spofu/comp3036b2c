import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed categories
  const mensCategory = await prisma.category.upsert({ where: { name: "Men's Clothing" }, update: {}, create: { name: "Men's Clothing" } });
  const womensCategory = await prisma.category.upsert({ where: { name: "Women's Clothing" }, update: {}, create: { name: "Women's Clothing" } });
  const kidsCategory = await prisma.category.upsert({ where: { name: "Kids' Clothing" }, update: {}, create: { name: "Kids' Clothing" } });

  // Seed products for Men's Clothing
  await prisma.product.createMany({
    data: [
      {
        name: 'Classic Polo Shirt',
        description: 'A timeless polo shirt in various colors',
        price: 29.99,
        stock: 50,
        imageUrl: 'https://example.com/images/mens-polo.jpg',
        categoryId: mensCategory.id,
      },
      {
        name: 'Slim Fit Jeans',
        description: 'Comfortable slim fit denim jeans',
        price: 59.99,
        stock: 40,
        imageUrl: 'https://example.com/images/mens-jeans.jpg',
        categoryId: mensCategory.id,
      },
      {
        name: 'Leather Jacket',
        description: 'Genuine leather biker jacket',
        price: 199.99,
        stock: 15,
        imageUrl: 'https://example.com/images/mens-jacket.jpg',
        categoryId: mensCategory.id,
      },
    ],
  });

  // Seed products for Women's Clothing
  await prisma.product.createMany({
    data: [
      {
        name: 'Floral Summer Dress',
        description: 'Lightweight floral print summer dress',
        price: 49.99,
        stock: 60,
        imageUrl: 'https://example.com/images/womens-dress.jpg',
        categoryId: womensCategory.id,
      },
      {
        name: 'Denim Jacket',
        description: 'Stylish distressed denim jacket',
        price: 79.99,
        stock: 30,
        imageUrl: 'https://example.com/images/womens-jacket.jpg',
        categoryId: womensCategory.id,
      },
      {
        name: 'High Waist Leggings',
        description: 'Comfortable high waist leggings',
        price: 39.99,
        stock: 70,
        imageUrl: 'https://example.com/images/womens-leggings.jpg',
        categoryId: womensCategory.id,
      },
    ],
  });

  // Seed products for Kids' Clothing
  await prisma.product.createMany({
    data: [
      {
        name: 'Kids Graphic Tee',
        description: 'Colorful graphic tee for kids',
        price: 19.99,
        stock: 80,
        imageUrl: 'https://example.com/images/kids-tee.jpg',
        categoryId: kidsCategory.id,
      },
      {
        name: 'Cargo Shorts',
        description: 'Durable cargo shorts',
        price: 24.99,
        stock: 55,
        imageUrl: 'https://example.com/images/kids-shorts.jpg',
        categoryId: kidsCategory.id,
      },
      {
        name: 'Hooded Sweatshirt',
        description: 'Cozy hooded sweatshirt',
        price: 34.99,
        stock: 45,
        imageUrl: 'https://example.com/images/kids-sweatshirt.jpg',
        categoryId: kidsCategory.id,
      },
    ],
  });
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
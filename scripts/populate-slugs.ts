import { PrismaClient } from '@prisma/client';
import { generateProductSlug } from '../src/app/api/utils/slugUtils';

const prisma = new PrismaClient();

async function populateSlugs() {
  console.log('Starting slug population for existing products...');

  try {
    // Get all products that don't have slugs
    const productsWithoutSlugs = await prisma.product.findMany({
      where: {
        slug: null
      },
      select: {
        id: true,
        name: true
      }
    });

    console.log(`Found ${productsWithoutSlugs.length} products without slugs`);

    // Get all existing slugs to ensure uniqueness
    const existingSlugs = await prisma.product.findMany({
      where: {
        slug: {
          not: null
        }
      },
      select: {
        slug: true
      }
    });

    const existingSlugArray = existingSlugs.map(p => p.slug!);

    // Generate and update slugs
    for (const product of productsWithoutSlugs) {
      const slug = generateProductSlug(product.name, existingSlugArray);
      
      // Add the new slug to our existing array to prevent duplicates
      existingSlugArray.push(slug);

      await prisma.product.update({
        where: { id: product.id },
        data: { slug }
      });

      console.log(`Generated slug "${slug}" for product: ${product.name}`);
    }

    console.log('✅ Slug population completed successfully!');
  } catch (error) {
    console.error('❌ Error populating slugs:', error);
    throw error;
  }
}

async function main() {
  try {
    await populateSlugs();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { populateSlugs };

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function convertImageToBase64(imageUrl: string): Promise<string | null> {
  try {
    // Check if it's a local image path
    if (imageUrl.startsWith('/images/')) {
      const imagePath = path.join(process.cwd(), 'public', imageUrl)
      if (fs.existsSync(imagePath)) {
        const imageBuffer = fs.readFileSync(imagePath)
        const base64 = imageBuffer.toString('base64')
        const mimeType = getMimeType(imagePath)
        return `data:${mimeType};base64,${base64}`
      }
    }
    
    // For external URLs, we'll just store the URL for now
    // In a real implementation, you might want to fetch and convert these too
    console.log(`Skipping external URL: ${imageUrl}`)
    return null
  } catch (error) {
    console.error(`Error converting image ${imageUrl}:`, error)
    return null
  }
}

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.png':
      return 'image/png'
    case '.gif':
      return 'image/gif'
    case '.webp':
      return 'image/webp'
    default:
      return 'image/jpeg'
  }
}

function getFileSize(filePath: string): number {
  try {
    const stats = fs.statSync(filePath)
    return stats.size
  } catch {
    return 0
  }
}

async function migrateProductImages() {
  console.log('Starting product image migration...')
  
  try {
    // Get all products with imageUrl
    const products = await prisma.product.findMany({
      where: {
        imageUrl: {
          not: null
        }
      }
    })

    console.log(`Found ${products.length} products with images to migrate`)

    for (const product of products) {
      if (!product.imageUrl) continue

      console.log(`Migrating image for product: ${product.name}`)
      
      const imageData = await convertImageToBase64(product.imageUrl)
      
      if (imageData) {
        // Create ProductImage record
        await prisma.productImage.create({
          data: {
            productId: product.id,
            imageData: imageData,
            fileName: path.basename(product.imageUrl),
            fileSize: product.imageUrl.startsWith('/images/') 
              ? getFileSize(path.join(process.cwd(), 'public', product.imageUrl))
              : 0,
            mimeType: getMimeType(product.imageUrl),
            isPrimary: true,
            altText: `${product.name} main image`
          }
        })
        
        console.log(`✓ Migrated image for ${product.name}`)
      } else {
        // For external URLs or failed conversions, create a placeholder record
        await prisma.productImage.create({
          data: {
            productId: product.id,
            imageData: product.imageUrl, // Store URL as fallback
            fileName: path.basename(product.imageUrl),
            fileSize: 0,
            mimeType: 'image/jpeg',
            isPrimary: true,
            altText: `${product.name} main image`
          }
        })
        
        console.log(`✓ Created placeholder for ${product.name}`)
      }
    }

    console.log('Image migration completed successfully!')
    
  } catch (error) {
    console.error('Error during migration:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the migration
migrateProductImages()

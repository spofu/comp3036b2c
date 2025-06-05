/**
 * Utility functions for generating and handling URL slugs
 */

/**
 * Generate a URL-friendly slug from a string
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace spaces and special characters with hyphens
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate a unique slug by appending a number if needed
 * @param baseSlug - The base slug to make unique
 * @param existingSlugs - Array of existing slugs to check against
 * @returns A unique slug
 */
export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug;
  let counter = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Generate a slug for a product name, ensuring uniqueness
 * @param productName - The product name to generate a slug for
 * @param existingSlugs - Array of existing product slugs
 * @returns A unique product slug
 */
export function generateProductSlug(productName: string, existingSlugs: string[] = []): string {
  const baseSlug = generateSlug(productName);
  return generateUniqueSlug(baseSlug, existingSlugs);
}

/**
 * Checks if a string is a valid slug format
 * @param slug - The string to validate
 * @returns Boolean indicating if the string is a valid slug
 */
export function isValidSlug(slug: string): boolean {
  // Slug should only contain lowercase letters, numbers, and hyphens
  // Should not start or end with hyphens
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugPattern.test(slug);
}

/**
 * Determines if a string is likely a product ID (UUID) or a slug
 * @param identifier - The string to check
 * @returns Object indicating the type and value
 */
export function parseProductIdentifier(identifier: string): {
  type: 'id' | 'slug';
  value: string;
} {
  // Check if it's a UUID format (8-4-4-4-12 hexadecimal characters)
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidPattern.test(identifier)) {
    return {
      type: 'id',
      value: identifier
    };
  }
  
  // Otherwise treat it as a slug
  return {
    type: 'slug',
    value: identifier
  };
}

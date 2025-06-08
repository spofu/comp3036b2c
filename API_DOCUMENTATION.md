# E-Commerce API Documentation

This document provides comprehensive documentation for all API endpoints in the e-commerce application built with Next.js, TypeScript, and Prisma.

## Table of Contents

1. [Authentication APIs](#authentication-apis)
2. [Product APIs](#product-apis)
3. [Categories APIs](#categories-apis)
4. [Cart APIs](#cart-apis)
5. [Checkout APIs](#checkout-apis)
6. [Search APIs](#search-apis)
7. [Admin APIs](#admin-apis)
8. [Error Handling](#error-handling)
9. [Database Schema Overview](#database-schema-overview)
10. [Rate Limiting & Security](#rate-limiting--security)
11. [API Testing](#api-testing)
12. [API Versioning](#api-versioning)
13. [Performance Notes](#performance-notes)
14. [Development Environment](#development-environment)

---

## Authentication APIs

### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 - Success):**
```json
{
  "message": "Account created successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CUSTOMER",
    "createdAt": "2025-06-07T10:00:00.000Z"
  }
}
```

**Validation Rules:**
- `email`: Valid email format required
- `password`: Minimum 6 characters
- `name`: Required, trimmed

**Error Responses:**
- `400`: Missing required fields or invalid format
- `409`: Email already exists
- `500`: Server error

---

### POST /api/auth/login

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 - Success):**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CUSTOMER"
  }
}
```

**Error Responses:**
- `400`: Missing email or password
- `401`: Invalid credentials
- `500`: Server error

---

## Product APIs

### GET /api/products

Fetch all products with optional filtering.

**Query Parameters:**
- `category` (optional): Filter by category name
- `limit` (optional): Limit number of results

**Example Request:**
```
GET /api/products?category=Clothing&limit=10
```

**Response (200 - Success):**
```json
{
  "products": [
    {
      "id": "1",
      "name": "Premium T-Shirt",
      "price": 29.99,
      "image": "/images/products/product-1.jpg",
      "description": "High-quality cotton t-shirt",
      "category": "Clothing",
      "sizes": [
        {
          "size": "S",
          "inStock": true
        },
        {
          "size": "M",
          "inStock": true
        }
      ],
      "colors": [
        {
          "color": "Red",
          "inStock": true
        },
        {
          "color": "Blue",
          "inStock": false
        }
      ]
    }
  ]
}
```

---

### GET /api/products/[id]

Fetch a single product by ID or slug.

**Parameters:**
- `id`: Product ID (number) or slug (string)

**Response (200 - Success):**
```json
{
  "product": {
    "id": 1,
    "name": "Premium T-Shirt",
    "price": 29.99,
    "image": "/images/products/product-1.jpg",
    "description": "High-quality cotton t-shirt",
    "category": "Clothing",
    "stock": 50,
    "sizes": [...],
    "colors": [...],
    "images": [
      "/images/products/product-1.jpg",
      "/images/products/detail-placeholder-2.jpg"
    ],
    "reviews": [
      {
        "id": 1,
        "rating": 5,
        "comment": "Great product!",
        "createdAt": "2025-06-01T10:00:00.000Z",
        "user": {
          "name": "Customer Name",
          "email": "customer@example.com"
        }
      }
    ],
    "averageRating": 4.5,
    "reviewCount": 12,
    "features": [
      "Premium quality fabric",
      "Machine washable",
      "Comfortable fit"
    ],
    "specifications": {
      "material": "100% Cotton",
      "care": "Machine wash cold",
      "origin": "Made in USA",
      "weight": "250g",
      "fit": "Regular fit"
    }
  }
}
```

**Error Responses:**
- `404`: Product not found
- `500`: Server error

---

## Categories APIs

### GET /api/categories

Retrieves all product categories available in the system.

**Example Request:**
```
GET /api/categories
```

**Response (200 - Success):**
```json
{
  "categories": [
    {
      "id": 1,
      "name": "Electronics"
    },
    {
      "id": 2,
      "name": "Clothing"
    },
    {
      "id": 3,
      "name": "Books"
    }
  ]
}
```

**Response Details:**
- Categories are returned in alphabetical order by name
- Each category includes minimal fields (id and name)
- Used primarily for filtering products and navigation

**Status Codes:**
- `200 OK`: Categories retrieved successfully
- `500 Internal Server Error`: Failed to fetch categories

---

## Cart APIs

### GET /api/cart

Fetch cart items for a user.

**Query Parameters:**
- `userId` (required): User ID

**Example Request:**
```
GET /api/cart?userId=user_123
```

**Response (200 - Success):**
```json
{
  "cartItems": [
    {
      "id": "cart_item_1",
      "name": "Premium T-Shirt",
      "price": 29.99,
      "image": "/images/products/product-1.jpg",
      "quantity": 2,
      "color": "Red",
      "size": "M",
      "productId": "1",
      "productVariantId": "variant_1"
    }
  ]
}
```

**Error Responses:**
- `400`: Missing userId
- `500`: Server error

---

### POST /api/cart

Add item to cart.

**Request Body:**
```json
{
  "userId": "user_123",
  "productId": "1",
  "quantity": 2,
  "size": "M",
  "color": "Red",
  "productVariantId": "variant_1"
}
```

**Response (200 - Success):**
```json
{
  "message": "Item added to cart",
  "cartItem": {
    "id": "cart_item_1",
    "name": "Premium T-Shirt",
    "price": 29.99,
    "image": "/images/products/product-1.jpg",
    "quantity": 2,
    "size": "M",
    "color": "Red",
    "productId": "1",
    "productVariantId": "variant_1"
  }
}
```

**Behavior:**
- If item already exists with same variant, quantity is added
- Creates new cart item if variant combination doesn't exist

**Error Responses:**
- `400`: Missing required fields
- `404`: Product not found
- `500`: Server error

---

### PUT /api/cart

Update cart item quantity.

**Request Body:**
```json
{
  "userId": "user_123",
  "itemId": "cart_item_1",
  "quantity": 3
}
```

**Response (200 - Success):**
```json
{
  "message": "Cart item updated",
  "cartItem": {
    "id": "cart_item_1",
    "name": "Premium T-Shirt",
    "price": 29.99,
    "quantity": 3,
    "...": "other fields"
  }
}
```

**Error Responses:**
- `400`: Invalid parameters or quantity < 1
- `404`: Cart item not found
- `500`: Server error

---

### DELETE /api/cart

Remove item from cart.

**Query Parameters:**
- `userId` (required): User ID
- `itemId` (required): Cart item ID

**Example Request:**
```
DELETE /api/cart?userId=user_123&itemId=cart_item_1
```

**Response (200 - Success):**
```json
{
  "message": "Item removed from cart",
  "itemId": "cart_item_1"
}
```

**Error Responses:**
- `400`: Missing required parameters
- `404`: Cart item not found
- `500`: Server error

---

### POST /api/cart/clear

Clear all items from user's cart.

**Request Body:**
```json
{
  "userId": "user_123"
}
```

**Response (200 - Success):**
```json
{
  "message": "Cart cleared successfully"
}
```

---

## Checkout APIs

### POST /api/checkout

Process checkout and create order.

**Request Body:**
```json
{
  "userId": "user_123",
  "items": [
    {
      "productId": "1",
      "productVariantId": "variant_1",
      "quantity": 2,
      "price": 29.99
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "apartment": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "United States"
  },
  "paymentInfo": {
    "method": "card",
    "cardNumber": "****-****-****-1234"
  },
  "total": 65.97
}
```

**Response (200 - Success):**
```json
{
  "success": true,
  "order": {
    "id": "order_123",
    "orderNumber": "ORD-ABC12345",
    "status": "PAID",
    "total": 65.97,
    "createdAt": "2025-06-07T10:00:00.000Z",
    "estimatedDelivery": "2025-06-14T10:00:00.000Z",
    "shippingAddress": {
      "street": "123 Main St",
      "apartment": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "United States"
    }
  },
  "message": "Order created successfully"
}
```

**Process Flow:**
1. Validates required fields
2. Creates shipping address
3. Checks inventory and stock availability
4. Creates order and order items
5. Updates product/variant stock
6. Clears user's cart
7. Marks order as PAID

**Error Responses:**
- `400`: Missing required fields
- `409`: Insufficient stock (with specific error message)
- `500`: Server error

**Stock Error Example:**
```json
{
  "error": "Insufficient stock for product Premium T-Shirt variant. Available: 1, Requested: 2",
  "type": "STOCK_ERROR"
}
```

---

### GET /api/checkout

Get order details by order ID.

**Query Parameters:**
- `orderId` (required): Order ID
- `userId` (required): User ID

**Example Request:**
```
GET /api/checkout?orderId=order_123&userId=user_123
```

**Response (200 - Success):**
```json
{
  "order": {
    "id": "order_123",
    "orderNumber": "ORD-ABC12345",
    "status": "PAID",
    "total": 65.97,
    "createdAt": "2025-06-07T10:00:00.000Z",
    "estimatedDelivery": "2025-06-14T10:00:00.000Z",
    "items": [
      {
        "id": "order_item_1",
        "name": "Premium T-Shirt",
        "price": 29.99,
        "quantity": 2,
        "total": 59.98,
        "image": "/images/products/product-1.jpg"
      }
    ],
    "shippingAddress": {
      "name": "John Doe",
      "street": "123 Main St",
      "apartment": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "United States"
    },
    "customer": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

**Error Responses:**
- `400`: Missing required parameters
- `404`: Order not found
- `500`: Server error

---

### POST /api/checkout/inventory

Check inventory availability for cart items.

**Request Body:**
```json
{
  "items": [
    {
      "productId": "1",
      "productVariantId": "variant_1",
      "quantity": 2
    }
  ]
}
```

**Response (200 - Success):**
```json
{
  "available": true,
  "items": [
    {
      "productId": "1",
      "productVariantId": "variant_1",
      "available": true,
      "requestedQuantity": 2,
      "availableStock": 10
    }
  ]
}
```

**Response (409 - Stock Issues):**
```json
{
  "available": false,
  "items": [
    {
      "productId": "1",
      "productVariantId": "variant_1",
      "available": false,
      "requestedQuantity": 5,
      "availableStock": 2,
      "message": "Only 2 items available"
    }
  ]
}
```

---

### GET /api/checkout/orders

Get user's order history.

**Query Parameters:**
- `userId` (required): User ID

**Response (200 - Success):**
```json
{
  "orders": [
    {
      "id": "order_123",
      "orderNumber": "ORD-ABC12345",
      "status": "PAID",
      "total": 65.97,
      "createdAt": "2025-06-07T10:00:00.000Z",
      "itemCount": 2
    }
  ]
}
```

---

### PATCH /api/checkout/orders

Update order status (for admin or customer use).

**Request Body:**
```json
{
  "orderId": "order_123",
  "status": "SHIPPED",
  "userId": "user_123"
}
```

**Valid Status Values:**
- `PENDING`: Order created but not yet processed
- `PAID`: Payment confirmed
- `SHIPPED`: Order dispatched
- `DELIVERED`: Order delivered to customer
- `CANCELLED`: Order cancelled

**Response (200 - Success):**
```json
{
  "success": true,
  "order": {
    "id": "order_123",
    "status": "SHIPPED",
    "updatedAt": "2025-06-08T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Invalid status or missing required fields
- `404`: Order not found
- `500`: Server error

---

## Search APIs

### GET /api/search

Search products by name, description, or category.

**Query Parameters:**
- `q` (required): Search query (minimum 2 characters)
- `limit` (optional): Maximum results (default: 5)

**Example Request:**
```
GET /api/search?q=shirt&limit=10
```

**Response (200 - Success):**
```json
{
  "products": [
    {
      "id": "1",
      "name": "Premium T-Shirt",
      "category": "Clothing",
      "price": 29.99,
      "imageUrl": "/images/products/product-1.jpg",
      "description": "High-quality cotton t-shirt",
      "stock": 15,
      "sizes": [
        {
          "size": "S",
          "inStock": true
        }
      ],
      "colors": [
        {
          "color": "Red",
          "inStock": true
        }
      ]
    }
  ],
  "total": 1
}
```

**Search Criteria:**
- Product name (case-insensitive)
- Product description (case-insensitive)
- Category name (case-insensitive)

**Error Responses:**
- Query less than 2 characters returns empty results
- `500`: Server error

---

## Admin APIs

### GET /api/admin/dashboard

Get dashboard statistics for admin panel.

**Response (200 - Success):**
```json
{
  "totalProducts": 50,
  "totalOrders": 125,
  "totalRevenue": 12500.75,
  "recentOrders": [
    {
      "id": "order_123",
      "total": 65.97,
      "status": "PAID",
      "createdAt": "2025-06-07T10:00:00.000Z",
      "user": {
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

---

### GET /api/admin/products

Get all products for admin management with additional fields.

**Query Parameters:**
- `limit` (optional): Limit number of results
- `category` (optional): Filter by category

**Response (200 - Success):**
```json
{
  "products": [
    {
      "id": "1",
      "name": "Premium T-Shirt",
      "price": 29.99,
      "stock": 15,
      "imageUrl": "/images/products/product-1.jpg",
      "description": "High-quality cotton t-shirt",
      "category": {
        "id": "cat_1",
        "name": "Clothing"
      },
      "slug": "premium-t-shirt",
      "variants": [
        {
          "id": "var_1",
          "size": "M",
          "color": "Red",
          "stock": 5,
          "price": 29.99
        }
      ],
      "images": [
        {
          "id": "img_1",
          "imageData": "base64_encoded_image",
          "fileName": "product-1.jpg",
          "isPrimary": true,
          "altText": "Premium T-Shirt Front View"
        }
      ],
      "createdAt": "2025-06-01T10:00:00.000Z",
      "updatedAt": "2025-06-08T10:00:00.000Z"
    }
  ]
}
```

---

### POST /api/admin/products

Create a new product (Admin only).

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 49.99,
  "stock": 25,
  "categoryId": "cat_1",
  "slug": "new-product"
}
```

**Response (201 - Success):**
```json
{
  "message": "Product created successfully",
  "product": {
    "id": "new_product_id",
    "name": "New Product",
    "price": 49.99,
    "stock": 25,
    "categoryId": "cat_1",
    "slug": "new-product",
    "createdAt": "2025-06-08T10:00:00.000Z"
  }
}
```

---

### GET /api/admin/products/[id]

Get a specific product with variants and images for admin management.

**Parameters:**
- `id`: Product ID

**Response (200 - Success):**
```json
{
  "id": "1",
  "name": "Premium T-Shirt",
  "description": "High-quality cotton t-shirt",
  "price": 29.99,
  "stock": 15,
  "imageUrl": "/images/products/product-1.jpg",
  "categoryId": "cat_1",
  "slug": "premium-t-shirt",
  "category": {
    "id": "cat_1",
    "name": "Clothing"
  },
  "variants": [
    {
      "id": "var_1",
      "size": "M",
      "color": "Red",
      "material": "Cotton",
      "stock": 5,
      "price": 29.99,
      "sku": "TSHIRT-M-RED"
    }
  ],
  "images": [
    {
      "id": "img_1",
      "imageData": "base64_encoded_image",
      "fileName": "product-1.jpg",
      "fileSize": 102400,
      "mimeType": "image/jpeg",
      "isPrimary": true,
      "altText": "Premium T-Shirt Front View"
    }
  ]
}
```

---

### PATCH /api/admin/products/[id]

Update product details (Admin only).

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "description": "Updated description",
  "price": 35.99,
  "stock": 20,
  "categoryId": "cat_1"
}
```

**Response (200 - Success):**
```json
{
  "message": "Product updated successfully",
  "product": {
    "id": "1",
    "name": "Updated Product Name",
    "price": 35.99,
    "stock": 20,
    "updatedAt": "2025-06-08T10:00:00.000Z"
  }
}
```

---

### POST /api/admin/products/[id]/variants

Create a new product variant (Admin only).

**Request Body:**
```json
{
  "size": "L",
  "color": "Blue",
  "material": "Cotton",
  "price": 31.99,
  "stock": 10,
  "sku": "TSHIRT-L-BLUE"
}
```

**Response (201 - Success):**
```json
{
  "message": "Variant created successfully",
  "variant": {
    "id": "new_variant_id",
    "productId": "1",
    "size": "L",
    "color": "Blue",
    "material": "Cotton",
    "price": 31.99,
    "stock": 10,
    "sku": "TSHIRT-L-BLUE"
  }
}
```

---

### PUT /api/admin/products/[id]/variants/[variantId]

Update a product variant (Admin only).

**Request Body:**
```json
{
  "size": "L",
  "color": "Navy Blue",
  "price": 32.99,
  "stock": 15
}
```

**Response (200 - Success):**
```json
{
  "message": "Variant updated successfully",
  "variant": {
    "id": "variant_id",
    "size": "L",
    "color": "Navy Blue",
    "price": 32.99,
    "stock": 15,
    "updatedAt": "2025-06-08T10:00:00.000Z"
  }
}
```

---

### DELETE /api/admin/products/[id]/variants/[variantId]

Delete a product variant (Admin only).

**Response (200 - Success):**
```json
{
  "message": "Variant deleted successfully",
  "variantId": "variant_id"
}
```

---

### PATCH /api/admin/products

Update product stock (Admin only).

**Request Body:**
```json
{
  "id": "product_id",
  "stock": 50
}
```

**Response (200 - Success):**
```json
{
  "success": true,
  "product": {
    "id": "product_id",
    "stock": 50
  }
}
```

---

### GET /api/admin/orders

Get all orders for admin management.

**Response (200 - Success):**
```json
{
  "orders": [
    {
      "id": "order_123",
      "orderNumber": "ORD-ABC12345",
      "status": "PAID",
      "total": 65.97,
      "createdAt": "2025-06-07T10:00:00.000Z",
      "user": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "items": [
        {
          "name": "Premium T-Shirt",
          "quantity": 2,
          "price": 29.99
        }
      ]
    }
  ]
}
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "error": "Error message description",
  "details": "Additional error details (optional)",
  "type": "ERROR_TYPE (optional)"
}
```

### Common HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors, missing fields)
- `401`: Unauthorized (invalid credentials)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (stock issues, duplicate email)
- `500`: Internal Server Error

### Specific Error Types

1. **Validation Errors (400)**
   - Missing required fields
   - Invalid email format
   - Invalid data types

2. **Authentication Errors (401)**
   - Invalid credentials
   - Expired tokens

3. **Stock Errors (409)**
   - Insufficient inventory
   - Product unavailable

4. **Database Errors (500)**
   - Connection issues
   - Constraint violations

---

## Database Schema Overview

### Core Tables

1. **User**
   - `id`: Primary key
   - `email`: Unique identifier
   - `hashedPassword`: Encrypted password
   - `name`: User display name
   - `role`: CUSTOMER | ADMIN

2. **Product**
   - `id`: Primary key
   - `name`: Product name
   - `description`: Product description
   - `price`: Product price (Decimal)
   - `stock`: Available stock
   - `imageUrl`: Product image URL
   - `categoryId`: Foreign key to Category
   - `slug`: URL-friendly identifier

3. **ProductVariant**
   - `id`: Primary key
   - `productId`: Foreign key to Product
   - `size`: Size option
   - `color`: Color option
   - `stock`: Variant-specific stock

4. **CartItem**
   - `id`: Primary key
   - `userId`: Foreign key to User
   - `productId`: Foreign key to Product
   - `productVariantId`: Foreign key to ProductVariant
   - `quantity`: Item quantity

5. **Order**
   - `id`: Primary key
   - `userId`: Foreign key to User
   - `total`: Order total (Decimal)
   - `status`: PENDING | PAID | SHIPPED | DELIVERED
   - `addressId`: Foreign key to Address

6. **OrderItem**
   - `id`: Primary key
   - `orderId`: Foreign key to Order
   - `productId`: Foreign key to Product
   - `productVariantId`: Foreign key to ProductVariant
   - `quantity`: Item quantity
   - `price`: Price at time of order

7. **ProductImage**
   - `id`: Primary key
   - `productId`: Foreign key to Product
   - `imageData`: Base64 encoded image data
   - `fileName`: Original file name
   - `fileSize`: File size in bytes
   - `mimeType`: Image MIME type (e.g., 'image/jpeg')
   - `isPrimary`: Boolean indicating primary product image
   - `altText`: Alternative text for accessibility
   - `createdAt`: Image upload timestamp
   - `updatedAt`: Last modification timestamp

8. **Address**
   - `id`: Primary key
   - `userId`: Foreign key to User
   - `street`: Street address
   - `apartment`: Apartment/unit number
   - `city`: City name
   - `state`: State/province
   - `zipCode`: Postal code
   - `country`: Country name

---

## Rate Limiting & Security

### Authentication
- JWT tokens for session management
- bcrypt for password hashing
- Input validation and sanitization

### Security Measures
- SQL injection prevention (Prisma ORM)
- XSS protection
- CORS configuration
- Environment variable protection

### Best Practices
- Use HTTPS in production
- Implement rate limiting
- Log security events
- Regular security audits

---

## API Testing

### Tools Recommended
- **Postman**: API testing and documentation
- **Jest**: Unit testing for API routes
- **Playwright**: End-to-end testing

### Sample Test Cases

1. **Authentication Flow**
   - Register new user
   - Login with valid credentials
   - Login with invalid credentials

2. **Product Operations**
   - Fetch all products
   - Fetch single product
   - Search products

3. **Cart Management**
   - Add items to cart
   - Update item quantities
   - Remove items from cart
   - Clear entire cart

4. **Checkout Process**
   - Check inventory availability
   - Process successful checkout
   - Handle insufficient stock
   - Retrieve order details

---

This documentation covers all the primary API endpoints in the e-commerce application. Each endpoint includes request/response examples, error handling, and important behavioral notes.

For development and testing, ensure your local environment has:
- PostgreSQL database running
- Environment variables configured
- Prisma migrations applied
- Seed data loaded

## API Versioning

This API follows semantic versioning principles. Current version: v1.0

### Version History
- **v1.0** (June 2025): Initial release with full e-commerce functionality
- **v1.1** (June 2025): Added product image management and variant support

## Performance Notes

### Caching Strategy
- Product data is cached for improved performance
- Cart operations are optimized for real-time updates
- Image loading is optimized with Next.js Image component

### Pagination
For endpoints returning large datasets, pagination is implemented:
- Default page size: 20 items
- Maximum page size: 100 items
- Use `page` and `limit` query parameters

### Rate Limiting
- Authentication endpoints: 5 requests per minute per IP
- General API endpoints: 100 requests per minute per user
- Admin endpoints: 200 requests per minute per admin user

## Development Environment

### Required Environment Variables
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/comp3036b2c"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Optional
NODE_ENV="development"
NEXTAUTH_URL="http://localhost:3000"
```

### Database Migrations
The application includes the following migrations:
- `20250526091037_init`: Initial database schema
- `20250526122450_edit_product`: Product table modifications
- `20250527055825_add_cart_table`: Shopping cart functionality
- `20250605061954_add_product_slug`: SEO-friendly URLs
- `20250607131755_add_unique_constraints`: Data integrity
- `20250608123038_add_product_images_table`: Image management
- `20250608123412_add_product_images_make_imageurl_optional`: Image flexibility

Last updated: June 8, 2025

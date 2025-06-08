# E-Commerce Platform - COMP3036 B2C

A full-stack e-commerce application built with Next.js, TypeScript, and Prisma, featuring a modern user interface, comprehensive product management, secure authentication, and a complete shopping experience.

## 🚀 Features

### 🛍️ Customer Experience
- **Product Browsing**: Browse products by category with filtering and search
- **Product Details**: Detailed product pages with image galleries and variants
- **Shopping Cart**: Add/remove items, update quantities, persistent cart state
- **User Authentication**: Secure login/registration with JWT tokens
- **Checkout Process**: Complete order flow with address management
- **Order History**: View past orders and order status tracking
- **Responsive Design**: Mobile-first design that works on all devices

### 🔐 Authentication & Security
- **JWT-based Authentication**: Secure token-based user sessions
- **Role-based Access Control**: Customer and Admin role separation
- **Protected Routes**: Automatic redirection for unauthorized access
- **Password Hashing**: bcrypt for secure password storage
- **Session Persistence**: Maintain login state across browser sessions

### 👨‍💼 Admin Features
- **Admin Dashboard**: Sales statistics, order overview, and metrics
- **Product Management**: Create, edit, and delete products
- **Inventory Control**: Stock management and tracking
- **Order Management**: View and update order statuses
- **Product Variants**: Manage size, color, and material variants
- **Image Management**: Upload and manage product images

### 🛠️ Technical Features
- **Database Integration**: PostgreSQL with Prisma ORM
- **API Documentation**: Comprehensive REST API documentation
- **Type Safety**: Full TypeScript implementation
- **Testing**: End-to-end testing with Playwright
- **Modern UI**: Tailwind CSS for styling
- **Performance**: Optimized images and fonts

## 🏗️ Tech Stack

- **Frontend**: Next.js 15.3.2, React 19, TypeScript
- **Styling**: Tailwind CSS 4.0
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt for password hashing
- **Testing**: Playwright for E2E testing
- **Package Manager**: PNPM

## 📦 Project Structure

```
comp3036b2c/
├── src/
│   ├── app/
│   │   ├── admin/                 # Admin dashboard and management
│   │   ├── api/                   # REST API routes
│   │   │   ├── auth/              # Authentication endpoints
│   │   │   ├── products/          # Product management
│   │   │   ├── cart/              # Shopping cart operations
│   │   │   ├── checkout/          # Order processing
│   │   │   └── admin/             # Admin-only endpoints
│   │   ├── components/            # Reusable UI components
│   │   ├── context/               # React Context providers
│   │   ├── login/                 # Authentication pages
│   │   ├── cart/                  # Shopping cart page
│   │   ├── checkout/              # Checkout process
│   │   └── product/[id]/          # Dynamic product pages
│   └── lib/                       # Utility functions
├── prisma/
│   ├── schema.prisma              # Database schema
│   ├── migrations/                # Database migrations
│   └── seed.ts                    # Database seeding
├── tests/e2e/                     # End-to-end tests
├── public/images/products/        # Product image assets
└── API_DOCUMENTATION.md           # Complete API documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- PNPM (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd comp3036b2c
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/comp3036b2c"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   ```

4. **Set up the database**
   ```bash
   # Run database migrations
   npx prisma migrate dev
   
   # Seed the database with sample data
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Demo Credentials

### Customer Account
- **Email**: `customer@example.com`
- **Password**: `password123`

### Admin Account  
- **Email**: `admin@example.com`
- **Password**: `admin123`

## 📚 API Documentation

The application includes comprehensive API documentation. See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed information about all available endpoints, request/response formats, and authentication requirements.

### Key API Endpoints

- **Authentication**: `/api/auth/login`, `/api/auth/register`
- **Products**: `/api/products`, `/api/products/[id]`
- **Cart**: `/api/cart` (GET, POST, PUT, DELETE)
- **Checkout**: `/api/checkout`, `/api/checkout/orders`
- **Admin**: `/api/admin/dashboard`, `/api/admin/products`

## 🧪 Testing

Run the end-to-end test suite:

```bash
# Run all tests
npx playwright test

# Run tests in UI mode
npx playwright test --ui

# Run specific test file
npx playwright test tests/e2e/basic.spec.ts
```

## 📊 Database Schema

The application uses a comprehensive database schema with the following main entities:

- **Users**: Customer and admin accounts with role-based access
- **Products**: Product catalog with categories and variants
- **Categories**: Product organization and filtering
- **Cart**: Persistent shopping cart functionality
- **Orders**: Complete order management with order items
- **Addresses**: Customer shipping addresses
- **Reviews**: Product rating and review system

See `prisma/schema.prisma` for the complete database schema.

## 🛠️ Development Scripts

```bash
# Development
pnpm dev                    # Start development server
pnpm build                  # Build for production
pnpm start                  # Start production server
pnpm lint                   # Run ESLint

# Database
npx prisma generate         # Generate Prisma client
npx prisma migrate dev      # Run migrations
npx prisma db seed          # Seed database
npx prisma studio           # Open Prisma Studio

# Testing
npx playwright test         # Run E2E tests
npx playwright test --ui    # Run tests with UI
```

## 🏥 Health Checks

The application includes several health check endpoints and monitoring features:

- Database connectivity validation
- API endpoint health checks  
- Authentication system status
- Cart and checkout functionality verification

## 🔒 Security Features

- **Input Validation**: All API endpoints include comprehensive input validation
- **SQL Injection Prevention**: Prisma ORM provides built-in protection
- **XSS Protection**: Input sanitization and output encoding
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **JWT Security**: Secure token generation and validation
- **Password Security**: bcrypt hashing with salt rounds

## 🚀 Deployment

### Environment Setup

For production deployment, ensure the following environment variables are configured:

```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
NEXTAUTH_URL="your-production-domain"
```

### Build Process

```bash
# Install production dependencies
pnpm install --prod

# Generate Prisma client and build
pnpm build

# Start production server
pnpm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is part of the COMP3036 coursework and is for educational purposes.

## 📞 Support

For questions or support regarding this project, please refer to the course materials or contact the development team.

---

**Built with ❤️ for COMP3036 - E-Commerce Systems Development**


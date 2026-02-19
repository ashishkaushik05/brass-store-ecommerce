# Kuber Brass Store Storefront - Complete Project Overview

**Project Name**: Kuber Brass Store E-commerce Platform  
**Purpose**: Online brass artifacts store with custom backend  
**Tech Stack**: React + TypeScript + Express + MongoDB + Clerk  
**Date Created**: February 2026  
**Status**: Backend in development, Frontend complete with mock data

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Current Status](#current-status)
3. [Technology Stack](#technology-stack)
4. [Backend API Endpoints](#backend-api-endpoints)
5. [Implementation Roadmap](#implementation-roadmap)
6. [Getting Started](#getting-started)
7. [Environment Variables](#environment-variables)
8. [Key Documents](#key-documents)

---

## Project Structure

```
kuber-brass-storefront/
├── backend/                          # Express API Server
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts          # MongoDB connection
│   │   │   └── env.ts               # Environment validation
│   │   ├── models/
│   │   │   ├── Product.model.ts     # ✅ Implemented
│   │   │   ├── Cart.model.ts        # ✅ Implemented
│   │   │   ├── Order.model.ts       # ✅ Implemented
│   │   │   ├── Collection.model.ts  # 🔨 To implement (Phase 1)
│   │   │   ├── Review.model.ts      # 🔨 To implement (Phase 3)
│   │   │   ├── Article.model.ts     # 🔨 To implement (Phase 4)
│   │   │   ├── Contact.model.ts     # 🔨 To implement (Phase 5)
│   │   │   └── Newsletter.model.ts  # 🔨 To implement (Phase 5)
│   │   ├── controllers/
│   │   │   ├── product.controller.ts    # ✅ Basic CRUD
│   │   │   ├── cart.controller.ts       # ✅ Full CRUD
│   │   │   ├── order.controller.ts      # ✅ Create & List
│   │   │   ├── collection.controller.ts # 🔨 To implement
│   │   │   ├── review.controller.ts     # 🔨 To implement
│   │   │   ├── article.controller.ts    # 🔨 To implement
│   │   │   └── contact.controller.ts    # 🔨 To implement
│   │   ├── routes/
│   │   │   ├── product.routes.ts    # ✅ Implemented
│   │   │   ├── cart.routes.ts       # ✅ Implemented
│   │   │   ├── order.routes.ts      # ✅ Implemented
│   │   │   └── [more routes...]     # 🔨 To implement
│   │   ├── middleware/
│   │   │   ├── auth.ts              # ✅ Clerk JWT (simplified)
│   │   │   └── errorHandler.ts      # ✅ Global error handler
│   │   ├── utils/
│   │   │   ├── logger.ts            # ✅ Pino logger
│   │   │   ├── ApiError.ts          # ✅ Error class
│   │   │   └── ApiResponse.ts       # ✅ Response wrapper
│   │   ├── scripts/
│   │   │   └── seed.ts              # ✅ Seed 8 products
│   │   ├── app.ts                   # ✅ Express config
│   │   └── server.ts                # ✅ Server entry point
│   ├── docs/
│   │   └── IMPLEMENTATION_PHASES.md # 📋 Detailed phase guide
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env
│   ├── README.md                    # ✅ Basic API docs
│   ├── API_ENDPOINTS.md             # 📋 Complete endpoint list
│   └── SETUP_COMPLETE.md            # ✅ Setup summary
│
├── frontend/                         # React SPA
│   ├── components/
│   │   ├── Header.tsx               # Navigation with cart badge
│   │   ├── Footer.tsx               # Site footer
│   │   ├── ProductCard.tsx          # Product display card
│   │   ├── CollectionCard.tsx       # Collection display card
│   │   ├── Section.tsx              # Layout wrapper
│   │   ├── Icon.tsx                 # Material icons
│   │   └── ReviewSection.tsx        # Product reviews UI
│   ├── pages/
│   │   ├── HomePage.tsx             # Landing page
│   │   ├── ShopPage.tsx             # Product catalog with filters
│   │   ├── CollectionPage.tsx       # Collection products view
│   │   ├── ProductPage.tsx          # Single product details
│   │   ├── StoryPage.tsx            # Brand story (static)
│   │   ├── CraftPage.tsx            # Craftsmanship (static)
│   │   ├── JournalPage.tsx          # Blog listing
│   │   ├── ArticlePage.tsx          # Single article view
│   │   ├── ContactPage.tsx          # Contact form
│   │   └── PoliciesPage.tsx         # Policies (static)
│   ├── data/
│   │   └── mockData.ts              # ❌ Hardcoded data (to replace)
│   ├── App.tsx                      # Router setup
│   ├── index.tsx                    # Entry point
│   ├── types.ts                     # TypeScript interfaces
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
│
├── FRONTEND_API_REQUIREMENTS.md     # 📋 Frontend data needs analysis
├── INTEGRATION_ROADMAP.md           # 📋 Integration strategy
├── TECHNICAL_AUDIT.md               # 📋 Initial project audit
├── backend-report.md                # 📋 Backend requirements
└── PROJECT_OVERVIEW.md              # 📋 This file

```

---

## Current Status

### ✅ Backend - Implemented

**Server**: Running on `http://localhost:3001`  
**Database**: MongoDB at `mongodb://localhost:27017/kuber-brass-store-store`  
**Seeded Data**: 8 brass products

**Working Endpoints** (12 total):
1. `GET /health` - Health check
2. `GET /api/products` - List products (basic pagination, search, category filter)
3. `GET /api/products/:slug` - Get single product
4. `GET /api/cart` - Get user cart (auth)
5. `POST /api/cart/add` - Add to cart (auth)
6. `POST /api/cart/update` - Update quantity (auth)
7. `POST /api/cart/remove` - Remove item (auth)
8. `DELETE /api/cart/clear` - Clear cart (auth)
9. `POST /api/orders/create` - Create order (auth)
10. `GET /api/orders/my` - Get user orders (auth)
11. `GET /api/orders/:orderId` - Get order details (auth)
12. **Background Process**: Dev server running (PID tracked)

**Technologies**:
- Express 4.18+
- TypeScript 5.0+
- MongoDB (Mongoose 8.0+)
- Clerk Express (@clerk/express)
- Pino (logging)
- Helmet (security)
- CORS
- Morgan (HTTP logging)

### 🔨 Backend - To Implement

**Missing Endpoints** (15+ endpoints across 5 phases):

**Phase 1: Collections** (3 endpoints)
- `GET /api/collections`
- `GET /api/collections/:handle`
- `GET /api/collections/:handle/products`

**Phase 2: Product Enhancements** (2 endpoints + improvements)
- Enhanced filters on existing `GET /api/products`
- `GET /api/products/:slug/related`

**Phase 3: Reviews** (5 endpoints)
- `GET /api/products/:slug/reviews`
- `POST /api/products/:slug/reviews`
- `GET /api/reviews/my`
- `PUT /api/reviews/:reviewId`
- `DELETE /api/reviews/:reviewId`

**Phase 4: Articles** (3 endpoints)
- `GET /api/articles`
- `GET /api/articles/:slug`
- `GET /api/articles/:slug/related`

**Phase 5: Contact & Newsletter** (3 endpoints)
- `POST /api/contact/submit`
- `POST /api/newsletter/subscribe`
- `POST /api/newsletter/unsubscribe`

### ✅ Frontend - Complete (UI Only)

**Status**: Pixel-perfect UI with mock data, zero API integration

**Features**:
- 10 pages fully designed
- 7 reusable components
- HashRouter navigation
- Tailwind CSS (CDN)
- TypeScript types defined
- Responsive design

**Mock Data**:
- 10 products
- 6 collections
- 3 articles
- 4 reviews

**Missing**:
- ❌ Clerk authentication integration
- ❌ React Query for API state
- ❌ API client layer
- ❌ Cart state management
- ❌ Real data fetching

---

## Technology Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime |
| TypeScript | 5.8.2 | Type safety |
| Express | 4.18+ | Web framework |
| MongoDB | 6.0+ | Database |
| Mongoose | 8.0+ | ODM |
| @clerk/express | Latest | Authentication |
| Pino | Latest | Logging |
| Helmet | Latest | Security headers |
| CORS | Latest | Cross-origin requests |
| Morgan | Latest | HTTP logging |
| ts-node | Latest | TypeScript execution |
| nodemon | Latest | Dev server |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.4 | UI library |
| TypeScript | 5.8.2 | Type safety |
| Vite | 6.2.0 | Build tool |
| React Router | 7.13.0 | Routing (HashRouter) |
| Tailwind CSS | CDN | Styling |

### To Add (Frontend Integration)

| Technology | Version | Purpose |
|------------|---------|---------|
| @clerk/clerk-react | Latest | Authentication |
| @tanstack/react-query | Latest | Server state |
| axios | Latest | HTTP client |

---

## Backend API Endpoints

### Authentication

All endpoints use Clerk JWT tokens via `Authorization: Bearer <token>` header.

**Public Endpoints**: Products, Collections, Articles, Reviews (read-only)  
**Protected Endpoints**: Cart, Orders, Review submission

### Complete Endpoint List

#### Health & Status
```
GET /health - Server health check
```

#### Products (Public)
```
GET    /api/products
       Query: page, limit, search, category, minPrice, maxPrice, 
              usage, finish, tag, sort, collection
       
GET    /api/products/:slug
       Returns: Single product with full details

GET    /api/products/:slug/related [TO IMPLEMENT]
       Query: limit (default: 4)
       Returns: Related products by category/tags
```

#### Collections [TO IMPLEMENT - Phase 1]
```
GET    /api/collections
       Query: featured, limit
       Returns: All or filtered collections

GET    /api/collections/:handle
       Returns: Collection metadata with product count

GET    /api/collections/:handle/products
       Query: page, limit, sort
       Returns: Products in collection
```

#### Cart (Protected)
```
GET    /api/cart
       Returns: User's cart with items and totals

POST   /api/cart/add
       Body: { productId, quantity }
       
POST   /api/cart/update
       Body: { productId, quantity }
       
POST   /api/cart/remove
       Body: { productId }
       
DELETE /api/cart/clear
```

#### Orders (Protected)
```
POST   /api/orders/create
       Body: { shippingAddress, paymentMethod }
       Creates order from current cart

GET    /api/orders/my
       Query: page, limit
       Returns: User's order history

GET    /api/orders/:orderId
       Returns: Single order details
```

#### Reviews [TO IMPLEMENT - Phase 3]
```
GET    /api/products/:slug/reviews
       Query: page, limit, sort
       Returns: Reviews with summary stats

POST   /api/products/:slug/reviews (Protected)
       Body: { rating, title, content, images }
       
GET    /api/reviews/my (Protected)
       Returns: User's reviews

PUT    /api/reviews/:reviewId (Protected)
       Body: { rating, title, content }
       
DELETE /api/reviews/:reviewId (Protected)
```

#### Articles [TO IMPLEMENT - Phase 4]
```
GET    /api/articles
       Query: page, limit, category, sort
       Returns: Published articles

GET    /api/articles/:slug
       Returns: Full article content

GET    /api/articles/:slug/related
       Query: limit (default: 3)
       Returns: Related articles
```

#### Contact & Newsletter [TO IMPLEMENT - Phase 5]
```
POST   /api/contact/submit
       Body: { name, email, message }
       Rate Limited: 3 per hour per IP

POST   /api/newsletter/subscribe
       Body: { email }
       
POST   /api/newsletter/unsubscribe
       Body: { email }
```

---

## Implementation Roadmap

### Timeline: 4-5 Weeks

#### Week 1: Collections + Product Enhancements
- **Days 1-4**: Phase 1 - Collections API
  - Create Collection model
  - Implement 3 endpoints
  - Seed 6 collections
  - Update Product model with collection field
  - Test thoroughly

- **Days 5-7**: Phase 2 Start - Product Enhancements
  - Add advanced filters (price, usage, finish)
  - Implement sorting (price, name, date)
  - Add related products logic

#### Week 2: Product Enhancements + Reviews
- **Days 8-9**: Phase 2 Complete
  - Test all filter combinations
  - Performance optimization
  - Update seed data

- **Days 10-15**: Phase 3 - Reviews API
  - Create Review model with aggregations
  - Implement 5 endpoints
  - Add review validation
  - Seed 15+ reviews
  - Test review submission flow

#### Week 3: Articles + Contact/Newsletter Start
- **Days 16-19**: Phase 4 - Articles API
  - Create Article model
  - Implement 3 endpoints
  - Add SEO fields
  - Seed 5-10 articles
  - Test blog functionality

- **Days 20-21**: Phase 5 Start
  - Set up nodemailer
  - Create Contact model

#### Week 4: Contact/Newsletter + Testing
- **Days 22-24**: Phase 5 Complete
  - Create Newsletter model
  - Implement email notifications
  - Add rate limiting
  - Test email delivery

- **Days 25-28**: Testing & Refinement
  - Integration testing all endpoints
  - Performance benchmarking
  - Security review
  - Documentation updates
  - Bug fixes

### Priority Levels

🔴 **HIGH PRIORITY** (Blocking frontend):
1. Collections API (needed by HomePage, CollectionPage)
2. Product Enhancements (needed by ShopPage filters)
3. Reviews API (needed by ProductPage social proof)

🟡 **MEDIUM PRIORITY** (Nice to have):
4. Articles API (content marketing)
5. Contact & Newsletter (support features)

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB 6.0+
- npm or yarn
- Clerk account (for authentication)

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Start MongoDB (if local)
sudo systemctl start mongodb
# or
mongod

# Run database seed
npm run seed

# Start development server
npm run dev
# Server runs on http://localhost:3001
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# App runs on http://localhost:5173
```

### Testing Backend

```bash
# Health check
curl http://localhost:3001/health

# Get products
curl http://localhost:3001/api/products

# Get single product
curl http://localhost:3001/api/products/vintage-brass-diya
```

---

## Environment Variables

### Backend `.env`

```env
# Server Configuration
NODE_ENV=development
PORT=3001

# Database
MONGODB_URI=mongodb://localhost:27017/kuber-brass-store-store

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Email (Phase 5)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@kuber-brass-store.com

# Optional
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend `.env` (To be created)

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Feature Flags
VITE_ENABLE_REVIEWS=true
VITE_ENABLE_WISHLIST=false
```

---

## Key Documents

### Backend Documentation

1. **`backend/README.md`** - Basic API documentation with setup instructions
2. **`backend/API_ENDPOINTS.md`** - Complete endpoint specifications with examples
3. **`backend/docs/IMPLEMENTATION_PHASES.md`** - Detailed implementation guide with code examples
4. **`backend/SETUP_COMPLETE.md`** - Backend setup summary

### Frontend Documentation

5. **`FRONTEND_API_REQUIREMENTS.md`** - Complete frontend data requirements analysis
   - Page-by-page breakdown
   - Component API needs
   - Data model comparisons
   - Integration checklist

### Project Documentation

6. **`INTEGRATION_ROADMAP.md`** - Original integration strategy (84KB)
7. **`TECHNICAL_AUDIT.md`** - Initial project audit (70KB)
8. **`backend-report.md`** - Backend requirements specification
9. **`PROJECT_OVERVIEW.md`** - This document

---

## Data Models

### Implemented Models

#### Product
```typescript
{
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  stock: number;
  sku?: string;
  metadata: {
    finish?: string;
    usage?: string;
    dimensions?: string;
    weight?: string;
    material?: string;
  };
  collection?: string; // To add in Phase 1
}
```

#### Cart
```typescript
{
  userId?: string;      // For authenticated users
  sessionId?: string;   // For guest users
  items: [{
    productId: ObjectId;
    quantity: number;
    price: number;
  }];
  // Virtuals: subtotal, itemCount
}
```

#### Order
```typescript
{
  orderId: string;
  userId: string;
  items: [{
    productId: ObjectId;
    name: string;
    quantity: number;
    price: number;
  }];
  shipping: {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  };
  payment: {
    method: string;
    status: string;
    transactionId?: string;
  };
  tracking: {
    status: string;
    carrier?: string;
    trackingNumber?: string;
  };
  totalAmount: number;
  createdAt: Date;
}
```

### To Implement Models

#### Collection (Phase 1)
```typescript
{
  handle: string;
  name: string;
  description: string;
  imageUrl: string;
  featured: boolean;
  displayOrder: number;
  // Virtual: productCount
}
```

#### Review (Phase 3)
```typescript
{
  productId: ObjectId;
  userId: string;
  author: string;
  rating: number; // 1-5
  title: string;
  content: string;
  verified: boolean;
  helpful: number;
  images?: string[];
  status: 'pending' | 'approved' | 'rejected';
}
```

#### Article (Phase 4)
```typescript
{
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  readTime: number;
  published: boolean;
  publishedAt: Date;
  viewCount: number;
  tags: string[];
  metaDescription: string;
}
```

#### Contact (Phase 5)
```typescript
{
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  ipAddress: string;
}
```

#### Newsletter (Phase 5)
```typescript
{
  email: string;
  status: 'active' | 'unsubscribed';
  subscribedAt: Date;
  unsubscribedAt?: Date;
}
```

---

## Development Workflow

### Current Phase: Phase 1 - Collections

**Next Steps**:
1. Create `Collection.model.ts`
2. Create `collection.controller.ts`
3. Create `collection.routes.ts`
4. Update `Product.model.ts` to add collection field
5. Create seed script for collections
6. Test all endpoints
7. Update documentation

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/collections-api

# Make changes
git add .
git commit -m "feat: implement Collections API (Phase 1)"

# Push to remote
git push origin feature/collections-api

# Create pull request
```

### Testing Workflow

```bash
# Run all tests (when implemented)
npm test

# Run specific test
npm test -- collections

# Run with coverage
npm run test:coverage

# Manual testing with curl
./scripts/test-endpoints.sh
```

---

## Performance Targets

### Response Times
- Health check: < 10ms
- Product list: < 100ms
- Single product: < 50ms
- Cart operations: < 100ms
- Order creation: < 200ms
- Search queries: < 150ms

### Database
- Indexed fields for common queries
- Compound indexes for filters
- Virtual fields for calculated data
- Aggregation pipelines for stats

### Security
- Helmet for security headers
- CORS configured for production
- Rate limiting on public endpoints
- JWT validation on protected routes
- Input sanitization
- Error messages don't leak sensitive data

---

## Deployment

### Production Checklist

- [ ] Environment variables set
- [ ] MongoDB Atlas configured
- [ ] Clerk production keys
- [ ] SMTP service configured
- [ ] CORS updated for production domain
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] SSL certificate installed
- [ ] Health checks working
- [ ] Backup strategy implemented

### Hosting Options

**Backend**:
- Railway (recommended)
- Render
- DigitalOcean App Platform
- AWS EC2 / ECS

**Frontend**:
- Vercel (recommended for Vite)
- Netlify
- CloudFlare Pages

**Database**:
- MongoDB Atlas (recommended)
- Self-hosted MongoDB

---

## Support & Resources

### Documentation Links
- **Express**: https://expressjs.com/
- **Mongoose**: https://mongoosejs.com/
- **Clerk**: https://clerk.com/docs
- **React Query**: https://tanstack.com/query/
- **Vite**: https://vitejs.dev/

### Project Resources
- Backend API Docs: `backend/API_ENDPOINTS.md`
- Implementation Guide: `backend/docs/IMPLEMENTATION_PHASES.md`
- Frontend Requirements: `FRONTEND_API_REQUIREMENTS.md`

---

## Current Development Status

**Last Updated**: February 17, 2026

### Completed
✅ Backend foundation (Express + MongoDB + Clerk)  
✅ Product, Cart, Order models and endpoints  
✅ 8 products seeded  
✅ Server running on localhost:3001  
✅ Frontend UI complete with mock data  
✅ All documentation created  
✅ Implementation roadmap defined  

### In Progress
🔄 Phase 1: Collections API (ready to start)

### Pending
⏳ Phase 2: Product Enhancements  
⏳ Phase 3: Reviews API  
⏳ Phase 4: Articles API  
⏳ Phase 5: Contact & Newsletter  
⏳ Frontend integration with backend  
⏳ Testing & deployment  

---

**Ready to implement Phase 1: Collections!** 🚀

See `backend/docs/IMPLEMENTATION_PHASES.md` for detailed implementation guide.

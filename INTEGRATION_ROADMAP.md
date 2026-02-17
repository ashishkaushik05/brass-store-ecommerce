# 🔄 Backend-Frontend Integration Roadmap
## Pitalya Custom Commerce Integration Plan

**Date:** February 17, 2026  
**Project:** Pitalya Storefront + Custom Backend  
**Stack:** React + Express + MongoDB + Clerk + PhonePe  
**Architecture:** Custom Headless Commerce (Non-Shopify)

---

## Executive Summary

This document provides a comprehensive integration plan between the existing Pitalya frontend (React/TypeScript SPA) and the custom Express backend (MongoDB + Clerk + PhonePe).

**Key Changes from Original Audit:**
- ❌ **No Shopify Integration** - Custom backend replaces Shopify Storefront API
- ✅ **Server-Side Cart** - MongoDB cart replaces client-side Zustand cart
- ✅ **Clerk Authentication** - JWT-based auth replaces Shopify customer auth
- ✅ **PhonePe Payments** - Indian payment gateway replaces Shopify checkout
- ✅ **REST API** - Express REST endpoints replace GraphQL

**Timeline:** 6-8 weeks for full stack integration  
**Deployment:** Frontend (Vercel) + Backend (Railway/Render) + MongoDB Atlas

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Critical Integration Points](#2-critical-integration-points)
3. [API Contract Specification](#3-api-contract-specification)
4. [Authentication Flow](#4-authentication-flow)
5. [Cart Integration Strategy](#5-cart-integration-strategy)
6. [Payment Flow Architecture](#6-payment-flow-architecture)
7. [Backend Implementation Plan](#7-backend-implementation-plan)
8. [Frontend Integration Plan](#8-frontend-integration-plan)
9. [Data Models & Schemas](#9-data-models--schemas)
10. [Error Handling Strategy](#10-error-handling-strategy)
11. [Security Requirements](#11-security-requirements)
12. [Testing Strategy](#12-testing-strategy)
13. [Deployment Architecture](#13-deployment-architecture)
14. [Phase-by-Phase Implementation](#14-phase-by-phase-implementation)

---

## 1. Architecture Overview

### 1.1 System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React SPA)                      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Product    │  │     Cart     │  │   Checkout   │      │
│  │    Pages     │  │     Page     │  │     Flow     │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │               │
│         └──────────────────┴──────────────────┘               │
│                            │                                  │
│                    ┌───────▼────────┐                         │
│                    │  Clerk React   │                         │
│                    │   SDK (Auth)   │                         │
│                    └───────┬────────┘                         │
│                            │ JWT Token                        │
└────────────────────────────┼──────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  API Client     │
                    │  (axios/fetch)  │
                    └────────┬────────┘
                             │ Authorization: Bearer <JWT>
                             │
┌────────────────────────────▼──────────────────────────────────┐
│                    BACKEND (Express API)                       │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐    │
│  │          Clerk JWT Verification Middleware           │    │
│  │              (attaches userId to req)                │    │
│  └────────────────────┬─────────────────────────────────┘    │
│                       │                                        │
│  ┌────────────────────▼─────────────────────────────────┐    │
│  │                   Route Handlers                      │    │
│  │  /products  /cart  /orders  /payments  /coupons     │    │
│  └────────────────────┬─────────────────────────────────┘    │
│                       │                                        │
│  ┌────────────────────▼─────────────────────────────────┐    │
│  │              Business Logic Layer                     │    │
│  │   CartService  OrderService  PaymentService          │    │
│  └────────────────────┬─────────────────────────────────┘    │
│                       │                                        │
└───────────────────────┼────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┬──────────────┐
        │               │               │              │
┌───────▼──────┐ ┌──────▼──────┐ ┌─────▼──────┐ ┌────▼────┐
│   MongoDB    │ │    Clerk    │ │  PhonePe   │ │ Resend  │
│   (Atlas)    │ │  (Auth API) │ │   (Pay)    │ │ (Email) │
└──────────────┘ └─────────────┘ └────────────┘ └─────────┘
```

### 1.2 Technology Stack Comparison

| Layer | Original Plan (Shopify) | New Plan (Custom) |
|-------|------------------------|-------------------|
| **Frontend Framework** | React 19 + TypeScript | ✅ Same |
| **Routing** | React Router | ✅ Same |
| **Styling** | Tailwind CSS | ✅ Same |
| **State Management** | Zustand (client cart) | React Query (server cart) |
| **API Protocol** | GraphQL | **REST** |
| **Data Source** | Shopify Storefront API | **Custom Express API** |
| **Authentication** | Shopify Customer API | **Clerk** |
| **Cart Storage** | localStorage | **MongoDB (server-side)** |
| **Payment** | Shopify Checkout | **PhonePe Gateway** |
| **Backend** | None (Shopify hosted) | **Express + TypeScript** |
| **Database** | N/A | **MongoDB Atlas** |
| **Deployment** | Vercel | **Frontend: Vercel, Backend: Railway** |

### 1.3 Key Architectural Decisions

#### Decision 1: Server-Side Cart
**Rationale:**
- ✅ Cart persists across devices/sessions
- ✅ No cart abandonment if localStorage cleared
- ✅ Easier inventory validation
- ✅ Supports logged-out users (session-based cart)
- ⚠️ Requires API call for every cart operation

#### Decision 2: Clerk for Authentication
**Rationale:**
- ✅ JWT-based auth (no session cookies needed)
- ✅ Social login out-of-the-box
- ✅ User management UI included
- ✅ Free tier sufficient for MVP
- ⚠️ Adds external dependency

#### Decision 3: PhonePe Payment Gateway
**Rationale:**
- ✅ Native Indian payment support (UPI, cards, wallets)
- ✅ Lower transaction fees than Stripe
- ✅ Popular in Indian market
- ⚠️ Requires webhook security setup

#### Decision 4: Modular Monolith (Not Microservices)
**Rationale:**
- ✅ Faster development
- ✅ Simpler deployment
- ✅ Easier debugging
- ✅ Can split later if needed

---

## 2. Critical Integration Points

### 2.1 Integration Complexity Matrix

| Integration Point | Complexity | Effort | Risk | Priority |
|------------------|-----------|--------|------|----------|
| **Clerk Auth Setup** | Low | 4h | Low | P0 (Critical) |
| **Product Catalog API** | Low | 8h | Low | P0 (Critical) |
| **Server Cart API** | Medium | 16h | Medium | P0 (Critical) |
| **Order Creation** | Medium | 12h | Medium | P0 (Critical) |
| **PhonePe Integration** | High | 24h | High | P0 (Critical) |
| **Webhook Security** | High | 8h | High | P0 (Critical) |
| **Email Notifications** | Low | 6h | Low | P1 (Important) |
| **Coupon System** | Medium | 10h | Low | P1 (Important) |
| **Order Tracking** | Low | 4h | Low | P2 (Nice to have) |

**Total Estimated Effort:** 92 hours (~12 days)

### 2.2 Breaking Changes from Original Audit

| Original Recommendation | Updated Requirement | Migration Effort |
|------------------------|-------------------|------------------|
| Install `@shopify/storefront-api-client` | Install `axios` + Clerk SDK | 2h |
| GraphQL queries in `api/queries/` | REST endpoints in `api/endpoints.ts` | 6h |
| Zustand cart store with localStorage | React Query cart hooks | 8h |
| Shopify checkout redirect | PhonePe payment flow | 12h |
| No backend needed | Build Express backend | 80h |

### 2.3 Frontend Code That Must Change

**Files requiring major refactoring:**

```
❌ api/shopify.ts          → ✅ api/backend.ts
❌ api/queries/*.ts        → ✅ api/endpoints.ts
❌ stores/cartStore.ts     → ✅ hooks/useCart.ts (React Query)
❌ hooks/useProducts.ts    → ✅ hooks/useProducts.ts (REST)
❌ pages/ProductPage.tsx   → ⚠️ Update to use Clerk auth
❌ pages/CheckoutPage.tsx  → ✅ NEW: PhonePe redirect flow
```

**Files needing minor updates:**

```
⚠️ App.tsx                 → Add <ClerkProvider>
⚠️ components/Header.tsx   → Use server cart count
⚠️ components/ProductCard.tsx → Call addToCart API
⚠️ package.json            → Add Clerk + remove Shopify deps
```

---

## 3. API Contract Specification

### 3.1 Base Configuration

```typescript
// api/config.ts
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// api/client.ts
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT
apiClient.interceptors.request.use(async (config) => {
  const { getToken } = useAuth();
  const token = await getToken();
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 3.2 Products API

#### GET /api/products

**Purpose:** Fetch all products with optional filtering

**Query Parameters:**
```typescript
interface ProductFilters {
  category?: string;
  tag?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'createdAt_desc';
  limit?: number;
  page?: number;
}
```

**Request:**
```http
GET /api/products?category=lamps&sortBy=price_asc&limit=20&page=1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Vintage Brass Diya",
        "slug": "vintage-brass-diya",
        "description": "Hand-beaten brass diya...",
        "price": 2400,
        "images": ["url1", "url2"],
        "category": "Lamps & Diyas",
        "tags": ["best-seller", "handcrafted"],
        "stock": 15,
        "isActive": true,
        "metadata": {
          "finish": "Antique",
          "usage": "Puja",
          "dimensions": "4\" H x 3\" W",
          "weight": "250g"
        },
        "createdAt": "2026-01-15T10:30:00Z",
        "updatedAt": "2026-02-10T14:20:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

**Frontend Implementation:**
```typescript
// hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

interface UseProductsOptions {
  category?: string;
  tag?: string;
  sortBy?: string;
  limit?: number;
  page?: number;
}

export const useProducts = (options: UseProductsOptions = {}) => {
  return useQuery({
    queryKey: ['products', options],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/products', {
        params: options,
      });
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

---

#### GET /api/products/:slug

**Purpose:** Fetch single product by slug

**Request:**
```http
GET /api/products/vintage-brass-diya
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Vintage Brass Diya",
    "slug": "vintage-brass-diya",
    "description": "Hand-beaten brass diya...",
    "price": 2400,
    "images": ["url1", "url2", "url3"],
    "category": "Lamps & Diyas",
    "tags": ["best-seller", "handcrafted"],
    "stock": 15,
    "isActive": true,
    "metadata": {
      "finish": "Antique",
      "usage": "Puja",
      "dimensions": "4\" H x 3\" W",
      "weight": "250g"
    },
    "relatedProducts": [
      {
        "_id": "...",
        "name": "...",
        "slug": "...",
        "price": 3200,
        "image": "url"
      }
    ]
  }
}
```

**Frontend Implementation:**
```typescript
// hooks/useProduct.ts
export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/products/${slug}`);
      return data.data;
    },
    enabled: !!slug,
  });
};
```

---

### 3.3 Cart API

#### GET /api/cart

**Purpose:** Fetch current user's cart

**Authentication:** Required (Clerk JWT)

**Request:**
```http
GET /api/cart
Authorization: Bearer <clerk_jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "cart_123",
    "userId": "user_2abc...",
    "items": [
      {
        "productId": "507f1f77bcf86cd799439011",
        "name": "Vintage Brass Diya",
        "slug": "vintage-brass-diya",
        "price": 2400,
        "image": "url1",
        "quantity": 2
      }
    ],
    "subtotal": 4800,
    "itemCount": 2,
    "updatedAt": "2026-02-17T10:30:00Z"
  }
}
```

**Frontend Implementation:**
```typescript
// hooks/useCart.ts
export const useCart = () => {
  const { isSignedIn } = useAuth();
  
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/cart');
      return data.data;
    },
    enabled: isSignedIn,
    staleTime: 0, // Always fresh
  });
};
```

---

#### POST /api/cart/add

**Purpose:** Add product to cart

**Authentication:** Required

**Request:**
```http
POST /api/cart/add
Authorization: Bearer <clerk_jwt_token>
Content-Type: application/json

{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product added to cart",
  "data": {
    "_id": "cart_123",
    "items": [...],
    "subtotal": 7200,
    "itemCount": 3
  }
}
```

**Frontend Implementation:**
```typescript
// hooks/useAddToCart.ts
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { addToast } = useUIStore();
  
  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const { data } = await apiClient.post('/api/cart/add', {
        productId,
        quantity,
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      addToast({
        type: 'success',
        message: 'Product added to cart',
      });
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to add to cart',
      });
    },
  });
};
```

---

#### POST /api/cart/update

**Purpose:** Update product quantity in cart

**Request:**
```http
POST /api/cart/update
Authorization: Bearer <clerk_jwt_token>

{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cart updated",
  "data": {
    "items": [...],
    "subtotal": 7200,
    "itemCount": 3
  }
}
```

---

#### POST /api/cart/remove

**Purpose:** Remove product from cart

**Request:**
```http
POST /api/cart/remove
Authorization: Bearer <clerk_jwt_token>

{
  "productId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product removed from cart",
  "data": {
    "items": [...],
    "subtotal": 4800,
    "itemCount": 2
  }
}
```

---

#### DELETE /api/cart/clear

**Purpose:** Clear entire cart

**Request:**
```http
DELETE /api/cart/clear
Authorization: Bearer <clerk_jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Cart cleared",
  "data": {
    "items": [],
    "subtotal": 0,
    "itemCount": 0
  }
}
```

---

### 3.4 Orders API

#### POST /api/orders/create

**Purpose:** Create order from cart

**Authentication:** Required

**Request:**
```http
POST /api/orders/create
Authorization: Bearer <clerk_jwt_token>

{
  "shippingAddress": {
    "fullName": "Rajesh Kumar",
    "phone": "+919876543210",
    "addressLine1": "123 MG Road",
    "addressLine2": "Near City Mall",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001",
    "country": "India"
  },
  "couponCode": "WELCOME10"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "order_abc123",
    "subtotal": 4800,
    "discount": 480,
    "total": 4320,
    "status": "created",
    "paymentRequired": true,
    "createdAt": "2026-02-17T10:30:00Z"
  }
}
```

**Frontend Implementation:**
```typescript
// hooks/useCreateOrder.ts
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderData: CreateOrderRequest) => {
      const { data } = await apiClient.post('/api/orders/create', orderData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
```

---

#### GET /api/orders/:orderId

**Purpose:** Fetch order details

**Authentication:** Required

**Request:**
```http
GET /api/orders/order_abc123
Authorization: Bearer <clerk_jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "order_abc123",
    "userId": "user_2abc...",
    "items": [
      {
        "productId": "...",
        "name": "Vintage Brass Diya",
        "price": 2400,
        "quantity": 2,
        "image": "url"
      }
    ],
    "subtotal": 4800,
    "discount": 480,
    "total": 4320,
    "shippingAddress": {...},
    "payment": {
      "provider": "phonepe",
      "status": "paid",
      "transactionId": "T2026021712345"
    },
    "status": "shipped",
    "tracking": {
      "carrier": "Delhivery",
      "trackingNumber": "DL123456789",
      "description": "In transit to Bangalore"
    },
    "createdAt": "2026-02-17T10:30:00Z",
    "updatedAt": "2026-02-18T14:20:00Z"
  }
}
```

---

#### GET /api/orders/my

**Purpose:** Fetch all orders for current user

**Authentication:** Required

**Request:**
```http
GET /api/orders/my?page=1&limit=10
Authorization: Bearer <clerk_jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "_id": "order_abc123",
        "total": 4320,
        "status": "shipped",
        "itemCount": 2,
        "createdAt": "2026-02-17T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "pages": 1
    }
  }
}
```

---

### 3.5 Payments API

#### POST /api/payments/phonepe/initiate

**Purpose:** Initiate PhonePe payment for order

**Authentication:** Required

**Request:**
```http
POST /api/payments/phonepe/initiate
Authorization: Bearer <clerk_jwt_token>

{
  "orderId": "order_abc123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentUrl": "https://mercury.phonepe.com/transact/pg?token=...",
    "transactionId": "T2026021712345",
    "expiresAt": "2026-02-17T11:30:00Z"
  }
}
```

**Frontend Implementation:**
```typescript
// hooks/useInitiatePayment.ts
export const useInitiatePayment = () => {
  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await apiClient.post('/api/payments/phonepe/initiate', {
        orderId,
      });
      return data.data;
    },
    onSuccess: (data) => {
      // Redirect to PhonePe
      window.location.href = data.paymentUrl;
    },
  });
};
```

---

#### POST /api/payments/phonepe/webhook

**Purpose:** PhonePe payment callback (backend-only, not called by frontend)

**Authentication:** PhonePe signature verification

**Request:**
```http
POST /api/payments/phonepe/webhook
X-VERIFY: <phonepe_signature>

{
  "response": "<base64_encoded_response>"
}
```

**Backend Processing:**
1. Verify PhonePe signature
2. Decode response
3. Update order payment status
4. Send confirmation email
5. Clear user's cart

---

### 3.6 Coupons API

#### POST /api/checkout/apply-coupon

**Purpose:** Validate and apply coupon code

**Authentication:** Required

**Request:**
```http
POST /api/checkout/apply-coupon
Authorization: Bearer <clerk_jwt_token>

{
  "code": "WELCOME10"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "code": "WELCOME10",
    "type": "percent",
    "value": 10,
    "discount": 480,
    "newTotal": 4320,
    "message": "Coupon applied successfully"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_COUPON",
    "message": "Coupon code is invalid or expired"
  }
}
```

---

### 3.7 Collections API

#### GET /api/collections

**Purpose:** Fetch all collections

**Request:**
```http
GET /api/collections
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "coll_123",
      "name": "God Idols",
      "slug": "god-idols",
      "description": "Sacred spaces reimagined...",
      "image": "url",
      "productCount": 12
    }
  ]
}
```

---

#### GET /api/collections/:slug/products

**Purpose:** Fetch products in a collection

**Request:**
```http
GET /api/collections/god-idols/products?page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": {
    "collection": {
      "name": "God Idols",
      "slug": "god-idols",
      "description": "..."
    },
    "products": [...],
    "pagination": {...}
  }
}
```

---

### 3.8 Error Response Format

**All API errors follow this structure:**

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional context"
    }
  }
}
```

**Common Error Codes:**

| Code | HTTP Status | Meaning |
|------|------------|---------|
| `UNAUTHORIZED` | 401 | Invalid or missing JWT token |
| `FORBIDDEN` | 403 | Valid token but insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `PRODUCT_OUT_OF_STOCK` | 400 | Product unavailable |
| `INVALID_COUPON` | 400 | Coupon invalid/expired |
| `PAYMENT_FAILED` | 402 | Payment processing failed |
| `SERVER_ERROR` | 500 | Internal server error |

---

## 4. Authentication Flow

### 4.1 Clerk Integration Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  FRONTEND (React)                        │
│                                                          │
│  ┌────────────────────────────────────────────┐         │
│  │   <ClerkProvider publishableKey="...">     │         │
│  │                                             │         │
│  │     ┌─────────────────────────────┐        │         │
│  │     │   <SignedIn>                │        │         │
│  │     │     <UserButton />          │        │         │
│  │     │     <App />                 │        │         │
│  │     │   </SignedIn>               │        │         │
│  │     │                             │        │         │
│  │     │   <SignedOut>               │        │         │
│  │     │     <RedirectToSignIn />    │        │         │
│  │     │   </SignedOut>              │        │         │
│  │     └─────────────────────────────┘        │         │
│  │                                             │         │
│  └────────────────────────────────────────────┘         │
│                                                          │
│  const { getToken, userId, isSignedIn } = useAuth();    │
│                                                          │
└────────────────────┬─────────────────────────────────────┘
                     │
                     │ getToken() → JWT
                     │
┌────────────────────▼─────────────────────────────────────┐
│              API Request                                  │
│  Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI...   │
└────────────────────┬─────────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────────┐
│                  BACKEND (Express)                        │
│                                                          │
│  ┌────────────────────────────────────────────┐         │
│  │  Clerk JWT Verification Middleware         │         │
│  │                                             │         │
│  │  1. Extract JWT from Authorization header  │         │
│  │  2. Verify with Clerk public key           │         │
│  │  3. Decode userId from token               │         │
│  │  4. Attach to req.userId                   │         │
│  └────────────────────────────────────────────┘         │
│                                                          │
│  Route Handler receives: req.userId                      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 4.2 Frontend Setup

**Install Dependencies:**
```bash
npm install @clerk/clerk-react
```

**App Setup:**
```tsx
// main.tsx
import { ClerkProvider } from '@clerk/clerk-react';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
```

**App.tsx:**
```tsx
import { SignedIn, SignedOut, RedirectToSignIn, UserButton } from '@clerk/clerk-react';

function App() {
  return (
    <>
      <SignedIn>
        <BrowserRouter>
          <Header />
          <Routes>{/* ... */}</Routes>
          <Footer />
        </BrowserRouter>
      </SignedIn>
      
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
```

**Header Component:**
```tsx
// components/Header.tsx
import { UserButton, useUser } from '@clerk/clerk-react';

const Header = () => {
  const { user } = useUser();
  
  return (
    <header>
      <nav>
        {/* ... navigation ... */}
      </nav>
      <div className="flex items-center gap-4">
        <CartIcon />
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
};
```

**API Client with JWT:**
```typescript
// api/client.ts
import { useAuth } from '@clerk/clerk-react';

// Create axios instance
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Create hook for authenticated requests
export const useApiClient = () => {
  const { getToken } = useAuth();
  
  return useMemo(() => {
    const client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
    });
    
    client.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    
    return client;
  }, [getToken]);
};
```

### 4.3 Backend Setup

**Install Dependencies:**
```bash
npm install @clerk/express
```

**Middleware:**
```typescript
// middleware/clerkAuth.ts
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

export const requireAuth = ClerkExpressRequireAuth({
  // Optional: Custom error handler
  onError: (error) => {
    console.error('Auth error:', error);
  },
});

// Type augmentation for req.auth
declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        sessionId: string;
      };
    }
  }
}
```

**Usage in Routes:**
```typescript
// routes/cart.routes.ts
import { requireAuth } from '../middleware/clerkAuth';

const router = Router();

// All cart routes require authentication
router.use(requireAuth);

router.get('/', async (req, res) => {
  const userId = req.auth.userId;
  
  const cart = await Cart.findOne({ userId });
  res.json({ success: true, data: cart });
});

router.post('/add', async (req, res) => {
  const userId = req.auth.userId;
  const { productId, quantity } = req.body;
  
  // Add to cart logic
});
```

### 4.4 Guest User Handling

**Strategy:** Session-based cart for non-authenticated users

```typescript
// Backend: Cart service
export class CartService {
  async getCart(userId?: string, sessionId?: string) {
    if (userId) {
      return Cart.findOne({ userId });
    } else if (sessionId) {
      return Cart.findOne({ sessionId });
    }
    throw new Error('No identifier provided');
  }
  
  async mergeGuestCart(userId: string, sessionId: string) {
    const guestCart = await Cart.findOne({ sessionId });
    const userCart = await Cart.findOne({ userId });
    
    if (guestCart && userCart) {
      // Merge items
      userCart.items = [...userCart.items, ...guestCart.items];
      await userCart.save();
      await guestCart.deleteOne();
    } else if (guestCart) {
      // Convert guest cart to user cart
      guestCart.userId = userId;
      guestCart.sessionId = undefined;
      await guestCart.save();
    }
  }
}
```

---

## 5. Cart Integration Strategy

### 5.1 Cart State Management Comparison

**❌ Original Plan (Client-Side Zustand):**
```typescript
// stores/cartStore.ts
export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => ({
        items: [...state.items, item]
      })),
    }),
    { name: 'pitalya-cart' }
  )
);
```

**✅ New Plan (Server-Side React Query):**
```typescript
// hooks/useCart.ts
export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/cart');
      return data.data;
    },
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, quantity }) => {
      const { data } = await apiClient.post('/api/cart/add', {
        productId,
        quantity,
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
```

### 5.2 Cart Component Refactoring

**Before (Client-Side):**
```tsx
// components/ProductCard.tsx
import { useCartStore } from '@/stores/cartStore';

const ProductCard = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  
  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  };
  
  return (
    <button onClick={handleAddToCart}>Add to Cart</button>
  );
};
```

**After (Server-Side):**
```tsx
// components/ProductCard.tsx
import { useAddToCart } from '@/hooks/useCart';

const ProductCard = ({ product }) => {
  const addToCart = useAddToCart();
  
  const handleAddToCart = () => {
    addToCart.mutate({
      productId: product._id,
      quantity: 1,
    });
  };
  
  return (
    <button 
      onClick={handleAddToCart}
      disabled={addToCart.isLoading}
    >
      {addToCart.isLoading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
};
```

### 5.3 Cart Drawer Component

```tsx
// components/cart/CartDrawer.tsx
import { useCart, useUpdateCart, useRemoveFromCart } from '@/hooks/useCart';

export const CartDrawer = () => {
  const { data: cart, isLoading } = useCart();
  const updateCart = useUpdateCart();
  const removeItem = useRemoveFromCart();
  
  if (isLoading) return <CartSkeleton />;
  
  return (
    <Drawer>
      <div className="flex flex-col h-full">
        <CartHeader itemCount={cart?.itemCount || 0} />
        
        <div className="flex-1 overflow-y-auto">
          {cart?.items.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              onUpdateQuantity={(qty) => 
                updateCart.mutate({ 
                  productId: item.productId, 
                  quantity: qty 
                })
              }
              onRemove={() => 
                removeItem.mutate({ productId: item.productId })
              }
            />
          ))}
        </div>
        
        <CartFooter 
          subtotal={cart?.subtotal || 0}
          onCheckout={() => navigate('/checkout')}
        />
      </div>
    </Drawer>
  );
};
```

### 5.4 Cart Count in Header

```tsx
// components/Header.tsx
import { useCart } from '@/hooks/useCart';

const Header = () => {
  const { data: cart } = useCart();
  const cartCount = cart?.itemCount || 0;
  
  return (
    <header>
      <button onClick={toggleCart} className="relative">
        <Icon name="shopping_cart" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {cartCount}
          </span>
        )}
      </button>
    </header>
  );
};
```

### 5.5 Optimistic Updates

```typescript
// hooks/useCart.ts with optimistic updates
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, quantity }) => {
      const { data } = await apiClient.post('/api/cart/add', {
        productId,
        quantity,
      });
      return data.data;
    },
    
    // Optimistic update
    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      
      const previousCart = queryClient.getQueryData(['cart']);
      
      queryClient.setQueryData(['cart'], (old: any) => {
        // Optimistically add item
        return {
          ...old,
          items: [...old.items, { productId, quantity }],
          itemCount: old.itemCount + quantity,
        };
      });
      
      return { previousCart };
    },
    
    // Rollback on error
    onError: (err, variables, context) => {
      queryClient.setQueryData(['cart'], context.previousCart);
    },
    
    // Refetch on success
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
```

---

## 6. Payment Flow Architecture

### 6.1 PhonePe Integration Flow

```
┌──────────────────────────────────────────────────────────┐
│                    CHECKOUT PAGE                          │
│                                                           │
│  1. User fills shipping address                          │
│  2. Reviews cart items                                   │
│  3. Applies coupon (optional)                            │
│  4. Clicks "Proceed to Payment"                          │
│                                                           │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│            POST /api/orders/create                        │
│                                                           │
│  Backend:                                                 │
│  1. Validate cart items                                  │
│  2. Check stock availability                             │
│  3. Apply coupon (if provided)                           │
│  4. Create order in MongoDB (status: "created")          │
│  5. Return orderId                                       │
│                                                           │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│       POST /api/payments/phonepe/initiate                 │
│                                                           │
│  Backend:                                                 │
│  1. Fetch order details                                  │
│  2. Create PhonePe payment request                       │
│  3. Generate merchant transaction ID                     │
│  4. Sign request with PhonePe credentials                │
│  5. Return payment URL                                   │
│                                                           │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│         REDIRECT TO PHONEPE PAYMENT PAGE                  │
│                                                           │
│  User completes payment:                                 │
│  - UPI                                                   │
│  - Credit/Debit Card                                     │
│  - Net Banking                                           │
│  - Wallets (PayTM, PhonePe, etc.)                       │
│                                                           │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│         PHONEPE WEBHOOK CALLBACK                          │
│                                                           │
│  POST /api/payments/phonepe/webhook                       │
│                                                           │
│  Backend:                                                 │
│  1. Verify PhonePe signature (X-VERIFY header)           │
│  2. Decode base64 response                               │
│  3. Extract transaction status                           │
│  4. Update order payment status                          │
│  5. Send confirmation email                              │
│  6. Clear user's cart                                    │
│                                                           │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│       REDIRECT TO SUCCESS/FAILURE PAGE                    │
│                                                           │
│  Frontend displays:                                       │
│  - Order confirmation (success)                          │
│  - Payment failed message (failure)                      │
│  - Order tracking link                                   │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### 6.2 Checkout Page Implementation

```tsx
// pages/CheckoutPage.tsx
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useCreateOrder } from '@/hooks/useOrders';
import { useInitiatePayment } from '@/hooks/usePayments';
import { useApplyCoupon } from '@/hooks/useCoupons';

const CheckoutPage = () => {
  const { data: cart } = useCart();
  const createOrder = useCreateOrder();
  const initiatePayment = useInitiatePayment();
  const applyCoupon = useApplyCoupon();
  
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });
  
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  
  const handleApplyCoupon = async () => {
    const result = await applyCoupon.mutateAsync({ code: couponCode });
    setDiscount(result.discount);
  };
  
  const handlePlaceOrder = async () => {
    // Step 1: Create order
    const order = await createOrder.mutateAsync({
      shippingAddress,
      couponCode: couponCode || undefined,
    });
    
    // Step 2: Initiate payment
    await initiatePayment.mutateAsync(order.orderId);
    // User is redirected to PhonePe
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Shipping Form */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
          <ShippingAddressForm
            address={shippingAddress}
            onChange={setShippingAddress}
          />
        </div>
        
        {/* Right: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 sticky top-24">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            
            {/* Cart Items */}
            <div className="space-y-3 mb-4">
              {cart?.items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <img src={item.image} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            
            {/* Coupon */}
            <div className="border-t pt-4 mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 border rounded px-3 py-2"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={applyCoupon.isLoading}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Apply
                </button>
              </div>
              {discount > 0 && (
                <p className="text-sm text-green-600 mt-2">
                  Discount applied: -₹{discount}
                </p>
              )}
            </div>
            
            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cart?.subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>₹{(cart?.subtotal || 0) - discount}</span>
              </div>
            </div>
            
            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={createOrder.isLoading || initiatePayment.isLoading}
              className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-bold hover:bg-opacity-90 disabled:opacity-50"
            >
              {createOrder.isLoading || initiatePayment.isLoading
                ? 'Processing...'
                : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### 6.3 Payment Success/Failure Pages

```tsx
// pages/PaymentSuccessPage.tsx
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '@/hooks/useOrders';

const PaymentSuccessPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading } = useOrder(orderId!);
  
  if (isLoading) return <LoadingSpinner />;
  
  if (!order || order.payment.status !== 'paid') {
    return <PaymentFailurePage />;
  }
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name="check_circle" className="text-5xl text-green-600" />
      </div>
      
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-gray-600 mb-8">
        Thank you for your order. We'll send you a confirmation email shortly.
      </p>
      
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-2 gap-4 text-left">
          <div>
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-bold">{order._id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Paid</p>
            <p className="font-bold">₹{order.total}</p>
          </div>
        </div>
      </div>
      
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => navigate(`/orders/${orderId}`)}
          className="px-6 py-3 bg-primary text-white rounded-lg font-bold"
        >
          View Order Details
        </button>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-3 border border-gray-300 rounded-lg font-bold"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};
```

### 6.4 Backend Payment Service

```typescript
// services/payment.service.ts
import crypto from 'crypto';
import axios from 'axios';

export class PaymentService {
  private merchantId: string;
  private merchantKey: string;
  private apiEndpoint: string;
  
  constructor() {
    this.merchantId = process.env.PHONEPE_MERCHANT_ID!;
    this.merchantKey = process.env.PHONEPE_MERCHANT_KEY!;
    this.apiEndpoint = process.env.PHONEPE_API_ENDPOINT!;
  }
  
  async initiatePayment(orderId: string, amount: number, userId: string) {
    const transactionId = `T${Date.now()}`;
    
    const payload = {
      merchantId: this.merchantId,
      merchantTransactionId: transactionId,
      merchantUserId: userId,
      amount: amount * 100, // Convert to paise
      redirectUrl: `${process.env.FRONTEND_URL}/payment/callback?orderId=${orderId}`,
      redirectMode: 'POST',
      callbackUrl: `${process.env.BACKEND_URL}/api/payments/phonepe/webhook`,
      mobileNumber: '9999999999', // Optional
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };
    
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const checksum = this.generateChecksum(base64Payload);
    
    const response = await axios.post(
      `${this.apiEndpoint}/pg/v1/pay`,
      {
        request: base64Payload
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum
        }
      }
    );
    
    // Update order with transaction ID
    await Order.findByIdAndUpdate(orderId, {
      'payment.transactionId': transactionId,
      'payment.status': 'pending'
    });
    
    return {
      paymentUrl: response.data.data.instrumentResponse.redirectInfo.url,
      transactionId
    };
  }
  
  verifyWebhook(signature: string, payload: string): boolean {
    const expectedSignature = this.generateChecksum(payload);
    return signature === expectedSignature;
  }
  
  private generateChecksum(payload: string): string {
    const string = payload + '/pg/v1/pay' + this.merchantKey;
    return crypto.createHash('sha256').update(string).digest('hex') + '###1';
  }
}
```

---

## 7. Backend Implementation Plan

### 7.1 Project Setup

**Initialize Project:**
```bash
mkdir pitalya-backend
cd pitalya-backend
npm init -y

# Install dependencies
npm install express typescript ts-node @types/node @types/express
npm install mongoose dotenv cors helmet morgan
npm install @clerk/clerk-sdk-node
npm install pino pino-pretty
npm install zod

# Dev dependencies
npm install -D nodemon @types/cors @types/morgan
npm install -D eslint prettier
```

**TypeScript Configuration:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Package.json Scripts:**
```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  }
}
```

### 7.2 Folder Structure

```
pitalya-backend/
├── src/
│   ├── config/
│   │   ├── env.ts
│   │   └── database.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   ├── requestLogger.ts
│   │   └── validation.ts
│   ├── models/
│   │   ├── Product.model.ts
│   │   ├── Cart.model.ts
│   │   ├── Order.model.ts
│   │   └── Coupon.model.ts
│   ├── services/
│   │   ├── product.service.ts
│   │   ├── cart.service.ts
│   │   ├── order.service.ts
│   │   ├── payment.service.ts
│   │   ├── coupon.service.ts
│   │   └── notification.service.ts
│   ├── routes/
│   │   ├── product.routes.ts
│   │   ├── cart.routes.ts
│   │   ├── order.routes.ts
│   │   ├── payment.routes.ts
│   │   └── coupon.routes.ts
│   ├── controllers/
│   │   ├── product.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── order.controller.ts
│   │   ├── payment.controller.ts
│   │   └── coupon.controller.ts
│   ├── types/
│   │   ├── api.types.ts
│   │   └── models.types.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── ApiError.ts
│   │   └── ApiResponse.ts
│   ├── app.ts
│   └── server.ts
├── .env.example
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

### 7.3 Core Files Implementation

**Environment Configuration:**
```typescript
// src/config/env.ts
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001'),
  
  MONGODB_URI: z.string(),
  
  CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  
  PHONEPE_MERCHANT_ID: z.string(),
  PHONEPE_MERCHANT_KEY: z.string(),
  PHONEPE_API_ENDPOINT: z.string(),
  
  RESEND_API_KEY: z.string(),
  
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  BACKEND_URL: z.string(),
});

export const env = envSchema.parse(process.env);
```

**Database Connection:**
```typescript
// src/config/database.ts
import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '@/utils/logger';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  logger.error('MongoDB error:', error);
});
```

**Express App Setup:**
```typescript
// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './config/env';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';

// Routes
import productRoutes from './routes/product.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import paymentRoutes from './routes/payment.routes';
import couponRoutes from './routes/coupon.routes';

const app = express();

// Security
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));

// Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/checkout', couponRoutes);

// Error handling
app.use(errorHandler);

export default app;
```

**Server Entry Point:**
```typescript
// src/server.ts
import app from './app';
import { env } from './config/env';
import { connectDatabase } from './config/database';
import { logger } from './utils/logger';

const PORT = env.PORT || 3001;

async function startServer() {
  try {
    // Connect to database
    await connectDatabase();
    
    // Start server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});
```

### 7.4 Implementation Phases

**Phase 1: Infrastructure (Days 1-2)**
- ✅ Project setup and dependencies
- ✅ TypeScript configuration
- ✅ MongoDB connection
- ✅ Clerk middleware
- ✅ Logger setup
- ✅ Error handling middleware

**Phase 2: Products Module (Days 3-4)**
- ✅ Product model
- ✅ Product service
- ✅ Product controller
- ✅ Product routes (GET /products, GET /products/:slug)
- ✅ Seed sample products

**Phase 3: Cart Module (Days 5-7)**
- ✅ Cart model
- ✅ Cart service (CRUD operations)
- ✅ Cart controller
- ✅ Cart routes (GET, POST add/update/remove, DELETE clear)
- ✅ Guest cart support (session-based)

**Phase 4: Orders Module (Days 8-10)**
- ✅ Order model
- ✅ Order service
- ✅ Order controller
- ✅ Order creation endpoint
- ✅ Order retrieval endpoints

**Phase 5: Payments Module (Days 11-14)**
- ✅ Payment service
- ✅ PhonePe SDK integration
- ✅ Payment initiation endpoint
- ✅ Webhook handler
- ✅ Signature verification
- ✅ Order status updates

**Phase 6: Coupons Module (Days 15-16)**
- ✅ Coupon model
- ✅ Coupon service (validation logic)
- ✅ Coupon controller
- ✅ Apply coupon endpoint

**Phase 7: Notifications (Days 17-18)**
- ✅ Email service (Resend integration)
- ✅ Order confirmation email
- ✅ Payment success email
- ✅ Shipping notification email

**Phase 8: Testing & Polish (Days 19-20)**
- ✅ Integration tests
- ✅ API documentation
- ✅ Security audit
- ✅ Performance testing

---

## 8. Frontend Integration Plan

### 8.1 Preparation Phase (Days 1-3)

**Remove Shopify Dependencies:**
```bash
# Remove if installed
npm uninstall @shopify/storefront-api-client
```

**Install New Dependencies:**
```bash
# Core
npm install @clerk/clerk-react
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install axios

# Utilities
npm install react-hot-toast  # For toast notifications
npm install date-fns         # Date formatting

# Remove if using Zustand for cart (we're not)
# npm uninstall zustand
```

**Update Environment Variables:**
```bash
# .env
VITE_API_BASE_URL=http://localhost:3001
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### 8.2 Architecture Setup (Days 4-5)

**Setup Clerk Provider:**
```tsx
// main.tsx
import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ClerkProvider>
  </React.StrictMode>
);
```

**Create API Client:**
```typescript
// api/client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Will be used in hooks with Clerk auth
```

### 8.3 Migration Tasks

**Task 1: Replace mockData imports**
- ❌ Before: `import { products } from './data/mockData'`
- ✅ After: `const { data: products } = useProducts()`

**Task 2: Create API hooks**
```
hooks/
  useProducts.ts     ✅ New
  useProduct.ts      ✅ New
  useCart.ts         ✅ New
  useOrders.ts       ✅ New
  usePayments.ts     ✅ New
  useCoupons.ts      ✅ New
```

**Task 3: Update components**
```
components/
  Header.tsx         ⚠️ Update: Use useCart() for count
  ProductCard.tsx    ⚠️ Update: Use useAddToCart()
  CartDrawer.tsx     ✅ New: Implement cart UI
```

**Task 4: Create new pages**
```
pages/
  CheckoutPage.tsx   ✅ New
  PaymentSuccessPage.tsx ✅ New
  PaymentFailurePage.tsx ✅ New
  OrdersPage.tsx     ✅ New
  OrderDetailPage.tsx ✅ New
```

### 8.4 Frontend Implementation Timeline

**Week 1: Foundation**
- Day 1-2: Setup Clerk + React Query
- Day 3: Create API client with auth
- Day 4-5: Implement product hooks

**Week 2: Cart Integration**
- Day 6-7: Implement cart hooks
- Day 8-9: Build CartDrawer component
- Day 10: Update Header cart count

**Week 3: Checkout & Payments**
- Day 11-12: Build CheckoutPage
- Day 13-14: Implement payment flow
- Day 15: Create success/failure pages

**Week 4: Orders & Polish**
- Day 16-17: Build order history page
- Day 18: Order detail page
- Day 19-20: Testing and bug fixes

---

## 9. Data Models & Schemas

### 9.1 MongoDB Schemas

**Product Model:**
```typescript
// models/Product.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  tags: string[];
  stock: number;
  isActive: boolean;
  metadata: {
    finish?: string;
    usage?: string;
    dimensions?: string;
    weight?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    images: { type: [String], required: true },
    category: { type: String, required: true, index: true },
    tags: { type: [String], default: [], index: true },
    stock: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
    metadata: {
      finish: String,
      usage: String,
      dimensions: String,
      weight: String,
    },
  },
  {
    timestamps: true,
  }
);

// Text search index
ProductSchema.index({ name: 'text', description: 'text' });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
```

**Cart Model:**
```typescript
// models/Cart.model.ts
import mongoose, { Schema, Document } from 'mongoose';

interface ICartItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
}

export interface ICart extends Document {
  userId?: string;
  sessionId?: string;
  items: ICartItem[];
  updatedAt: Date;
}

const CartSchema = new Schema<ICart>(
  {
    userId: { type: String, sparse: true, index: true },
    sessionId: { type: String, sparse: true, index: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Ensure either userId or sessionId is present
CartSchema.index({ userId: 1 }, { unique: true, sparse: true });
CartSchema.index({ sessionId: 1 }, { unique: true, sparse: true });

export const Cart = mongoose.model<ICart>('Cart', CartSchema);
```

**Order Model:**
```typescript
// models/Order.model.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
}

interface IShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface IPayment {
  provider: 'phonepe';
  status: 'pending' | 'paid' | 'failed';
  transactionId?: string;
  paidAt?: Date;
}

interface ITracking {
  carrier?: string;
  trackingNumber?: string;
  description?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
}

export interface IOrder extends Document {
  userId: string;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  shippingAddress: IShippingAddress;
  payment: IPayment;
  tracking?: ITracking;
  status: 'created' | 'paid' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true, index: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        slug: String,
        price: Number,
        image: String,
        quantity: Number,
      },
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    shippingAddress: {
      fullName: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
    },
    payment: {
      provider: { type: String, enum: ['phonepe'], default: 'phonepe' },
      status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
      transactionId: String,
      paidAt: Date,
    },
    tracking: {
      carrier: String,
      trackingNumber: String,
      description: String,
      shippedAt: Date,
      deliveredAt: Date,
    },
    status: {
      type: String,
      enum: ['created', 'paid', 'packed', 'shipped', 'delivered', 'cancelled'],
      default: 'created',
      index: true,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Unique transaction ID
OrderSchema.index({ 'payment.transactionId': 1 }, { unique: true, sparse: true });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
```

**Coupon Model:**
```typescript
// models/Coupon.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  expiresAt?: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    type: { type: String, enum: ['percent', 'flat'], required: true },
    value: { type: Number, required: true },
    minOrderValue: { type: Number, default: 0 },
    maxDiscount: Number,
    expiresAt: Date,
    usageLimit: Number,
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Coupon = mongoose.model<ICoupon>('Coupon', CouponSchema);
```

---

## 10. Error Handling Strategy

### 10.1 Backend Error Classes

```typescript
// utils/ApiError.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }
  
  static badRequest(message: string, code = 'BAD_REQUEST', details?: any) {
    return new ApiError(400, message, code, details);
  }
  
  static unauthorized(message = 'Unauthorized', code = 'UNAUTHORIZED') {
    return new ApiError(401, message, code);
  }
  
  static forbidden(message = 'Forbidden', code = 'FORBIDDEN') {
    return new ApiError(403, message, code);
  }
  
  static notFound(message = 'Resource not found', code = 'NOT_FOUND') {
    return new ApiError(404, message, code);
  }
  
  static internal(message = 'Internal server error', code = 'INTERNAL_ERROR') {
    return new ApiError(500, message, code);
  }
}
```

**Error Handler Middleware:**
```typescript
// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@/utils/ApiError';
import { logger } from '@/utils/logger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    });
  }
  
  // Mongoose validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: error.message,
      },
    });
  }
  
  // Mongoose cast errors
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_ID',
        message: 'Invalid ID format',
      },
    });
  }
  
  // Log unexpected errors
  logger.error('Unexpected error:', error);
  
  // Generic error response
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  });
};
```

### 10.2 Frontend Error Handling

**API Error Interceptor:**
```typescript
// api/client.ts
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = {
      code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
      message: error.response?.data?.error?.message || 'An error occurred',
      details: error.response?.data?.error?.details,
    };
    
    // Handle specific error codes
    if (apiError.code === 'UNAUTHORIZED') {
      // Redirect to login
      window.location.href = '/login';
    }
    
    return Promise.reject(apiError);
  }
);
```

**React Query Error Handling:**
```typescript
// hooks/useProducts.ts
export const useProducts = (options: UseProductsOptions = {}) => {
  return useQuery({
    queryKey: ['products', options],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/products', {
        params: options,
      });
      return data.data;
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to load products');
    },
  });
};
```

---

## 11. Security Requirements

### 11.1 Backend Security Checklist

**Authentication & Authorization:**
- ✅ Clerk JWT verification on protected routes
- ✅ Validate userId from JWT matches resource owner
- ✅ Rate limiting on sensitive endpoints

**Input Validation:**
- ✅ Zod schema validation for all request bodies
- ✅ Sanitize user input
- ✅ Validate file uploads (if applicable)

**Payment Security:**
- ✅ PhonePe webhook signature verification
- ✅ HTTPS only in production
- ✅ Idempotent payment processing

**Database Security:**
- ✅ MongoDB Atlas with IP whitelist
- ✅ Secure connection string in environment variables
- ✅ Regular backups

**API Security:**
- ✅ CORS configuration
- ✅ Helmet.js for security headers
- ✅ Request size limits

**Example Validation:**
```typescript
// routes/cart.routes.ts
import { z } from 'zod';
import { validate } from '@/middleware/validation';

const addToCartSchema = z.object({
  body: z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
    quantity: z.number().int().min(1).max(10),
  }),
});

router.post(
  '/add',
  requireAuth,
  validate(addToCartSchema),
  cartController.addToCart
);
```

### 11.2 Frontend Security

**Environment Variables:**
- ✅ Never expose backend secrets in frontend
- ✅ Only `VITE_` prefixed variables are accessible

**XSS Prevention:**
- ✅ React automatically escapes values
- ✅ Avoid `dangerouslySetInnerHTML`

**CSRF Protection:**
- ✅ JWT in header (not cookie) prevents CSRF

---

## 12. Testing Strategy

### 12.1 Backend Testing

**Unit Tests:**
```typescript
// __tests__/services/cart.service.test.ts
import { CartService } from '@/services/cart.service';

describe('CartService', () => {
  it('should add item to cart', async () => {
    const cartService = new CartService();
    const result = await cartService.addItem('user123', 'prod123', 1);
    expect(result.items).toHaveLength(1);
  });
});
```

**Integration Tests:**
```typescript
// __tests__/routes/cart.routes.test.ts
import request from 'supertest';
import app from '@/app';

describe('POST /api/cart/add', () => {
  it('should add item with valid auth', async () => {
    const response = await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${validJWT}`)
      .send({ productId: 'prod123', quantity: 1 });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

### 12.2 Frontend Testing

**Component Tests:**
```typescript
// __tests__/components/ProductCard.test.tsx
import { render, screen } from '@testing-library/react';
import { ProductCard } from '@/components/ProductCard';

describe('ProductCard', () => {
  it('should render product name', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Vintage Brass Diya')).toBeInTheDocument();
  });
});
```

**E2E Tests (Playwright):**
```typescript
// e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test('complete checkout flow', async ({ page }) => {
  await page.goto('/shop');
  await page.click('[data-testid="add-to-cart"]');
  await page.click('[data-testid="checkout"]');
  await page.fill('[name="fullName"]', 'John Doe');
  await page.click('[data-testid="place-order"]');
  
  await expect(page).toHaveURL(/payment-success/);
});
```

---

## 13. Deployment Architecture

### 13.1 Infrastructure Overview

```
┌─────────────────────────────────────────────────────────┐
│                     PRODUCTION                           │
└─────────────────────────────────────────────────────────┘

┌──────────────────┐      ┌──────────────────┐
│   Vercel         │      │   Railway        │
│   (Frontend)     │◄────►│   (Backend)      │
│                  │      │                  │
│ pitalya.com      │      │ api.pitalya.com  │
└──────────────────┘      └────────┬─────────┘
                                   │
                          ┌────────▼─────────┐
                          │  MongoDB Atlas   │
                          │   (Database)     │
                          └──────────────────┘

External Services:
├── Clerk (auth.clerk.com)
├── PhonePe (mercury.phonepe.com)
└── Resend (api.resend.com)
```

### 13.2 Frontend Deployment (Vercel)

**Build Configuration:**
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "env": {
    "VITE_API_BASE_URL": "https://api.pitalya.com",
    "VITE_CLERK_PUBLISHABLE_KEY": "@clerk_publishable_key"
  }
}
```

**Deployment Steps:**
```bash
# Connect repo to Vercel
vercel link

# Deploy
vercel --prod
```

### 13.3 Backend Deployment (Railway)

**Dockerfile:**
```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3001

CMD ["node", "dist/server.js"]
```

**Railway Configuration:**
```toml
# railway.toml
[build]
builder = "dockerfile"

[deploy]
startCommand = "node dist/server.js"
healthcheckPath = "/health"
healthcheckTimeout = 30
```

**Environment Variables (Railway):**
```
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://...
CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
PHONEPE_MERCHANT_ID=...
PHONEPE_MERCHANT_KEY=...
PHONEPE_API_ENDPOINT=https://api.phonepe.com
RESEND_API_KEY=...
FRONTEND_URL=https://pitalya.com
BACKEND_URL=https://api.pitalya.com
```

### 13.4 Database (MongoDB Atlas)

**Configuration:**
- Cluster: M10 (Shared)
- Region: Mumbai (ap-south-1)
- Backup: Enabled (daily)
- IP Whitelist: Railway IP + office IP

**Connection String:**
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/pitalya?retryWrites=true&w=majority
```

---

## 14. Phase-by-Phase Implementation

### 14.1 Phase 1: Backend Foundation (Week 1)

**Days 1-2: Setup**
- [ ] Initialize Node.js project
- [ ] Install dependencies
- [ ] Setup TypeScript
- [ ] Configure MongoDB connection
- [ ] Setup Clerk middleware
- [ ] Create logger utility
- [ ] Create error handler middleware

**Days 3-4: Products Module**
- [ ] Create Product model
- [ ] Create Product service
- [ ] Create Product controller
- [ ] Create Product routes
- [ ] Seed sample products
- [ ] Test endpoints

**Days 5-7: Cart Module**
- [ ] Create Cart model
- [ ] Create Cart service
- [ ] Create Cart controller
- [ ] Create Cart routes
- [ ] Test cart operations
- [ ] Handle guest carts

**Milestone:** Backend can serve products and manage carts

---

### 14.2 Phase 2: Orders & Payments (Week 2)

**Days 8-10: Orders Module**
- [ ] Create Order model
- [ ] Create Order service
- [ ] Create Order controller
- [ ] Create order routes
- [ ] Test order creation

**Days 11-14: Payments Module**
- [ ] Setup PhonePe SDK
- [ ] Create Payment service
- [ ] Implement payment initiation
- [ ] Implement webhook handler
- [ ] Test webhook signature verification
- [ ] Test payment flow

**Milestone:** Complete order-to-payment flow working

---

### 14.3 Phase 3: Frontend Core (Week 3)

**Days 15-17: Setup & Auth**
- [ ] Install Clerk SDK
- [ ] Setup ClerkProvider
- [ ] Create API client
- [ ] Setup React Query
- [ ] Create auth wrapper

**Days 18-19: Products Integration**
- [ ] Create useProducts hook
- [ ] Create useProduct hook
- [ ] Update HomePage
- [ ] Update ShopPage
- [ ] Update ProductPage

**Days 20-21: Cart Integration**
- [ ] Create useCart hooks
- [ ] Build CartDrawer component
- [ ] Update Header with cart count
- [ ] Update ProductCard with add-to-cart

**Milestone:** Users can browse products and add to cart

---

### 14.4 Phase 4: Checkout & Payments (Week 4)

**Days 22-24: Checkout Flow**
- [ ] Create CheckoutPage
- [ ] Build shipping address form
- [ ] Implement coupon application
- [ ] Create order summary

**Days 25-26: Payment Integration**
- [ ] Implement useCreateOrder hook
- [ ] Implement useInitiatePayment hook
- [ ] Create payment redirect flow
- [ ] Create PaymentSuccessPage
- [ ] Create PaymentFailurePage

**Days 27-28: Orders Pages**
- [ ] Create OrdersPage (order history)
- [ ] Create OrderDetailPage
- [ ] Test complete flow

**Milestone:** End-to-end purchase flow complete

---

### 14.5 Phase 5: Polish & Launch (Week 5-6)

**Days 29-31: Backend Enhancements**
- [ ] Add coupons module
- [ ] Add email notifications
- [ ] Add tracking updates endpoint
- [ ] Performance optimization

**Days 32-34: Frontend Polish**
- [ ] Add loading skeletons
- [ ] Add error boundaries
- [ ] Add toast notifications
- [ ] Mobile menu implementation

**Days 35-37: Testing**
- [ ] Write backend integration tests
- [ ] Write frontend component tests
- [ ] E2E testing with Playwright
- [ ] Security audit

**Days 38-40: Deployment**
- [ ] Deploy backend to Railway
- [ ] Deploy frontend to Vercel
- [ ] Configure MongoDB Atlas
- [ ] Setup monitoring
- [ ] Final testing in production

**Milestone:** Production launch! 🚀

---

## 15. Success Criteria

### 15.1 Backend Metrics

- [ ] All API endpoints respond within 500ms
- [ ] 99.9% uptime
- [ ] Zero payment processing errors
- [ ] All webhooks verified successfully
- [ ] Database queries optimized (indexed)

### 15.2 Frontend Metrics

- [ ] Lighthouse Performance Score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] No console errors
- [ ] Mobile responsive

### 15.3 Business Metrics

- [ ] Successful order placement
- [ ] Cart abandonment < 70%
- [ ] Payment success rate > 95%
- [ ] Email delivery rate > 98%

---

## 16. Post-Launch Roadmap

**Month 1:**
- Monitor error rates
- Collect user feedback
- Optimize slow queries
- Add admin dashboard (basic)

**Month 2:**
- Implement inventory tracking
- Add product reviews
- Add wishlist feature
- SMS notifications

**Month 3:**
- Advanced search with filters
- Product recommendations
- Loyalty program
- Analytics dashboard

---

## 17. Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| PhonePe integration failure | High | Test in sandbox thoroughly |
| Cart data loss | Medium | Regular MongoDB backups |
| Auth token expiry | Low | Clerk handles refresh automatically |
| Payment webhook missed | High | Implement retry logic + manual reconciliation |
| Database connection issues | High | Connection pooling + retry logic |

---

## Conclusion

This integration roadmap provides a complete path from the current frontend-only prototype to a fully functional e-commerce platform with custom backend.

**Key Takeaways:**
1. **Timeline:** 6-8 weeks for full integration
2. **Critical Path:** Backend → Frontend → Testing → Deployment
3. **Major Changes:** Client cart → Server cart, Shopify → Custom API
4. **Technology Shift:** GraphQL → REST, localStorage → MongoDB

**Next Steps:**
1. Review and approve this roadmap
2. Setup development environments
3. Begin Phase 1: Backend foundation
4. Iterate with regular testing

---

**Document Version:** 1.0  
**Last Updated:** February 17, 2026  
**Status:** Ready for Implementation

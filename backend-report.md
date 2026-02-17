# 🧾 Custom Commerce Backend Architecture Report

## Project: Pitalya Custom Commerce Backend

**Stack:** Express + TypeScript + MongoDB + Clerk + PhonePe
**Cart Strategy:** Server-side cart (Mongo-backed)
**Architecture Style:** Modular Monolith
**Audience:** AI agents / developers implementing backend

---

# 1. Executive Summary

This document defines the architecture and implementation plan for a custom headless commerce backend replacing Shopify Storefront.

The goal is to build a **simple, production-capable backend** with full control over:

* Cart management
* Orders
* Payments (PhonePe)
* Coupons
* Tracking updates
* Notifications

The system intentionally avoids microservices and overengineering.

> Design Philosophy: Simple, scalable, and fully controllable commerce core.

---

# 2. Core Architectural Principles

## 2.1 Constraints

* Single backend service
* MongoDB as primary datastore
* No microservices initially
* Clerk handles authentication
* Server-side cart only

## 2.2 Goals

* High developer velocity
* Easy frontend integration
* Indian payment ecosystem compatibility
* Minimal infrastructure complexity

## 2.3 Non-Goals (for v1)

* No admin dashboard (manual DB updates OK)
* No microservice split
* No complex inventory engine
* No advanced analytics

---

# 3. Tech Stack

## Backend

* Node.js
* Express
* TypeScript

## Database

* MongoDB (single cluster)
* Mongoose or native driver

## Auth

* Clerk (JWT verification only)

## Payments

* PhonePe Payment Gateway SDK

## Notifications

* Email (Resend recommended)
* SMS optional later

## Logging

* Pino structured logging

---

# 4. System Overview

```
Frontend (React Storefront)
        ↓
Express API (TypeScript)
        ↓
MongoDB
        ↓
External Services:
- Clerk (auth)
- PhonePe (payments)
- Email provider
```

---

# 5. Module Breakdown

## Core Modules

1. Authentication Middleware (Clerk)
2. Products
3. Cart (server-side)
4. Orders
5. Payments (PhonePe)
6. Coupons
7. Shipping & Tracking
8. Notifications
9. Logging & Observability

---

# 6. Authentication Layer

## Responsibility

* Verify Clerk JWT
* Attach `userId` to request

## Middleware Behavior

```
verifyClerkJWT()
→ req.userId
```

No custom auth logic required.

---

# 7. Products Module

## Purpose

Simple catalog storage in MongoDB.

## Schema

```ts
Product {
  _id
  name: string
  slug: string
  description: string
  price: number
  images: string[]
  stock: number
  isActive: boolean
  createdAt
  updatedAt
}
```

## Notes

* Admin can seed manually
* No complex inventory logic initially

---

# 8. Server Cart Module

## Strategy: Server-Side Cart

Each authenticated user has exactly one cart stored in MongoDB.

## Cart Schema

```ts
Cart {
  _id
  userId: string
  items: [
    {
      productId: ObjectId
      name: string
      price: number
      image: string
      quantity: number
    }
  ]
  updatedAt: Date
}
```

## API Endpoints

```
GET    /cart
POST   /cart/add
POST   /cart/update
POST   /cart/remove
DELETE /cart/clear
```

## Rules

* Cart tied to Clerk userId
* Prices stored redundantly for snapshot safety
* Cart cleared after successful order

---

# 9. Orders Module

## Lifecycle

```
CREATED
→ PAYMENT_PENDING
→ PAID
→ PACKED
→ SHIPPED
→ DELIVERED
```

## Order Schema

```ts
Order {
  _id
  userId: string

  items: CartItem[]

  subtotal: number
  discount: number
  total: number

  payment: {
    provider: "phonepe"
    status: "pending" | "paid" | "failed"
    transactionId?: string
  }

  shipping: {
    address: ShippingAddress
    trackingNumber?: string
    carrier?: string
    description?: string
  }

  status:
    | "created"
    | "paid"
    | "packed"
    | "shipped"
    | "delivered"
    | "cancelled"

  notes?: string

  createdAt
  updatedAt
}
```

## Endpoints

```
POST   /orders/create
GET    /orders/:id
GET    /orders/my
```

---

# 10. Payment Module (PhonePe)

## Flow

1. Frontend creates order
2. Backend generates PhonePe payment request
3. User redirected to PhonePe
4. PhonePe sends webhook
5. Backend marks order as PAID

## Endpoints

```
POST /payments/phonepe/initiate
POST /payments/phonepe/webhook
```

## Critical Requirements

* Webhook signature verification
* Idempotent payment handling
* Unique transactionId index

---

# 11. Coupon System

## Schema

```ts
Coupon {
  code: string
  type: "percent" | "flat"
  value: number
  minOrderValue?: number
  maxDiscount?: number
  expiresAt?: Date
  usageLimit?: number
  usedCount: number
  isActive: boolean
}
```

## Apply Coupon Flow

```
POST /checkout/apply-coupon
```

### Response

```json
{
  "discount": number,
  "newTotal": number
}
```

## Rules

* Validation done server-side
* Final discount locked during order creation

---

# 12. Shipping & Tracking

## Philosophy

Manual shipping with simple tracking injection.

## Admin Flow

1. Owner ships parcel
2. Gets courier tracking number
3. Updates order

## Admin Endpoint

```
POST /admin/orders/:id/ship
{
  trackingNumber,
  carrier,
  description
}
```

## Customer Experience

Frontend displays:

> Track via Delhivery: DL123123123

No courier integrations required initially.

---

# 13. Notifications Module

## Events

* Order placed
* Payment success
* Order shipped
* Order delivered

## Initial Implementation

* Email only
* Async fire-and-forget

## Future Extensions

* SMS
* WhatsApp
* Push notifications

---

# 14. Logging & Observability

## Logger

Use Pino structured logging.

## Requirements

* Request logs
* Error logs
* Payment logs
* Order lifecycle logs

## Example Middleware

```ts
logger.info({
  method: req.method,
  path: req.path,
  user: req.userId
})
```

---

# 15. Folder Structure

```
src/
  app.ts
  server.ts

  config/
    env.ts
    db.ts

  middleware/
    clerkAuth.ts
    errorHandler.ts
    requestLogger.ts

  modules/
    products/
    cart/
    orders/
    payments/
    coupons/
    notifications/

  utils/
    logger.ts
    phonepe.ts
```

Architecture style: Modular Monolith.

---

# 16. Security Requirements

## Must-Haves

### 1. Webhook Verification

PhonePe webhook signatures must be verified.

### 2. Idempotency

Prevent duplicate payments.

* Unique index on payment.transactionId

### 3. Rate Limiting

Apply to:

* Checkout
* Coupon apply

### 4. Input Validation

Use:

* Zod recommended

---

# 17. API Design Principles

* REST-first
* Resource-oriented routes
* Auth-required by default
* Versionable (`/api/v1` optional)

Example:

```
/api/cart
/api/orders
/api/payments
```

---

# 18. Development Phases

## Phase 1 — Infrastructure

* Express + TS setup
* Mongo connection
* Clerk middleware
* Logger setup

## Phase 2 — Catalog + Cart

* Product schema
* Cart APIs

## Phase 3 — Orders

* Order schema
* Create order endpoint

## Phase 4 — Payments

* PhonePe integration
* Webhook handler

## Phase 5 — Coupons

* Coupon validation engine

## Phase 6 — Shipping

* Tracking updates

## Phase 7 — Notifications

* Email integrations

---

# 19. Future Extensions

* Admin dashboard
* Inventory tracking
* Refund engine
* Analytics layer
* Multi-vendor support
* Queue-based events (BullMQ)

---

# 20. Summary

This architecture provides a **lean but production-ready commerce backend** with:

* Full ownership of business logic
* Indian payment compatibility
* Simple extensibility
* Minimal infrastructure overhead

The system is intentionally designed as a **modular monolith** to maximize development speed while remaining scalable.

---

# End of Report

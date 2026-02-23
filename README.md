# Kuber Brass Store — E-commerce Platform

A full-stack e-commerce storefront for handcrafted brass homeware, built with a modern React frontend, an Express/Node.js backend, and a React-based admin panel.

---

## Repositories

| Repo | Description |
|---|---|
| **brass-store-ecommerce** *(this repo)* | Frontend storefront + Admin panel |
| **brass-store-ecommerce-backend** | Express API + MongoDB backend (git submodule) |

---

## Project Structure

```
.
├── frontend/          # Customer-facing storefront (React + Vite)
├── admin/             # Admin panel (React + Vite)
└── backend/           # API server (Express + MongoDB) — git submodule
```

---

## Tech Stack

### Frontend & Admin
- **React 18** + **TypeScript**
- **Vite** (dev server on port 3000 / 3002)
- **Tailwind CSS** for styling
- **React Router v6** (HashRouter)
- **React Query (TanStack Query)** for server state
- **Zustand** for client state (cart, UI)
- **Clerk** for authentication
- **Socket.IO client** for real-time order updates

### Backend
- **Node.js** + **Express** + **TypeScript**
- **MongoDB** + **Mongoose**
- **Clerk** (JWT verification + webhooks)
- **PhonePe** payment gateway (UAT + Production SDK)
- **Socket.IO** for real-time events
- **MinIO** for product image uploads (optional)

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Clerk account → https://clerk.com
- ngrok (optional, for webhook/payment testing)

### 1. Clone with submodule

```bash
git clone --recurse-submodules https://github.com/ashishkaushik05/brass-store-ecommerce.git
cd brass-store-ecommerce
```

If you already cloned without `--recurse-submodules`:

```bash
git submodule update --init --recursive
```

### 2. Backend

```bash
cd backend
cp .env.example .env          # fill in your values
npm install
npm run dev                   # starts on http://localhost:3001
```

Key `.env` variables:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `CLERK_SECRET_KEY` | From Clerk dashboard |
| `WEBHOOK_SECRET` | Clerk webhook signing secret |
| `FRONTEND_URL` | `http://localhost:3000` for local dev |
| `PHONEPE_MERCHANT_ID` | PhonePe merchant ID |
| `PHONEPE_SALT_KEY` | PhonePe salt key |
| `PHONEPE_ENV` | `UAT` or `PRODUCTION` |

### 3. Frontend

```bash
cd frontend
cp .env.example .env          # fill in your values
npm install
npm run dev                   # starts on http://localhost:3000
```

Key `.env` variables:

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend URL (`http://localhost:3001`) |
| `VITE_CLERK_PUBLISHABLE_KEY` | From Clerk dashboard |

### 4. Admin Panel

```bash
cd admin
npm install
npm run dev                   # starts on http://localhost:3002
```

---

## Features

### Storefront
- Home, Shop, Collection, Product detail pages
- Cart with real-time quantity updates
- Clerk authentication (sign-in modal on cart/checkout)
- PhonePe checkout flow
- Real-time order status updates via Socket.IO
- Journal / Article pages
- Story, Craft, Contact, Policies pages

### Admin Panel
- Dashboard overview
- Products CRUD with image uploads
- Collections management
- Orders management with status updates
- Attachments management

### Backend API
- RESTful endpoints for products, collections, cart, orders, users
- Clerk JWT middleware for auth
- Clerk webhook sync (user creation/updates)
- PhonePe payment initiation + callback handling
- Dev simulate endpoint: `POST /api/payments/simulate/:orderId?outcome=success|failed`
- Socket.IO for order status events

---

## Development Notes

### ngrok (Payment / Webhook Testing)

PhonePe and Clerk webhooks require a public URL. Run two ngrok tunnels:

```bash
# Terminal 1 — backend
ngrok http 3001

# Terminal 2 — frontend (for PhonePe redirect)
ngrok http 3000
```

Update `backend/.env`:
```
NGROK_URL=https://<backend-tunnel>.ngrok-free.app
FRONTEND_NGROK_URL=https://<frontend-tunnel>.ngrok-free.app
PHONEPE_REDIRECT_BASE_URL=https://<frontend-tunnel>.ngrok-free.app
WEBHOOK_URL=https://<backend-tunnel>.ngrok-free.app/webhooks/clerk
```

### Seed Products

```bash
cd backend
npm run seed
```

---

## License

Private — All rights reserved.

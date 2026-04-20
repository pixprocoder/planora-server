# Medi-Store Server

A backend REST API for an online pharmacy/medical store platform built with **Express.js**, **TypeScript**, and **PostgreSQL**. Supports multi-role authentication (Customer, Seller, Admin) with medicine catalog management, order processing, and customer reviews.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js + TypeScript |
| Framework | Express.js v5 |
| Database | PostgreSQL |
| ORM | Prisma v7 |
| Auth | better-auth v1 |

---

## Getting Started

### Prerequisites
- Node.js v18+ or Bun
- PostgreSQL v14+

### Installation

```bash
git clone <repository-url>
cd medi-store-server

bun install

cp .env.example .env
# configure your .env file

bun run prisma:generate
bun run prisma:migrate
```

### Environment Variables

```env
NODE_ENV=development
PORT=5000

DATABASE_URL=postgresql://username:password@localhost:5432/medi_store

BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_BASE_URL=http://localhost:5000

APP_URL=http://localhost:3000
```

### Running

```bash
# Development (hot-reload)
bun run dev

# Production
bun run build
bun run start
```

---

## API Reference

**Base URL:** `http://localhost:5000/api/v1`

---

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server and database status |

---

### Authentication

Handled by `better-auth` at `/api/auth/*`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/sign-up` | Register a new user |
| `POST` | `/api/auth/sign-in` | Login |
| `POST` | `/api/auth/sign-out` | Logout |
| `GET` | `/api/auth/session` | Get current session |

---

### Medicines (Public)

> No authentication required

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/categories` | List all categories |
| `GET` | `/api/v1/medicines` | List all medicines (supports filtering & search) |
| `GET` | `/api/v1/medicines/:id` | Get a single medicine |

**Query Parameters for `GET /medicines`:**

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Search by name |
| `category` | string | Filter by category ID |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |

---

### Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/reviews/medicine/:id` | Public | Get reviews for a medicine |
| `GET` | `/api/v1/reviews` | CUSTOMER | Get the current user's reviews |
| `POST` | `/api/v1/reviews/:id` | CUSTOMER | Create a review for a medicine |
| `PUT` | `/api/v1/reviews/:id` | CUSTOMER | Update own review |
| `DELETE` | `/api/v1/reviews/:id` | CUSTOMER | Delete own review |

---

### Orders (Customer)

> Requires `CUSTOMER` role

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/orders` | Get the customer's orders |
| `GET` | `/api/v1/orders/:id` | Get a specific order |
| `POST` | `/api/v1/orders` | Place a new order |

---

### Seller

> Requires `SELLER` role

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/seller/orders` | Get orders for the seller's medicines |
| `POST` | `/api/v1/seller/medicines/create` | Create a new medicine listing |
| `PUT` | `/api/v1/seller/medicines/:id` | Update a medicine listing |
| `DELETE` | `/api/v1/seller/medicines/:id` | Delete a medicine listing |
| `PATCH` | `/api/v1/seller/orders/:id` | Update order status |

---

### Admin

> Requires `ADMIN` role

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/admin/users` | List all users |
| `PATCH` | `/api/v1/admin/users/:id` | Update user status (ACTIVE / BANNED / SUSPENDED) |
| `GET` | `/api/v1/admin/medicines` | List all medicines |
| `GET` | `/api/v1/admin/orders` | List all orders |
| `GET` | `/api/v1/admin/orders/:id` | Get order details |
| `POST` | `/api/v1/admin/categories` | Create a category |
| `PATCH` | `/api/v1/admin/categories/:id` | Update a category |
| `DELETE` | `/api/v1/admin/categories/:id` | Delete a category |

---

## Response Format

### Success

```json
{
  "success": true,
  "message": "Operation successful",
  "statusCode": 200,
  "data": {},
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

### Error

```json
{
  "success": false,
  "message": "Error message",
  "statusCode": 400
}
```

---

## User Roles & Permissions

| Role | Capabilities |
|------|-------------|
| `CUSTOMER` | Browse medicines, place orders, manage own reviews |
| `SELLER` | Manage medicine inventory, fulfill orders, update order status |
| `ADMIN` | Manage all users, medicines, orders, and categories |

---

## Status Enums

**Order Status:** `PLACED` → `PROCESSING` → `SHIPPED` → `DELIVERED`

**Payment Status:** `PENDING` | `PAID` | `FAILED` | `REFUNDED`

**Medicine Status:** `DRAFT` → `PENDING` → `APPROVED` | `REJECTED`

**User Status:** `ACTIVE` | `BANNED` | `SUSPENDED`

---

## Project Structure

```
src/
├── modules/
│   ├── medicine/       # medicine.route.ts | .controller.ts | .service.ts
│   ├── order/          # order.route.ts | .controller.ts | .service.ts
│   ├── review/         # review.route.ts | .controller.ts | .service.ts
│   ├── seller/         # seller.route.ts | .controller.ts | .service.ts
│   └── admin/          # admin.route.ts | .controller.ts | .service.ts
├── routes/             # Route aggregation
├── middlewares/        # Auth, error handling
├── lib/                # Prisma, better-auth setup
├── app.ts
└── server.ts
```

---

## License

ISC

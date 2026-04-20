# Planora Server 🛡️

A state-of-the-art backend REST API for **Planora**, an enterprise-grade event management platform. This server handles secure authentication, dynamic event participation workflows (The 4-Way Matrix), and automated Stripe-backed payments.

## 🚀 Technical Architecture

| Layer | Technology |
|-------|-----------|
| **Runtime** | [Bun](https://bun.sh/) (High-performance JS/TS runtime) |
| **Framework** | [Express.js v5](https://expressjs.com/) |
| **Database** | PostgreSQL |
| **ORM** | [Prisma v7](https://www.prisma.io/) |
| **Auth** | [Better-Auth](https://www.better-auth.com/) (Database-backed sessions) |
| **Payments** | [Stripe](https://stripe.com/) (Checkout & Webhooks) |
| **Validation** | [Zod](https://zod.dev/) (Schema-first validation) |

---

## ✨ Core Features

### 📅 Advanced Event Lifecycle
- **Full CRUD**: Manage titles, dates, venues, and descriptions.
- **Privacy Controls**: Switch between `PUBLIC` (discoverable) and `PRIVATE` (hidden/exclusive) events.
- **Categorization**: Multi-category support (Tech, Music, Sports, etc.).

### 🤝 The 4-Way Participation Matrix
A robust workflow that handles every type of event entry:
1. **Public Free**: Instant approval upon joining.
2. **Public Paid**: Instant approval after Stripe payment.
3. **Private Free**: Requires Organizer approval first.
4. **Private Paid**: Requires Organizer approval $\rightarrow$ then User Pays $\rightarrow$ then finalized.

### 💳 Payment & Security
- **Stripe Integration**: Secure Checkout Sessions with automatic order fulfillment via Webhooks.
- **Signature Verification**: Prevents webhook spoofing using raw-body parsing and HMAC validation.
- **Moderation**: Admin-level user management (Ban/Activate) and global review moderation.

---

## 🛠️ Installation & Setup

### Prerequisites
- [Bun](https://bun.sh/) 
- [Stripe CLI](https://stripe.com/docs/stripe-cli) (for local webhook testing)
- PostgreSQL

### 1. Initialize
```bash
bun install
```

### 2. Environment Configuration
Create a `.env` file with the following variables:
```env
DATABASE_URL="postgresql://..."
APP_URL="http://localhost:6006"
CLIENT_URL="http://localhost:3000"

# Auth
BETTER_AUTH_SECRET="your-secret"
GOOGLE_CLIENT_ID="your-google-id"
GOOGLE_CLIENT_SECRET="your-google-secret"

# Payments
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..." # Get this from `stripe listen`
```

### 3. Database Migration
```bash
bun run prisma:generate
bun run prisma:migrate
```

### 4. Local Webhook Testing
To receive Stripe events correctly on localhost:
```bash
stripe listen --forward-to localhost:6006/api/v1/payments/webhook
```

---

## 🗺️ API Documentation (v1)

### 🔑 Authentication
Managed by **Better-Auth** at `/api/auth/*`. Supports Google OAuth and Email/Password.

### 👤 Profile
- `GET /api/v1/users/me` - Get current user profile.
- `PATCH /api/v1/users/profile` - Update own name, phone, or image.
- `PATCH /api/v1/users/status/:id` - (**Admin Only**) Ban or activate a user.

### 📅 Events
- `GET /api/v1/events` - List all discoverable events.
- `GET /api/v1/events/my-events` - Get events organized by the current user.
- `POST /api/v1/events` - Create an event.

### 💳 Payments
- `POST /api/v1/payments/create-checkout-session` - Start a payment for an event.
- `POST /api/v1/payments/webhook` - (**Private**) Stripe automated handler.

### ⭐ Reviews
- `GET /api/v1/reviews/event/:eventId` - Public reviews for an event.
- `POST /api/v1/reviews` - Verified-attendee-only feedback.

---

## 🏗️ Folder Structure
```
src/
├── modules/         # Modular feature logic (Service, Controller, Route)
├── middlewares/     # Auth, Validation, and Global Error Handling
├── lib/             # Prisma & Better-Auth clients
├── routes/          # Central Route Registry
└── server.ts        # Entry point
```

---

## 📄 License
MIT

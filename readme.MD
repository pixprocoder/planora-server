# Planora Server 🛡️

A robust backend REST API for **Planora**, an event management platform designed to streamline event organization, discovery, and community participation. Built with a modern tech stack focused on performance, security, and scalability.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Bun / Node.js |
| **Language** | TypeScript |
| **Framework** | Express.js v5 |
| **Database** | PostgreSQL |
| **ORM** | Prisma v7 |
| **Auth** | Better-Auth v1 |
| **Security** | Helmet, Rate Limiter |

---

## ✨ Features

- **🛡️ Secure Authentication**: Multi-role support (ADMIN, USER) using Better-Auth with session persistence.
- **📅 Event Management**: Full CRUD for events (Title, Date, Time, Venue, Fee) with Public/Private visibility controls.
- **🤝 4-Way Join Matrix**: Robust join-request system with status tracking (Pending, Approved, Rejected, Banned).
- **💳 Payment Integration**: Support for tracking event participation fees and payment status.
- **⭐ Community Trust**: Integrated review and rating system for events.
- **📁 Categorization**: Organize events by categories for better discoverability.

---

## 🛠️ Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (Recommended) or Node.js v20+
- PostgreSQL v15+

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd planora-server
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Configure Environment:**
   Create a `.env` file from the template:
   ```bash
   cp .env.example .env
   ```
   *Note: Update `DATABASE_URL`, `BETTER_AUTH_SECRET`, and Google OAuth credentials.*

4. **Database Setup:**
   ```bash
   bun run prisma:generate
   bun run prisma:migrate
   ```

### Running the Server

```bash
# Development (with hot-reload)
bun run dev

# Production Build
bun run build
bun run start
```

---

## 🗺️ API Reference

**Base URL:** `http://localhost:5000/api/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/health` | Server and database health check |
| `POST` | `/api/auth/sign-in` | Authenticate user |
| `GET`  | `/api/v1/events` | List all public events |
| `POST` | `/api/v1/events` | Create a new event (Organizers) |
| `POST` | `/api/v1/join-requests` | Request participation in an event |
| `GET`  | `/api/v1/reviews` | View event ratings and comments |

---

## 📁 Project Structure

```
src/
├── modules/         # Feature-based logic (Events, Join Requests, Reviews)
├── routes/          # API Route definitions
├── middlewares/     # Auth & Error handling
├── lib/             # Third-party initializations (Prisma, Better-Auth)
├── constants/       # Enums and configuration
├── app.ts           # Express Application setup
└── server.ts        # Entry point
```

---

## 📄 License

ISC

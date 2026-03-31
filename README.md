# 🌱 AgriSmart — Agricultural Advisory Platform (Backend)

> **Connecting Rwandan farmers with certified agricultural advisors to increase yields and improve livelihoods.**

AgriSmart is a full-stack agricultural advisory platform built for Rwanda. This repository contains the **NestJS REST API backend** that powers role-based dashboards for Farmers, Advisors, and System Administrators — complete with real-time chat, weather data, market prices, and a knowledge base.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Default Seeded Users & Credentials](#-default-seeded-users--credentials)
- [API Overview](#-api-overview)
  - [Base URL & Swagger Docs](#base-url--swagger-docs)
  - [Authentication](#authentication)
  - [Endpoints by Module](#endpoints-by-module)
- [WebSocket — Real-Time Chat](#-websocket--real-time-chat)
- [Database](#-database)
- [Security](#-security)
- [Testing](#-testing)
- [Scripts Reference](#-scripts-reference)
- [License](#-license)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Secure login/register with role-based access control (RBAC) |
| 👤 **Three User Roles** | ADMIN, ADVISOR, FARMER — each with dedicated dashboards and permissions |
| 💬 **Real-Time Chat** | 1-on-1 and group messaging via WebSockets (Socket.IO) |
| 🌤 **Live Weather** | District-level weather data and farming recommendations (Open-Meteo API) |
| 💹 **Market Prices** | Real-time crop price data from UNOCHA HAPI |
| 📚 **Knowledge Base** | Advisors upload guides/resources (PDFs, images) via Supabase Storage |
| 📅 **Crop Calendar** | Advisors assign crop task schedules to farmers |
| 👥 **Groups & Cooperatives** | Farmers join regional cooperatives for group messaging and coordination |
| 🤖 **Auto-Seeding** | Default admin account is automatically created on first startup |
| 🌍 **i18n** | Multi-language support (English & Kinyarwanda) |
| 📖 **Swagger UI** | Interactive API documentation available out of the box |
| 🛡 **Security** | Helmet.js, CSP headers, CORS, input validation, bcrypt password hashing |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [NestJS](https://nestjs.com/) v11 (Node.js + TypeScript) |
| **Database** | PostgreSQL via [TypeORM](https://typeorm.io/) |
| **Cloud Storage** | [Supabase](https://supabase.com/) (file uploads) |
| **Authentication** | JWT + Passport.js |
| **Real-Time** | Socket.IO + NestJS WebSockets |
| **API Docs** | Swagger / OpenAPI 3.0 |
| **Mail** | Nodemailer (Gmail SMTP) |
| **Security** | Helmet.js, bcrypt, class-validator |
| **i18n** | nestjs-i18n |
| **Language** | TypeScript 5 |

---

## 📁 Project Structure

```
src/
├── admin/            # Admin-only endpoints (platform stats, advisor approval)
├── advisor/          # Advisor dashboard and farmer management
├── auth/             # Registration, login, JWT strategy
├── chat/             # REST + WebSocket chat module
├── common/           # Shared guards, decorators, interceptors, filters
├── config/           # Configuration loader (maps .env to typed config)
├── crop-calendar/    # Crop task schedules and notifications
├── database/         # TypeORM setup + auto-seeder (seeds admin on boot)
├── farmer/           # Farmer dashboard, profile, stats
├── groups/           # Cooperatives — create, join, group chat
├── i18n/             # Translation files (en, rw)
├── knowledge-base/   # Resource library upload & listing
├── mail/             # Email service (Nodemailer)
├── market-prices/    # Live crop market prices
├── users/            # User, FarmerProfile, AdvisorProfile entities
├── weather/          # District weather data & recommendations
├── app.module.ts     # Root module
└── main.ts           # App bootstrap (Swagger, CORS, Helmet, pipes)
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** ≥ 18.x — [Download](https://nodejs.org/)
- **npm** ≥ 9.x (comes with Node.js)
- **PostgreSQL** ≥ 14 — [Download](https://www.postgresql.org/download/) or use a hosted instance (e.g. [Supabase](https://supabase.com/))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/M-arnold-tech/Agri-Smart_bankend.git
cd Agri-Smart_bankend

# 2. Install dependencies
npm install
```

### Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and configure the following:

```dotenv
# ── App ─────────────────────────────────────────────
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# ── Database (PostgreSQL) ────────────────────────────
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_NAME=agrismart
DB_SSL=false

# ── Supabase (for file uploads) ──────────────────────
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=agrismart-files

# ── JWT ──────────────────────────────────────────────
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=7d

# ── Mail (Gmail SMTP) ─────────────────────────────────
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-gmail-app-password
MAIL_FROM=AgriSmart <noreply@agrismart.rw>

# ── Default Admin (auto-created on first startup) ────
ADMIN_EMAIL=admin@agrismart.rw
ADMIN_PASSWORD=Admin@1234
ADMIN_FIRST_NAME=System
ADMIN_LAST_NAME=Admin
```

> **Note:** You must create the PostgreSQL database manually before starting the server:
> ```sql
> CREATE DATABASE agrismart;
> ```

### Running the App

```bash
# Development (single run)
npm run dev

# Development with hot-reload (watch mode) — recommended
npm run start:dev

# Production
npm run start:prod
```

Once started, you will see:

```
 ─────────────────────────────────────────────
   AgriSmart API is running!
 ─────────────────────────────────────────────────
      App:     http://localhost:3000/api/v1
      Docs:    http://localhost:3000/api/docs
      Env:     development
 ─────────────────────────────────────────────────
```

---

## 🔑 Default Seeded Users & Credentials

The seeder runs **automatically on every startup** (via `OnApplicationBootstrap`). If the admin account does not yet exist in the database, it will be created immediately.

| Field | Value |
|---|---|
| **Role** | `ADMIN` |
| **Email** | `admin@agrismart.rw` |
| **Password** | `Admin@1234` |
| **First Name** | System |
| **Last Name** | Admin |
| **Status** | Active |

> These values come from your `.env` file (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, etc.).  
> You can change them before the first run or update directly in the database afterward.

**To log in as admin:**

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@agrismart.rw", "password": "Admin@1234"}'
```

You will receive a JWT token in the response. Use it as `Authorization: Bearer <token>` for all protected endpoints.

---

## 📡 API Overview

### Base URL & Swagger Docs

| Environment | URL |
|---|---|
| **API Base** | `http://localhost:3000/api/v1` |
| **Swagger UI** | `http://localhost:3000/api/docs` |

The Swagger UI provides interactive documentation for every endpoint — you can test requests directly in the browser without any extra tooling.

### Authentication

AgriSmart uses **JWT Bearer tokens**. After logging in, include the token in every protected request:

```http
Authorization: Bearer <your_jwt_token>
```

### User Roles

| Role | Access Level |
|---|---|
| `ADMIN` | Platform-wide management: approve advisors, view global stats, deactivate users |
| `ADVISOR` | Manage assigned farmers, upload resources, create crop calendars |
| `FARMER` | Personal dashboard, join cooperatives, chat with advisor, view weather & prices |

---

### Endpoints by Module

#### 🔐 Auth (`/api/v1/auth`)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Register a new Farmer, Advisor, or Admin account | No |
| `POST` | `/auth/login` | Login and receive a JWT token | No |
| `GET` | `/auth/me` | Get the currently authenticated user's profile | ✅ Yes |

**Register payload example:**
```json
{
  "email": "farmer@example.com",
  "password": "StrongPassword123",
  "firstName": "Jean",
  "lastName": "Rukundo",
  "role": "FARMER",
  "district": "Musanze",
  "crops": ["Maize", "Irish Potatoes"]
}
```

---

#### 🛡 Admin (`/api/v1/admin`) — `ADMIN` only

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/stats` | Global platform analytics (users, farmers, advisors) |
| `GET` | `/admin/advisors/pending` | List advisors awaiting verification |
| `PATCH` | `/admin/approve-advisor/:id` | Approve and verify an advisor account |
| `DELETE` | `/admin/users/:id` | Deactivate any user account |

---

#### 🌾 Farmer (`/api/v1/farmer`) — `FARMER` only

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/farmer/my-stats` | Summary of land size, crops, and advisor assignment |
| `GET` | `/farmer/my-advisor` | Details of the assigned advisor |
| `PUT` | `/farmer/profile` | Update farm details (land size, location, crops) |

---

#### 🧑‍🌾 Advisor (`/api/v1/advisor`) — `ADVISOR` only

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/advisor/stats` | Performance stats and farmer count |
| `GET` | `/advisor/assigned-farmers` | List all farmers assigned to this advisor |
| `POST` | `/advisor/assign-farmer/:id` | Self-assign a farmer |

---

#### 💬 Chat (`/api/v1/chat`)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/chat/conversations` | Get all private + group conversations with latest messages | ✅ Yes |
| `GET` | `/chat/history/:userId` | Get 1-on-1 chat history with a specific user | ✅ Yes |
| `GET` | `/chat/group/:groupId` | Get paginated group chat history | ✅ Yes |
| `POST` | `/chat/send` | Send a message via REST (fallback for WebSocket) | ✅ Yes |

---

#### 👥 Groups & Cooperatives (`/api/v1/groups`)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/groups` | List all groups with `memberCount` and `isMember` flag | ✅ Yes |
| `GET` | `/groups/:id` | Get group details including admin and members | ✅ Yes |
| `POST` | `/groups/create` | Create a new cooperative group | ✅ Yes |
| `POST` | `/groups/:id/join` | Join a cooperative | ✅ Yes |

---

#### 📚 Knowledge Base (`/api/v1/knowledge-base`)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/knowledge-base` | List all resources (PDFs, images, guides) | ✅ Yes |
| `POST` | `/knowledge-base/upload` | Upload a new resource file | ADMIN / ADVISOR |

---

#### 📅 Crop Calendar (`/api/v1/crop-calendar`)

Advisors create and assign crop task schedules for their farmers. Supports task creation, listing, and completion tracking.

---

#### 🌤 Weather (`/api/v1/weather`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/weather/:district` | Live weather data and farming recommendations for a Rwandan district |

Powered by [Open-Meteo](https://open-meteo.com/) — no API key required.

---

#### 💹 Market Prices (`/api/v1/market-prices`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/market-prices` | Real-time crop prices across Rwandan markets |

Powered by [UNOCHA HAPI](https://hapi.unocha.org/).

---

### Standard Response Format

All responses are wrapped in a consistent envelope:

**Success (200 / 201):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": { "..." },
  "timestamp": "2026-03-30T10:00:00.000Z"
}
```

**Error (4xx / 5xx):**
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized",
  "timestamp": "2026-03-30T10:00:00.000Z"
}
```

---

## 🔌 WebSocket — Real-Time Chat

Connect to the WebSocket server at:

```
ws://localhost:3000/chat
```

Include your JWT token during the handshake:
```js
const socket = io('http://localhost:3000/chat', {
  auth: { token: 'Bearer <your_jwt_token>' }
});
```

**Client → Server Events:**

| Event | Payload | Description |
|---|---|---|
| `joinRoom` | `{ "roomId": "group_id_or_user_id" }` | Join a private or group chat room |
| `leaveRoom` | `{ "roomId": "..." }` | Leave a room |
| `sendMessage` | `{ "content": "Hello", "receiverId": "ID", "groupId": "ID" }` | Send a message |
| `typing` | `{ "roomId": "ID", "isTyping": true }` | Broadcast typing indicator |

**Server → Client Events:**

| Event | Payload | Description |
|---|---|---|
| `receiveMessage` | `{ sender, content, timestamp, ... }` | A new message was received |
| `userTyping` | `{ "userId": "ID", "isTyping": true }` | Someone is typing |

---

## 🗄 Database

- **ORM:** TypeORM with PostgreSQL
- **Schema sync:** `synchronize: false` — schema is controlled via TypeORM entities and migrations
- **SSL:** Configurable via `DB_SSL=true` (required for Supabase/hosted Postgres)
- **Auto-retry:** 10 retries with 3 s delay on connection failure (in development)

**Main entities:**

| Entity | Table | Description |
|---|---|---|
| `User` | `users` | Core user record (all roles) |
| `FarmerProfile` | `farmer_profiles` | Extended farmer data (land, crops, location) |
| `AdvisorProfile` | `advisor_profiles` | Extended advisor data (specialization, verified status) |

---

## 🛡 Security

- **Helmet.js** — HTTP security headers including Content Security Policy
- **CORS** — Whitelist-based; configured for both Vite (`5173`) and Next.js (`3001`) frontends + production Vercel URL
- **bcrypt** — Passwords hashed with salt rounds of 12 before storage
- **JWT** — Stateless authentication with configurable expiry
- **Validation Pipe** — `class-validator` on all DTOs; strips unknown fields (`whitelist: true`)
- **RBAC** — Role guards enforce `ADMIN`, `ADVISOR`, `FARMER` access per route

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# Unit tests in watch mode
npm run test:watch

# End-to-end tests
npm run test:e2e

# Test coverage report
npm run test:cov
```

---

## 📜 Scripts Reference

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start the app once (no watch) |
| `start:dev` | `npm run start:dev` | Start with hot-reload (development) |
| `start:prod` | `npm run start:prod` | Run compiled production build |
| `build` | `npm run build` | Compile TypeScript to `/dist` |
| `test` | `npm run test` | Run unit tests |
| `test:e2e` | `npm run test:e2e` | Run end-to-end tests |
| `test:cov` | `npm run test:cov` | Generate test coverage report |
| `lint` | `npm run lint` | Lint and auto-fix code style |
| `format` | `npm run format` | Format code with Prettier |

---

## 📄 License

This project is licensed under the **MIT License**.

---

<p align="center">Built with ❤️ for Rwandan farmers · AgriSmart Team</p>

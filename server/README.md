# 🚀 Smart Leads Dashboard — Backend API

A production-ready REST API built with **Node.js + Express + TypeScript + MongoDB**.

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Runtime      | Node.js 20+                         |
| Framework    | Express.js                          |
| Language     | TypeScript (strict mode)            |
| Database     | MongoDB + Mongoose                  |
| Auth         | JWT (jsonwebtoken) + bcrypt         |
| Validation   | express-validator                   |
| Containerize | Docker + Docker Compose             |

---

## Quick Start

### 1. Clone & Install
```bash
cd server
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Run Development Server
```bash
npm run dev
# Server starts at http://localhost:5000
```

### 4. Docker (Full Stack)
```bash
docker-compose up --build
```

---

## Project Structure

```
src/
├── config/
│   └── db.ts              # MongoDB connection
├── controllers/
│   ├── authController.ts  # Register, Login, GetMe
│   └── leadController.ts  # Full CRUD + CSV + Stats
├── middleware/
│   ├── auth.ts            # JWT protect + RBAC authorize
│   ├── errorHandler.ts    # Global error handler
│   └── validate.ts        # express-validator result handler
├── models/
│   ├── User.ts            # User schema with bcrypt hook
│   └── Lead.ts            # Lead schema with indexes
├── routes/
│   ├── auth.ts            # /api/auth/*
│   └── leads.ts           # /api/leads/*
├── types/
│   └── index.ts           # All TS interfaces & enums
├── utils/
│   ├── helpers.ts         # asyncHandler, sendSuccess, sendPaginated
│   └── jwt.ts             # generateToken, verifyToken
├── validators/
│   └── index.ts           # All express-validator chains
├── app.ts                 # Express app setup
└── index.ts               # Server entry point
```

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Auth Header
```
Authorization: Bearer <token>
```

---

### 🔐 Auth Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "Admin" | "Sales User"   // optional, defaults to "Sales User"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbG...",
    "user": { "_id": "...", "name": "John Doe", "email": "...", "role": "Sales User" }
  }
}
```

---

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secret123"
}
```

---

#### Get Me
```http
GET /api/auth/me
Authorization: Bearer <token>
```

---

### 📋 Leads Endpoints

#### Get All Leads (with filters + pagination)
```http
GET /api/leads?page=1&limit=10&status=Qualified&source=Instagram&search=john&sort=latest
Authorization: Bearer <token>
```

**Query Parameters:**

| Param    | Type   | Values                                       |
|----------|--------|----------------------------------------------|
| `page`   | number | Default: 1                                   |
| `limit`  | number | Default: 10, Max: 100                        |
| `status` | string | `New` \| `Contacted` \| `Qualified` \| `Lost`|
| `source` | string | `Website` \| `Instagram` \| `Referral`       |
| `search` | string | Searches name AND email                      |
| `sort`   | string | `latest` (default) \| `oldest`              |

**Response:**
```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": [...],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

#### Get Single Lead
```http
GET /api/leads/:id
Authorization: Bearer <token>
```

---

#### Create Lead
```http
POST /api/leads
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "status": "New",       // optional, default: New
  "source": "Instagram"  // required
}
```

---

#### Update Lead
```http
PUT /api/leads/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Qualified"
}
```

---

#### Delete Lead (Admin only)
```http
DELETE /api/leads/:id
Authorization: Bearer <token>   // must be Admin
```

---

#### Export CSV (Admin only)
```http
GET /api/leads/export/csv?status=Qualified&source=Instagram
Authorization: Bearer <token>   // must be Admin
```

Returns a downloadable `.csv` file. Supports same filters as GET /api/leads.

---

#### Get Stats (Admin only)
```http
GET /api/leads/stats
Authorization: Bearer <token>   // must be Admin
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 45,
    "byStatus": {
      "New": 12,
      "Contacted": 8,
      "Qualified": 20,
      "Lost": 5
    }
  }
}
```

---

## Role-Based Access Control

| Endpoint             | Admin | Sales User        |
|----------------------|-------|-------------------|
| GET /leads           | All   | Own leads only    |
| GET /leads/:id       | Any   | Own lead only     |
| POST /leads          | ✅    | ✅                |
| PUT /leads/:id       | Any   | Own lead only     |
| DELETE /leads/:id    | ✅    | ❌                |
| GET /leads/export    | ✅    | ❌                |
| GET /leads/stats     | ✅    | ❌                |

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": [                     // only for validation errors
    { "field": "email", "message": "Please enter a valid email" }
  ]
}
```

| Status | Meaning                    |
|--------|----------------------------|
| 400    | Validation / Bad Request   |
| 401    | Unauthorized (no/bad token)|
| 403    | Forbidden (wrong role)     |
| 404    | Resource not found         |
| 409    | Conflict (duplicate)       |
| 500    | Internal Server Error      |

---

## Environment Variables

| Variable          | Required | Description                        |
|-------------------|----------|------------------------------------|
| `PORT`            | No       | Default: 5000                      |
| `NODE_ENV`        | No       | `development` \| `production`      |
| `MONGO_URI`       | ✅       | MongoDB connection string          |
| `JWT_SECRET`      | ✅       | Secret key for JWT signing         |
| `JWT_EXPIRES_IN`  | No       | Default: `7d`                      |
| `ALLOWED_ORIGINS` | No       | Comma-separated CORS origins       |

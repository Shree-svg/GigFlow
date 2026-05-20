# Smart Leads — API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require the header:
```
Authorization: Bearer <token>
```

---

## Auth

### POST /auth/register
Register a new user.

**Body**
```json
{
  "name": "Shreedhar Sharma",
  "email": "shreedhar@example.com",
  "password": "secret123",
  "role": "Admin"          // optional — "Admin" | "Sales User" (default: "Sales User")
}
```

**Response 201**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "<jwt>",
    "user": { "_id": "...", "name": "Shreedhar Sharma", "email": "...", "role": "Admin" }
  }
}
```

**Errors** — `409` email already exists · `400` validation errors

---

### POST /auth/login
Login and receive a JWT.

**Body**
```json
{ "email": "shreedhar@example.com", "password": "secret123" }
```

**Response 200**
```json
{
  "success": true,
  "message": "Login successful",
  "data": { "token": "<jwt>", "user": { ... } }
}
```

**Errors** — `401` invalid credentials · `400` validation errors

---

### GET /auth/me
Get the currently authenticated user.

**Response 200**
```json
{
  "success": true,
  "data": { "_id": "...", "name": "...", "email": "...", "role": "...", "createdAt": "..." }
}
```

---

## Leads

### GET /leads
List leads with filtering, search, sorting, and pagination.

**Query params** — all optional

| Param    | Type                                            | Default  |
|----------|-------------------------------------------------|----------|
| `page`   | integer ≥ 1                                     | 1        |
| `limit`  | integer 1–100                                   | 10       |
| `status` | `New` \| `Contacted` \| `Qualified` \| `Lost`   | —        |
| `source` | `Website` \| `Instagram` \| `Referral`          | —        |
| `search` | string (matches name or email, case-insensitive)| —        |
| `sort`   | `latest` \| `oldest`                            | `latest` |

> Sales Users only see leads they created. Admins see all.

**Response 200**
```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": [ { "_id": "...", "name": "...", "email": "...", "status": "New", "source": "Website", "createdBy": { ... }, "createdAt": "..." } ],
  "pagination": {
    "total": 47,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### GET /leads/stats
Aggregated lead counts by status.

> Sales Users only see stats for their own leads.

**Response 200**
```json
{
  "success": true,
  "data": {
    "total": 47,
    "byStatus": { "New": 12, "Contacted": 18, "Qualified": 10, "Lost": 7 }
  }
}
```

---

### GET /leads/export/csv
Export leads as a CSV file. Accepts the same filter params as `GET /leads` (except `page`/`limit`).

> **Admin only.**

**Response 200** — `Content-Type: text/csv`, file download triggered.

CSV columns: `Name, Email, Status, Source, Created By, Created At`

---

### GET /leads/:id
Fetch a single lead by ID.

> Sales Users can only view their own leads.

**Response 200**
```json
{ "success": true, "data": { "_id": "...", "name": "...", ... } }
```

**Errors** — `404` not found · `403` access denied

---

### POST /leads
Create a new lead.

**Body**
```json
{
  "name": "Rahul Verma",
  "email": "rahul@example.com",
  "source": "Instagram",
  "status": "New"        // optional — defaults to "New"
}
```

**Response 201**
```json
{ "success": true, "message": "Lead created successfully", "data": { ... } }
```

**Errors** — `400` validation errors

---

### PUT /leads/:id
Update a lead. All fields are optional.

**Body** (partial)
```json
{ "status": "Qualified", "source": "Referral" }
```

> Sales Users can only update their own leads.

**Response 200**
```json
{ "success": true, "message": "Lead updated successfully", "data": { ... } }
```

**Errors** — `404` not found · `403` access denied · `400` validation errors

---

### DELETE /leads/:id
Delete a lead permanently.

> **Admin only.**

**Response 200**
```json
{ "success": true, "message": "Lead deleted successfully", "data": { "id": "..." } }
```

**Errors** — `404` not found · `403` access denied

---

## Error response format

All errors follow this shape:

```json
{
  "success": false,
  "message": "Human-readable description",
  "errors": [                         // present on validation failures only
    { "field": "email", "message": "Please enter a valid email" }
  ]
}
```

## Role permissions summary

| Action              | Admin | Sales User       |
|---------------------|-------|------------------|
| Register / Login    | ✓     | ✓                |
| View own leads      | ✓     | ✓                |
| View all leads      | ✓     | ✗                |
| Create lead         | ✓     | ✓                |
| Update own lead     | ✓     | ✓                |
| Update any lead     | ✓     | ✗                |
| Delete lead         | ✓     | ✗                |
| Export CSV          | ✓     | ✗                |
| View stats          | ✓ (all) | ✓ (own only) |

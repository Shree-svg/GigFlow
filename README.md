# Smart Leads Dashboard

A full-stack lead management platform with AI-powered insights, role-based access control, and real-time analytics. Built with React, Express, and MongoDB.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-22c55e?style=flat-square&logo=render)](https://smart-leads-web.onrender.com/dashboard) &nbsp;[![API](https://img.shields.io/badge/API-Backend-3b82f6?style=flat-square&logo=render)](https://smart-leads-api-50yq.onrender.com) &nbsp;[![GitHub](https://img.shields.io/badge/Source-GitHub-181717?style=flat-square&logo=github)](https://github.com/Shree-svg/Smart-Leads) &nbsp;[![License](https://img.shields.io/badge/License-ISC-f59e0b?style=flat-square)](https://opensource.org/licenses/ISC)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Smart Leads Dashboard is a modern web application designed to streamline lead tracking and management workflows. It provides a clean, responsive interface for sales and operations teams, backed by a secure REST API with JWT authentication and granular role-based permissions.

---

## Features

| Feature | Description |
|---|---|
| **Lead Management** | Full CRUD operations on lead records |
| **Authentication** | JWT-based login with bcrypt password hashing |
| **Role-Based Access** | Admin and User roles with distinct permission sets |
| **CSV Export** | One-click export of lead data for offline analysis |
| **Analytics Dashboard** | Real-time statistics and lead pipeline insights |
| **Theme Support** | Cyberpunk dark mode and Cream/Emerald light mode |
| **Responsive UI** | Optimized layout across desktop, tablet, and mobile |

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 18 | UI library with functional components and hooks |
| TypeScript | Type-safe development |
| TailwindCSS | Utility-first styling framework |
| Framer Motion | Animations and transitions |
| Axios | HTTP client |
| Vite | Build tool and dev server |

### Backend

| Technology | Purpose |
|---|---|
| Express.js | Node.js web framework |
| TypeScript | Type-safe server-side code |
| MongoDB + Mongoose | NoSQL database with ODM |
| JSON Web Tokens | Stateless authentication |
| bcryptjs | Secure password hashing |

### Infrastructure

| Technology | Purpose |
|---|---|
| Docker + Docker Compose | Containerized local development |
| Render | Cloud hosting (frontend + backend) |
| MongoDB Atlas | Managed cloud database |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB (local instance or [Atlas](https://www.mongodb.com/atlas) connection string)

---

### Option A — Local Development

**1. Clone the repository**

```bash
git clone https://github.com/Shree-svg/Smart-Leads.git
cd Smart-Leads
```

**2. Configure and start the backend**

```bash
cd server
cp .env.example .env      # Edit MONGO_URI and JWT_SECRET
npm install
npm run dev               # Starts at http://localhost:5000
```

**3. Configure and start the frontend**

```bash
cd client
cp .env.example .env      # Set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev               # Starts at http://localhost:5173
```

---

### Option B — Docker Compose

```bash
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| MongoDB | localhost:27017 |

---

## Project Structure

```
Smart-Leads/
├── client/                   # React frontend
│   └── src/
│       ├── components/       # Reusable UI components
│       ├── pages/            # Route-level page components
│       └── App.tsx           # Application root
├── server/                   # Express backend
│   └── src/
│       ├── models/           # Mongoose schemas
│       ├── routes/           # API route definitions
│       ├── controllers/      # Business logic handlers
│       └── index.ts          # Server entry point
├── docs/
│   └── API.md                # Full API reference
├── DEPLOYMENT.md             # Deployment guide
├── docker-compose.yml
└── README.md
```

---

## Environment Variables

### Backend — `server/.env`

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend — `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Building for Production

### Backend

```bash
cd server
npm run build    # Compiles TypeScript → JavaScript
npm run start    # Runs compiled output
```

### Frontend

```bash
cd client
npm run build    # Creates optimized production bundle
npm run preview  # Preview the production build locally
```

---

## Deployment

The application is hosted on [Render](https://render.com).

| Service | URL |
|---|---|
| Frontend | https://smart-leads-web.onrender.com/dashboard |
| Backend API | https://smart-leads-api-50yq.onrender.com |

> **Note:** Free-tier services on Render may take 30–60 seconds to wake up after a period of inactivity.

For full deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## API Reference

Full endpoint documentation is available in [docs/API.md](./docs/API.md).

### Core Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Authenticate and receive a JWT | No |
| `GET` | `/api/leads` | Retrieve all leads | Yes |
| `POST` | `/api/leads` | Create a new lead | Yes |
| `PUT` | `/api/leads/:id` | Update an existing lead | Yes |
| `DELETE` | `/api/leads/:id` | Delete a lead | Admin only |

---

## Troubleshooting

**Network error on login**
- Verify `VITE_API_URL` in your frontend `.env` points to the correct backend address.
- Confirm `ALLOWED_ORIGINS` in the backend `.env` includes your frontend domain.
- Check the browser DevTools Network tab for detailed error messages.

**Render cold start delays**
- Free-tier services spin down after inactivity. The first request may take up to 60 seconds. Subsequent requests will be fast.

---

## Contributing

Contributions are welcome. To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to your branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please open an [issue](https://github.com/Shree-svg/Smart-Leads/issues) first if you're planning a significant change.

---

## License

Licensed under the [ISC License](./LICENSE).

---

<p align="center">Built by <a href="https://github.com/Shree-svg">Shreedhar</a></p>
# GigFlow

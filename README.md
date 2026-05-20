# LeadStream AI — Smart Leads Dashboard

Full-stack MERN app with Cyberpunk dark mode + Cream/Emerald light mode.

## Quick Start (Local Dev)

### 1. Backend
```bash
cd server
cp .env.example .env     # Edit MONGO_URI and JWT_SECRET
npm install
npm run dev              # Starts at http://localhost:5000
```

### 2. Frontend
```bash
cd client
cp .env.example .env     # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev              # Starts at http://localhost:5173
```

## Quick Start (Docker)
```bash
docker-compose up --build
# Frontend: http://localhost:5173
# Backend:  http://localhost:5000
# MongoDB:  localhost:27017
```

## Default Test Accounts
Register via /login → Request Access.
Set role to Admin for full access (delete, CSV export, stats).

## Tech Stack
- **Frontend**: React 18 + TypeScript + TailwindCSS + Framer Motion
- **Backend**: Express + TypeScript + MongoDB/Mongoose
- **Auth**: JWT + bcrypt
- **Design**: Stitch AI Lumina Nexus design system

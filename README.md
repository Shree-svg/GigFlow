# 🌌 LeadStream AI — Lumina Nexus CRM Terminal

LeadStream AI is a state-of-the-art, high-fidelity CRM and automated outreach terminal built with a premium **cyberpunk dark-mode aesthetic** and a clean **emerald-cream light-mode switch**. Powered by the bespoke *Stitch AI Lumina Nexus* design guidelines, the dashboard delivers tactile micro-interactions, smooth bezier vector charts, live SVG sparklines, and a cognitive AI copy critique optimizer.

---

## 🔐 Role-Based Access Control (RBAC) Specification

The system implements a rigorous role-based routing architecture on both the backend database layers (Mongoose schemas + custom Express middlewares) and client layouts. 

### 📊 Permission & Capability Matrix

| Feature / Permission | 👑 Admin Login | 💼 Sales User Login | Implementation Layer |
| :--- | :---: | :---: | :--- |
| **Outbox Scope** | **Global** (All Sales Users) | **Assigned Leads Only** | Mongoose Filter Query Injection |
| **Lead Creation** | ✅ Yes | ✅ Yes | Controller standard entity save |
| **Lead Upgrades & Edit** | ✅ Yes | ✅ Yes (Own leads only) | Ownership validation middleware |
| **Lead Deletion** | ✅ Yes | ❌ Access Denied | `adminOnly` Route protection |
| **CSV Intel Export** | ✅ Yes | ❌ Access Denied | `adminOnly` Route protection |
| **Dashboard Analytics** | ✅ Global Enterprise Stats | ⚠️ Limited (Personal stats) | Pipeline aggregation filters |
| **Campaigns Console** | ✅ Fully Interactive | ✅ Fully Interactive | State management pipeline |

---

## 🛠️ Security & Middlewares Blueprint

Authentication and authorization are verified using stateless **JSON Web Tokens (JWT)**:
1. **JWT Payload Structure**: Includes the user's Mongoose `userId` and explicit `role` values (`Admin` or `Sales User`).
2. **Access Control Stack**:
   * **`protect` Middleware**: Decodes the JWT, validates the active session, retrieves public user fields, and attaches them to `req.user`.
   * **`authorize(...roles)` Middleware**: Standard role filter returning `403 Forbidden` if the authenticated user's role does not match permissions.
   * **`adminOnly` Middleware**: Shorthand wrapper restricting operations exclusively to `Admin` (`UserRole.ADMIN`).

```typescript
// Route Configuration Example (/server/src/routes/leads.ts)
router.use(protect); // Enforce Authentication globally

router.get('/export/csv', adminOnly, exportLeadsCSV); // Restricted to Admins
router.delete('/:id', adminOnly, deleteLead);          // Restricted to Admins
router.get('/:id', getLeadById);                       // Custom ownership check inside controller
```

---

## 🚀 Architectural Stack & Technologies

* **Frontend Engine**: React 18 + TypeScript + Vite + TailwindCSS + Framer Motion
* **Vector Graphics Core**: Native SVG paths (bezier coordinate lines, live campaign sparklines, dynamic acquisition arcs)
* **Backend Framework**: Node.js + Express + TypeScript + Mongoose (MongoDB ODM)
* **Authentication**: Stateless JWT + bcrypt password salting (12 rounds)
* **Environment Systems**: Multi-tier Docker Compose containerization

---

## ⚡ Quick Start & Deployment Guide

### 🧬 Method A: Unified Docker Containerization
Start the entire infrastructure (Frontend, Backend, and MongoDB Database) with a single command:
```bash
docker-compose up --build
```
* **Frontend Portal**: `http://localhost:5173`
* **API Service Gateway**: `http://localhost:5000`
* **Local Mongo Cluster**: `localhost:27017`

---

### 🧪 Method B: Standalone Local Setup

#### 📦 1. Database & Server Gateway
1. Navigate into `/server`:
   ```bash
   cd server
   ```
2. Replicate the environment config:
   ```bash
   cp .env.example .env
   ```
3. Run the dependency installation and developer seed loop:
   ```bash
   npm install
   npm run dev
   ```

#### 🌐 2. Client Single-Page App (SPA)
1. Navigate into `/client`:
   ```bash
   cd client
   ```
2. Configure host settings:
   ```bash
   cp .env.example .env
   ```
3. Install nodes and boot the Vite server:
   ```bash
   npm install
   npm run dev
   ```

---

## 🔑 Default Test Accounts & Access Codes

To bypass manual database configuration, the system seeds dedicated test credentials for review:

* **👑 Enterprise Administrator**:
  * **Email**: `admin@smartleads.com`
  * **Password**: `Password123`
* **💼 Local Sales Rep**:
  * **Email**: `sales@smartleads.com`
  * **Password**: `Password123`

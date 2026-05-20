# Smart Leads - Deployment Guide

This guide covers deploying the Smart Leads application on **Render** and **Vercel**.

## Problem & Solution

### Network Error During Login

If you experience a **network error when logging in** after deployment, it's typically caused by:

1. **API timeout too short** ✅ FIXED: Updated to 30 seconds
2. **Environment variables not properly configured** ✅ See setup instructions below
3. **CORS issues** ✅ Configure ALLOWED_ORIGINS correctly
4. **Backend cold start delays** ✅ Retry logic automatically handles this

---

## Option 1: Render Deployment (Recommended for Full-Stack)

### Setup Instructions

#### 1. Create Render Services

Go to [render.com](https://render.com) and create two services:

**Backend Service:**
- **Name:** `smart-leads-api`
- **Runtime:** Node
- **Build Command:** `cd server && npm install && npm run build`
- **Start Command:** `cd server && npm start`
- **Plan:** Free tier is fine (may experience cold starts)

**Frontend Service:**
- **Name:** `smart-leads-web`
- **Runtime:** Docker
- **Dockerfile Path:** `./client/Dockerfile`

#### 2. Environment Variables for Backend

Set these in Render's environment variables:

```
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-leads
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=https://smart-leads-web.onrender.com
```

#### 3. Environment Variables for Frontend

Set this in Render's environment variables:

```
VITE_API_URL=https://smart-leads-api.onrender.com/api
```

#### 4. Alternative: Use render.yaml

This repository includes `render.yaml` for automated deployment:

```bash
git push origin main  # Push your code to GitHub
# Then deploy via Render dashboard using the render.yaml file
```

---

## Option 2: Vercel Deployment (Frontend Only)

**Note:** Vercel is designed for frontend deployment. For a complete solution, deploy the **backend separately** (e.g., on Render, Railway, or similar).

### Setup Instructions

#### 1. Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Select the root directory (not `/client`)

#### 2. Configure Environment Variables

In Vercel project settings, add:

```
VITE_API_URL=https://your-backend-api.com/api
```

**Examples:**
- **Render backend:** `https://smart-leads-api.onrender.com/api`
- **Railway backend:** `https://your-railway-app.up.railway.app/api`
- **Local testing:** `http://localhost:5000/api`

#### 3. Deploy

```bash
git push origin main  # Vercel auto-deploys
```

---

## Option 3: Docker Compose (Local Development)

For local development with full-stack:

```bash
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- MongoDB: localhost:27017

---

## Deployment Architecture

### Full Stack (Render + Render)

```
┌─────────────────────────────────────────────┐
│  Render: smart-leads-web (Frontend)          │
│  https://smart-leads-web.onrender.com       │
└────────────────────┬────────────────────────┘
                     │ API Requests
                     │ VITE_API_URL=https://smart-leads-api.onrender.com/api
                     ▼
┌─────────────────────────────────────────────┐
│  Render: smart-leads-api (Backend)           │
│  https://smart-leads-api.onrender.com/api   │
│  ALLOWED_ORIGINS=https://smart-leads-web.onrender.com
└─────────────────────────────────────────────┘
                     │
                     ▼
           MongoDB Atlas or Local
```

### Hybrid (Vercel + Render)

```
┌─────────────────────────────────────────────┐
│  Vercel: smart-leads (Frontend)              │
│  https://smart-leads.vercel.app             │
└────────────────────┬────────────────────────┘
                     │ API Requests
                     │ VITE_API_URL=https://smart-leads-api.onrender.com/api
                     ▼
┌─────────────────────────────────────────────┐
│  Render: smart-leads-api (Backend)           │
│  https://smart-leads-api.onrender.com/api   │
│  ALLOWED_ORIGINS=https://smart-leads.vercel.app
└─────────────────────────────────────────────┘
                     │
                     ▼
           MongoDB Atlas or Local
```

---

## Environment Variable Reference

### Client (.env)

```bash
# Local Development
VITE_API_URL=http://localhost:5000/api

# Render Production
VITE_API_URL=https://smart-leads-api.onrender.com/api

# Vercel Production
VITE_API_URL=https://your-backend-domain.com/api
```

**⚠️ IMPORTANT:** These must be set **before build time** (not runtime), as Vite embeds them in static files.

### Server (.env)

```bash
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-leads

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# CORS - Comma-separated list of allowed frontend domains
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://smart-leads-web.onrender.com,https://smart-leads.vercel.app

# Environment
NODE_ENV=production
PORT=5000
```

---

## Troubleshooting

### "Network Error" When Logging In

**Cause:** Backend API unreachable or slow to respond

**Solutions:**
1. Verify `VITE_API_URL` is correctly set in frontend environment
2. Check backend is running and accessible at the configured URL
3. Verify CORS allows your frontend domain (check `ALLOWED_ORIGINS`)
4. Wait 30-60 seconds for cold start (free tier services take time to wake up)
5. Check network tab in browser dev tools for detailed error

### CORS Error

**Cause:** Backend doesn't allow your frontend domain

**Solution:** Update backend's `ALLOWED_ORIGINS`:
```bash
# For Render, in render.yaml or Render dashboard:
ALLOWED_ORIGINS=https://smart-leads-web.onrender.com,https://smart-leads.vercel.app

# For local dev:
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Cold Start Delays

**Cause:** Free tier services take 30-60 seconds to wake up

**Solution:** This is normal! The updated timeout (30s) and retry logic handle this automatically.

---

## Testing Deployment

### Check Backend Health

```bash
curl https://your-backend-domain.com/health
# Should return: {"success":true,"message":"🚀 Smart Leads API is running",...}
```

### Check Frontend Connectivity

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try logging in
4. Check if API requests complete or timeout

---

## Security Recommendations

1. **Never commit `.env` files** - Use platform's environment variable settings
2. **Use strong JWT_SECRET** - Generate with: `openssl rand -base64 32`
3. **Update JWT_EXPIRES_IN** - Consider shorter expiry for production (e.g., `1h`)
4. **Enable HTTPS** - Both platforms provide free HTTPS (enabled by default)
5. **Use MongoDB Atlas** - Add IP whitelisting if possible

---

## Performance Tips

1. **Render Free Tier:** Services sleep after 15 minutes of inactivity. First request wakes them up (takes 30-60s).
2. **Vercel:** Optimized for static sites. Dynamic routes work but serve from edge network.
3. **Database:** Use MongoDB Atlas (cloud) for reliable production database.
4. **API Timeout:** Set to 30 seconds minimum for reliable performance.

---

## Next Steps

1. Choose deployment platform (Render recommended for full-stack)
2. Set up backend first (if not already done)
3. Configure environment variables
4. Deploy frontend
5. Test login flow
6. Monitor cold starts and adjust timeout if needed

For questions, refer to official docs:
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas](https://docs.atlas.mongodb.com)

# Deploying to Render

This guide outlines how to deploy the **LeadStream AI** application (MERN stack) on Render.

The project is structured as a monorepo with separate `client/` and `server/` directories. You should deploy them as two separate services:
1. **Backend API**: Deployed as a **Render Web Service**.
2. **Frontend Dashboard**: Deployed as a **Render Static Site**.

---

## 1. Backend Deployment (Render Web Service)

### Setup Steps:
1. Log in to the [Render Dashboard](https://dashboard.render.com/) and click **New > Web Service**.
2. Connect your Git repository.
3. Configure the service with the following settings:
   - **Name**: `gigflow-backend` (or your preferred name)
   - **Language**: `Node`
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Choose your Instance Type (the Free tier is sufficient).

### Environment Variables:
Click **Advanced** and add the following Environment Variables:
- `MONGO_URI`: Your MongoDB connection string (e.g., `mongodb+srv://...`)
- `JWT_SECRET`: A secure random string for signing JWT tokens.
- `NODE_ENV`: `production`
- `ALLOWED_ORIGINS`: The URL of your deployed frontend (e.g., `https://gigflow-client.onrender.com`). *Note: You can update this after deploying the frontend.*

---

## 2. Frontend Deployment (Render Static Site)

### Setup Steps:
1. In the Render Dashboard, click **New > Static Site**.
2. Connect your Git repository.
3. Configure the site with the following settings:
   - **Name**: `gigflow-client` (or your preferred name)
   - **Language**: `HTML/CSS/JS`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist` (Render will resolve this relative to the root directory `client/dist`)

### Environment Variables:
Click **Advanced** and add the following Environment Variable:
- `VITE_API_URL`: The URL of your deployed backend service with `/api` appended (e.g., `https://gigflow-backend.onrender.com/api`).

---

## 3. Database Seeding (Optional)

If you want to seed the database with initial admin and sales accounts, you can run the seed script locally after configuring your `.env` file in the `server` directory:
```bash
cd server
npm run build
# Ensure MONGO_URI is set in server/.env
node dist/seed.js
```

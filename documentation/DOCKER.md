# Docker Setup Documentation

This repository comes with a full Docker and Docker Compose configuration to spin up the entire application stack seamlessly without manually installing Node.js, MongoDB, or other dependencies.

## Architecture

The `docker-compose.yml` file defines a unified stack with three primary services:
1. **mongo:** The MongoDB v7 container serving as the primary database.
2. **server:** The Express.js backend API built from `server/Dockerfile`.
3. **client:** The Vite + React frontend built from `client/Dockerfile`.

All containers communicate over an isolated bridge network named `smart-leads-network`.

## Prerequisites
- **Docker** and **Docker Compose** must be installed on your machine.

## Running the Application

### 1. Build and Start the Containers
Navigate to the root directory of the repository where the `docker-compose.yml` file is located and run:

```bash
docker-compose up -d --build
```
*   The `--build` flag forces Docker to build the images using the latest code.
*   The `-d` flag runs the containers in detached mode (in the background).

### 2. Access the Application
Once the containers are running, you can access the services at the following local URLs:
*   **Frontend (React App):** [http://localhost:5173](http://localhost:5173)
*   **Backend API:** [http://localhost:5000](http://localhost:5000)

### 3. Viewing Logs
If you need to view logs to debug or check server status, run:

```bash
# View all logs
docker-compose logs -f

# View logs for a specific service (e.g., server)
docker-compose logs -f server
```

### 4. Stopping the Containers
To stop the containers and remove the networks, run:
```bash
docker-compose down
```

## Volumes & Data Persistence
The `docker-compose.yml` mounts a named volume (`mongo_data:/data/db`) for the MongoDB container. This ensures that your leads and user data persist even if you stop or remove the database container.

## Environment Variables
Environment variables for the containers are configured directly within the `docker-compose.yml` file using standard fallback values (e.g., `${JWT_SECRET:-change_this_secret_in_production}`). If you need to override these variables, you can create a `.env` file at the root of the project, which `docker-compose` will automatically read.

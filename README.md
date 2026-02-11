# 💡 Idea Voting Platform

A full-stack Idea Voting Platform where users can submit ideas and vote on them in real time.  
The application supports live updates using WebSockets, search functionality, and is fully Dockerized.

---

## 🚀 Features

- Submit new ideas
- Upvote / downvote ideas
- Real-time updates across all connected clients (WebSockets)
- Search ideas by title or description
- Optimistic UI updates
- Fully Dockerized (Frontend, Backend, PostgreSQL)
- REST API documented with Swagger (OpenAPI 3)

---

## 🛠 Tech Stack

### Frontend
- Angular (Standalone Components) v20+
- RxJS
- Socket.IO Client
- Bootstrap / CSS

### Backend
- Node.js (ES Modules)
- Express.js
- PostgreSQL
- Socket.IO
- Swagger UI

### Infrastructure
- Docker
- Docker Compose

---

## 📦 Prerequisites

Make sure you have the following installed:

| Tool | Version |
|----|----|
| Node.js | v22+ |
| npm | v9+ |
| Docker | v24+ |
| Docker Compose | v2+ |

---

## 📂 Project Structure

```text
idea-voting-platform/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── ideas.controller.js
│   │   ├── routes/
│   │   │   └── ideas.routes.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── socket.js
│   │   ├── db.js
│   │   ├── app.js
│   │   └── server.js
│   ├── openapi.yaml
│   ├── package.json
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── core/
│   │       │   ├── services/
│   │       │   │   ├── ideas.service.ts
│   │       │   │   └── socket.service.ts
│   │       │   └── models/
│   │       │       └── idea.model.ts
│   │       ├── features/
│   │       │   └── ideas/
│   │       │       └── pages/
│   │       │           └── ideas-page/
│   │       │               ├── ideas-page.ts
│   │       │               ├── ideas-page.html
│   │       │               └── ideas-page.spec.ts
│   ├── angular.json
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
└── README.md
```
---

## ⚙️ Environment Variables

    Create a `.env` file in the root directory (based on `.env.example`):

    POSTGRES_DB=ideas_db
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgres
    POSTGRES_PORT=5432
    BACKEND_PORT=3000
---
## 🚀 Setup & Running the Application

### 1️⃣ Clone the Repository

    git clone https://github.com/hadikoubaissi22/idea-voting-platform.git
    cd idea-voting-platform

### 2️⃣ Install Dependencies
    Backend
        cd backend
        npm install
    Fronted
        cd frontend
        npm install

### 3️⃣ Database Setup
    PostgreSQL runs automatically via Docker Compose
    Database tables are initialized by the backend on startup
    No manual SQL setup is required

### 4️⃣ Run the Application
    docker compose up --build

### 5️⃣ Run Without Docker
    Backend
        cd backend
        npm run dev
    Frontend
        cd frontend
        ng serve
---
## 🌐 Application Ports
    Service	        URL

    Frontend	    http://localhost:4200

    Backend API	    http://localhost:3000

    Swagger Docs    http://localhost:3000/api/docs

    PostgreSQL	    localhost:5432
---
## 🧠 Design Decisions & Trade-offs

    Angular Standalone Components were used to reduce boilerplate and improve maintainability.

    Socket.IO enables real-time voting updates instead of polling for better performance.

    Optimistic UI updates improve responsiveness while server-side validation ensures data consistency.

    Docker Compose simplifies setup and guarantees consistent environments across machines.

    Authentication was kept minimal to focus on the core assignment requirements.
---
## ⭐ Bonus Features Implemented

    ✅ Real-time updates using WebSockets
    ✅ Search functionality (title & description)
    ✅ Optimistic voting UI
    ✅ Fully Dockerized frontend, backend, and database

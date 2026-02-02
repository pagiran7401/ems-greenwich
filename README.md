# EMS Greenwich - Event Management System

A full-stack MERN application for managing events, built as part of an MSc Data Science dissertation project at the University of Greenwich.

## 🚀 Tech Stack

- **Frontend:** React 18 + TypeScript + Tailwind CSS + Vite
- **Backend:** Node.js + Express + TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Zod (shared between client and server)
- **State Management:** React Context + TanStack Query

## 📁 Project Structure

```
ems_greenwich/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   └── ...
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   └── ...
├── shared/                 # Shared types and validation
│   ├── types/              # TypeScript interfaces
│   └── validation/         # Zod schemas
├── docker/                 # Docker configuration
└── docker-compose.yml      # Docker Compose configuration
```

## 🛠️ Prerequisites

- Node.js 20+
- Docker and Docker Compose
- npm or yarn

## 🚦 Quick Start

### 1. Clone and Setup

```bash
cd ~/Projects/ems_greenwich

# Copy environment file
cp .env.example .env
```

### 2. Start with Docker (Recommended)

```bash
# Start all services (MongoDB, Server, Client)
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

### 3. Start without Docker (Local Development)

```bash
# Install dependencies
npm install

# Start MongoDB separately (required)
# Then start development servers
npm run dev
```

## 🌐 Access Points

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api |
| Health Check | http://localhost:5000/api/health |
| MongoDB | localhost:27017 |

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | API health status |
| GET | `/api/health/db` | Database connection status |

## 🔐 Environment Variables

See `.env.example` for all available configuration options.

Key variables:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRES_IN` - Token expiration time (default: 30m)

## 🧪 Testing the Auth Flow

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "confirmPassword": "Password123",
    "userType": "attendee",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'

# Access protected route (replace YOUR_TOKEN)
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📅 Development Timeline

| Phase | Duration | Focus |
|-------|----------|-------|
| Foundation | Week 1-2 | Auth, Database, Basic UI |
| Events | Week 3-4 | Event CRUD, Tickets |
| Booking | Week 5-6 | Search, Booking, Payments |
| Management | Week 7-8 | Check-in, Analytics |
| Polish | Week 9-10 | Testing, Documentation |
| Dissertation | Week 11-16 | Writing, Evaluation |

## 📝 Scripts

```bash
# Root level
npm run dev          # Start both client and server
npm run lint         # Run ESLint
npm run format       # Run Prettier

# Docker
npm run docker:up    # Start Docker services
npm run docker:down  # Stop Docker services
npm run docker:logs  # View Docker logs
```

## 📖 Dissertation Focus

This project demonstrates:
- Full-stack web application architecture
- RESTful API design patterns
- Authentication and authorization
- Database design and optimization
- Modern frontend development practices
- Container-based development workflow

## 📄 License

This project is created for academic purposes as part of an MSc dissertation.

---

**Author:** Abiskar Acharya
**Institution:** University of Greenwich
**Program:** MSc Data Science
**Year:** 2025

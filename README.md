# EVENTO - Event Management System

EVENTO is a full-stack event management platform built with the MERN stack and TypeScript. It provides a complete solution for organising, discovering, and booking events — from creation and ticket management through to attendee check-in on the day. Organisers can set up events with multiple ticket tiers (free or paid), track sales through a visual analytics dashboard, and manage attendees with check-in functionality. Attendees can browse and filter events by category, date, and price, book tickets with a streamlined checkout flow, and receive in-app notifications for booking confirmations and event updates. The entire application runs in Docker containers with a shared type system between frontend and backend, ensuring consistency across the stack.

## Why EVENTO?

- **Two-role system** — Organisers create and manage events; Attendees discover and book them. Each role gets a tailored dashboard experience.
- **Multi-tier ticketing** — Events support multiple ticket types (e.g. Early Bird, General, VIP) with independent pricing and quantity limits.
- **Advanced search & filtering** — Browse events with keyword search, category filters, date range presets, price range presets, and sortable results.
- **Analytics dashboard** — Organisers get bar charts (revenue by event), doughnut charts (ticket type distribution), and line charts (sales trends over 30 days), plus CSV exports.
- **Real-time notifications** — In-app notification bell with unread count badge, polling updates, and per-notification read tracking.
- **Shared validation** — Zod schemas defined once in a shared package and used by both the React frontend and Express backend, eliminating type drift.
- **Fully containerised** — Docker Compose spins up MongoDB, the Express API server, and the React dev server in one command.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, React Router 6, React Hook Form + Zod, TanStack Query, Chart.js |
| **Backend** | Node.js 20, Express, TypeScript, Mongoose, JWT (jsonwebtoken), bcryptjs, Helmet, CORS, express-rate-limit |
| **Database** | MongoDB 7.0 |
| **Shared** | TypeScript interfaces, Zod validation schemas |
| **DevOps** | Docker Compose, multi-container setup with health checks |

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed on your machine
- [Node.js 20+](https://nodejs.org/) (if running outside Docker)
- [Git](https://git-scm.com/)

### Quick Start (Docker)

1. **Clone the repository**

   ```bash
   git clone https://github.com/pagiran7401/ems-greenwich.git
   cd ems-greenwich
   ```

2. **Create your environment file**

   ```bash
   cp .env.example .env
   ```

   The defaults work out of the box for local development. Adjust `JWT_SECRET` for anything beyond local use.

3. **Start all services**

   ```bash
   docker compose up --build -d
   ```

   This starts three containers:
   - **MongoDB** on port `27017` (with automatic collection and index setup)
   - **Express API server** on port `5001`
   - **React dev server** on port `5173`

4. **Open the app**

   Visit [http://localhost:5173](http://localhost:5173) in your browser.

5. **Create an account**

   Register as an **Organiser** to create events, or as an **Attendee** to browse and book.

### Running Without Docker

If you prefer running services directly:

```bash
# Install dependencies (from the project root)
npm install

# Start MongoDB locally (must be running on port 27017)

# Start the backend
cd server && npm run dev

# Start the frontend (in a separate terminal)
cd client && npm run dev
```

## Project Structure

```
ems_greenwich/
├── client/          # React frontend (Vite + TypeScript + Tailwind)
├── server/          # Express backend (Node.js + TypeScript)
├── shared/          # Shared types, interfaces, and Zod validation schemas
├── docker/          # Dockerfiles and MongoDB init scripts
├── docker-compose.yml
└── .env.example     # Environment variable template
```

The monorepo uses npm workspaces so that the `shared` package can be imported by both `client` and `server`. TypeScript interfaces and Zod schemas are defined once and used everywhere.

## Features

| Feature | Description |
|---------|-------------|
| User Authentication | JWT-based registration, login, profile management, and password change |
| Event Management | Create, edit, publish, cancel, and delete events with draft workflow |
| Ticket Management | Multiple ticket types per event with pricing, quantities, and sold-out tracking |
| Booking & Payments | Free ticket auto-confirmation and paid ticket checkout (mock payment mode with Stripe-ready integration) |
| Search & Filtering | Keyword search, 8 category filters, date presets, price presets, multi-field sorting, pagination |
| Notifications | In-app notification bell with unread badge, booking confirmations, event update/cancellation alerts |
| Analytics Dashboard | Revenue charts, ticket distribution, sales trends, stat cards, and CSV data exports |
| Attendee Check-In | Organiser view of confirmed attendees with check-in toggle and CSV export |
| Profile Management | Edit personal details and change password with current-password verification |

## Getting Help

- **Issues** — Open an issue on the [GitHub Issues](https://github.com/pagiran7401/ems-greenwich/issues) page to report bugs or request features.
- **Discussions** — Use [GitHub Discussions](https://github.com/pagiran7401/ems-greenwich/discussions) for questions and general conversation about the project.

## Maintainer

This project is maintained by [@pagiran7401](https://github.com/pagiran7401).

## License

This project is provided as-is for educational and demonstration purposes.

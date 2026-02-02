# EMS Greenwich - Technical Documentation

**Project:** Event Management System (EMS)
**Author:** Abiskar Acharya
**Institution:** University of Greenwich
**Program:** MSc Data Science
**Type:** Dissertation Project
**Date:** January 2026

---

## Table of Contents

1. [Technology Stack](#1-technology-stack)
2. [Project Architecture](#2-project-architecture)
3. [Directory Structure](#3-directory-structure)
4. [Database Design](#4-database-design)
5. [API Endpoints](#5-api-endpoints)
6. [Frontend Pages](#6-frontend-pages)
7. [Page Navigation Flow](#7-page-navigation-flow)
8. [Authentication System](#8-authentication-system)
9. [Feature Implementation Details](#9-feature-implementation-details)
10. [Development Setup](#10-development-setup)

---

## 1. Technology Stack

### Frontend (Client)

| Technology | Version | Purpose |
|------------|---------|---------|
| **React.js** | 18.x | UI library for building component-based interfaces |
| **TypeScript** | 5.4 | Type-safe JavaScript for better developer experience |
| **Vite** | 5.x | Fast build tool and development server |
| **React Router** | 6.x | Client-side routing and navigation |
| **Tailwind CSS** | 3.4 | Utility-first CSS framework for styling |
| **Axios** | 1.6 | HTTP client for API requests |
| **React Hot Toast** | 2.4 | Toast notifications for user feedback |
| **Zod** | 3.22 | Schema validation (shared with server) |

### Backend (Server)

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.x | JavaScript runtime environment |
| **Express.js** | 4.18 | Web framework for building REST APIs |
| **TypeScript** | 5.4 | Type-safe JavaScript |
| **MongoDB** | 7.0 | NoSQL document database |
| **Mongoose** | 8.2 | MongoDB ODM (Object Document Mapper) |
| **JWT** | 9.0 | JSON Web Tokens for authentication |
| **bcryptjs** | 2.4 | Password hashing |
| **Stripe** | 14.14 | Payment processing (test mode) |
| **Helmet** | 7.1 | Security middleware |
| **CORS** | 2.8 | Cross-Origin Resource Sharing |
| **Morgan** | 1.10 | HTTP request logging |
| **Zod** | 3.22 | Request validation |

### Shared Package

| Technology | Purpose |
|------------|---------|
| **TypeScript** | Shared type definitions |
| **Zod** | Validation schemas used by both client and server |

### DevOps & Infrastructure

| Technology | Version | Purpose |
|------------|---------|---------|
| **Docker** | Latest | Containerization |
| **Docker Compose** | 3.8 | Multi-container orchestration |
| **npm Workspaces** | - | Monorepo package management |

### Design System

| Technology | Purpose |
|------------|---------|
| **Outfit Font** | Display headings (Google Fonts) |
| **DM Sans Font** | Body text (Google Fonts) |
| **Custom Tailwind Config** | Extended color palette, shadows, animations |

---

## 2. Project Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                          │
│                      http://localhost:5173                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Pages     │  │ Components  │  │    Services (API)       │ │
│  │  - Home     │  │  - Navbar   │  │  - auth.ts              │ │
│  │  - Events   │  │  - Layout   │  │  - events.ts            │ │
│  │  - Dashboard│  │  - Cards    │  │  - tickets.ts           │ │
│  │  - Bookings │  │  - Forms    │  │  - bookings.ts          │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP/HTTPS (Axios)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER (Express)                         │
│                      http://localhost:5001                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Routes    │  │ Controllers │  │      Middleware         │ │
│  │  - /auth    │  │  - auth     │  │  - authenticate         │ │
│  │  - /events  │  │  - events   │  │  - isOrganizer          │ │
│  │  - /tickets │  │  - tickets  │  │  - errorHandler         │ │
│  │  - /bookings│  │  - bookings │  │  - validation           │ │
│  │  - /analytics│ │  - analytics│  └─────────────────────────┘ │
│  └─────────────┘  └─────────────┘                               │
└────────────────────────────┬────────────────────────────────────┘
                             │ Mongoose ODM
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       MONGODB DATABASE                          │
│                      mongodb://localhost:27017                  │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐   │
│  │   Users   │  │  Events   │  │  Tickets  │  │ Bookings  │   │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Monorepo Structure

```
ems_greenwich/
├── client/          # React frontend application
├── server/          # Express backend API
├── shared/          # Shared types and validation
├── docker/          # Docker configuration files
└── docs/            # Documentation
```

---

## 3. Directory Structure

### Root Level

```
ems_greenwich/
├── package.json              # Root package.json with workspaces
├── docker-compose.yml        # Docker services configuration
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── .eslintrc.js              # ESLint configuration
├── .prettierrc               # Prettier configuration
├── tsconfig.base.json        # Base TypeScript config
│
├── client/                   # Frontend application
├── server/                   # Backend API
├── shared/                   # Shared code
├── docker/                   # Docker files
└── docs/                     # Documentation
```

### Client Structure

```
client/
├── index.html                # HTML entry point with Google Fonts
├── package.json              # Frontend dependencies
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind CSS customization
├── tsconfig.json             # TypeScript configuration
│
└── src/
    ├── main.tsx              # React entry point
    ├── App.tsx               # Root component with routing
    ├── index.css             # Global styles and Tailwind directives
    │
    ├── components/           # Reusable UI components
    │   ├── Navbar.tsx        # Navigation bar
    │   ├── Layout.tsx        # Page layout wrapper
    │   └── ProtectedRoute.tsx # Route guard component
    │
    ├── context/              # React Context providers
    │   └── AuthContext.tsx   # Authentication state management
    │
    ├── pages/                # Page components (14 total)
    │   ├── HomePage.tsx
    │   ├── LoginPage.tsx
    │   ├── RegisterPage.tsx
    │   ├── DashboardPage.tsx
    │   ├── BrowseEventsPage.tsx
    │   ├── EventDetailPage.tsx
    │   ├── CreateEventPage.tsx
    │   ├── EditEventPage.tsx
    │   ├── MyEventsPage.tsx
    │   ├── MyBookingsPage.tsx
    │   ├── BookingConfirmPage.tsx
    │   ├── ManageTicketsPage.tsx
    │   ├── AttendeesPage.tsx
    │   └── AnalyticsDashboardPage.tsx
    │
    └── services/             # API service modules
        ├── api.ts            # Axios instance configuration
        ├── auth.ts           # Authentication API calls
        ├── events.ts         # Events API calls
        ├── tickets.ts        # Tickets API calls
        ├── bookings.ts       # Bookings API calls
        └── analytics.ts      # Analytics API calls
```

### Server Structure

```
server/
├── package.json              # Backend dependencies
├── tsconfig.json             # TypeScript configuration
│
└── src/
    ├── index.ts              # Express app entry point
    │
    ├── config/
    │   └── database.ts       # MongoDB connection
    │
    ├── models/               # Mongoose schemas (4 models)
    │   ├── User.ts           # User model with password hashing
    │   ├── Event.ts          # Event model
    │   ├── Ticket.ts         # Ticket model
    │   └── Booking.ts        # Booking model
    │
    ├── routes/               # Express route definitions
    │   ├── health.ts         # Health check endpoint
    │   ├── auth.ts           # Authentication routes
    │   ├── events.ts         # Event CRUD routes
    │   ├── tickets.ts        # Ticket management routes
    │   ├── bookings.ts       # Booking and check-in routes
    │   └── analytics.ts      # Analytics routes
    │
    ├── controllers/          # Route handlers
    │   ├── authController.ts
    │   ├── eventController.ts
    │   ├── ticketController.ts
    │   ├── bookingController.ts
    │   └── analyticsController.ts
    │
    └── middleware/           # Express middleware
        ├── auth.ts           # JWT authentication
        ├── errorHandler.ts   # Global error handling
        └── validation.ts     # Zod validation middleware
```

### Shared Package Structure

```
shared/
├── package.json              # Shared package config
├── tsconfig.json             # TypeScript configuration
├── index.ts                  # Main exports
│
├── types/                    # TypeScript interfaces
│   ├── index.ts              # Types barrel export
│   ├── user.ts               # User-related types
│   ├── event.ts              # Event-related types
│   ├── ticket.ts             # Ticket-related types
│   ├── booking.ts            # Booking-related types
│   └── api.ts                # API response types
│
└── validation/               # Zod schemas
    ├── index.ts              # Validation barrel export
    ├── user.ts               # User validation schemas
    ├── event.ts              # Event validation schemas
    ├── ticket.ts             # Ticket validation schemas
    └── booking.ts            # Booking validation schemas
```

---

## 4. Database Design

### Collections Overview

| Collection | Purpose | Primary Key |
|------------|---------|-------------|
| users | Store user accounts | `_id` (ObjectId) |
| events | Store event information | `_id` (ObjectId) |
| tickets | Store ticket types for events | `_id` (ObjectId) |
| bookings | Store user bookings | `_id` (ObjectId) |

### Users Collection Schema

```javascript
{
  _id: ObjectId,              // Auto-generated unique ID
  email: String,              // Unique, lowercase, required
  password: String,           // Hashed with bcrypt (10 rounds)
  userType: String,           // Enum: 'organizer' | 'attendee'
  firstName: String,          // Required, max 50 chars
  lastName: String,           // Required, max 50 chars
  phone: String,              // Optional
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-updated
}

// Indexes:
// - email: unique index
// - userType: regular index
```

### Events Collection Schema

```javascript
{
  _id: ObjectId,              // Auto-generated unique ID
  organizerId: ObjectId,      // Reference to Users collection
  eventName: String,          // Required, max 200 chars
  description: String,        // Required, max 5000 chars
  eventDate: Date,            // Required, indexed
  eventTime: String,          // Required (e.g., "19:00")
  endTime: String,            // Optional
  venue: String,              // Required, max 200 chars
  address: String,            // Optional, max 500 chars
  category: String,           // Enum: music, sports, arts, business, food, health, tech, other
  eventImage: String,         // URL, optional
  capacity: Number,           // Required, 1-100,000
  status: String,             // Enum: draft, published, cancelled
  createdAt: Date,
  updatedAt: Date
}

// Indexes:
// - organizerId: regular index
// - eventDate: regular index
// - status + eventDate: compound index
// - category + status: compound index
// - eventName + description: text index (for search)
```

### Tickets Collection Schema

```javascript
{
  _id: ObjectId,
  eventId: ObjectId,          // Reference to Events collection
  ticketType: String,         // Required, max 100 chars (e.g., "VIP", "General")
  price: Number,              // Required, 0-10,000
  quantityAvailable: Number,  // Required, 1-100,000
  quantitySold: Number,       // Default: 0
  description: String,        // Optional, max 500 chars
  isActive: Boolean,          // Default: true
  createdAt: Date,
  updatedAt: Date
}

// Indexes:
// - eventId + isActive: compound index

// Virtual fields:
// - remainingQuantity: quantityAvailable - quantitySold
// - isSoldOut: quantitySold >= quantityAvailable
```

### Bookings Collection Schema

```javascript
{
  _id: ObjectId,
  attendeeId: ObjectId,       // Reference to Users collection
  eventId: ObjectId,          // Reference to Events collection
  ticketId: ObjectId,         // Reference to Tickets collection
  quantity: Number,           // 1-10 tickets per booking
  totalAmount: Number,        // Calculated: price × quantity
  bookingDate: Date,          // Default: now
  paymentStatus: String,      // Enum: pending, completed, failed, refunded
  checkInStatus: String,      // Enum: not_checked_in, checked_in
  transactionId: String,      // Stripe session ID or mock ID
  createdAt: Date,
  updatedAt: Date
}

// Indexes:
// - attendeeId + paymentStatus: compound index
// - eventId + paymentStatus: compound index
// - transactionId: sparse index
```

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   USERS     │       │   EVENTS    │       │   TICKETS   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ _id (PK)    │       │ _id (PK)    │       │ _id (PK)    │
│ email       │◄──────│ organizerId │       │ eventId (FK)│──────►│
│ password    │  1:N  │ eventName   │  1:N  │ ticketType  │       │
│ userType    │       │ description │◄──────│ price       │       │
│ firstName   │       │ eventDate   │       │ quantity    │       │
│ lastName    │       │ venue       │       └─────────────┘       │
└─────────────┘       │ category    │                             │
       │              │ status      │                             │
       │              └─────────────┘                             │
       │                                                          │
       │              ┌─────────────┐                             │
       │              │  BOOKINGS   │                             │
       │              ├─────────────┤                             │
       │    1:N       │ _id (PK)    │       1:N                   │
       └─────────────►│ attendeeId  │◄────────────────────────────┘
                      │ eventId (FK)│
                      │ ticketId(FK)│
                      │ quantity    │
                      │ totalAmount │
                      │ paymentStatus│
                      │ checkInStatus│
                      └─────────────┘
```

---

## 5. API Endpoints

### Base URL: `http://localhost:5001/api`

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/logout` | Logout user | No |
| GET | `/auth/me` | Get current user | Yes |

**Register Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "userType": "organizer",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+44123456789"
}
```

**Login Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Auth Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "email": "user@example.com",
    "userType": "organizer",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Event Endpoints

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/events` | List all events (with filters) | No | - |
| GET | `/events/:id` | Get single event | No | - |
| POST | `/events` | Create event | Yes | Organizer |
| PUT | `/events/:id` | Update event | Yes | Organizer (owner) |
| DELETE | `/events/:id` | Delete event | Yes | Organizer (owner) |
| GET | `/events/organizer/my-events` | Get organizer's events | Yes | Organizer |

**Filter Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `category` - Filter by category
- `search` - Search in name/description
- `dateFrom` - Filter from date
- `dateTo` - Filter to date
- `sortBy` - Sort field (date, name)
- `sortOrder` - Sort direction (asc, desc)

### Ticket Endpoints

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/tickets/event/:eventId` | Get event tickets | No | - |
| POST | `/tickets/event/:eventId` | Create ticket | Yes | Organizer (owner) |
| PUT | `/tickets/:ticketId` | Update ticket | Yes | Organizer (owner) |
| DELETE | `/tickets/:ticketId` | Delete ticket | Yes | Organizer (owner) |

### Booking Endpoints

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/bookings` | Create booking | Yes | Any |
| POST | `/bookings/:bookingId/confirm` | Confirm payment | Yes | Any |
| GET | `/bookings/my-bookings` | Get user's bookings | Yes | Any |
| GET | `/bookings/event/:eventId/attendees` | Get event attendees | Yes | Organizer |
| PUT | `/bookings/checkin/:bookingId` | Toggle check-in | Yes | Organizer |
| POST | `/bookings/webhook` | Stripe webhook | No | - |

### Analytics Endpoints

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/analytics/dashboard` | Get dashboard stats | Yes | Organizer |
| GET | `/analytics/events/:eventId` | Get event analytics | Yes | Organizer |

---

## 6. Frontend Pages

### Page Summary (14 Pages Total)

| # | Page | Route | Auth | Role | Description |
|---|------|-------|------|------|-------------|
| 1 | HomePage | `/` | No | - | Landing page with hero, features, categories |
| 2 | LoginPage | `/login` | No | - | User login form |
| 3 | RegisterPage | `/register` | No | - | User registration form |
| 4 | DashboardPage | `/dashboard` | Yes | Any | User dashboard overview |
| 5 | BrowseEventsPage | `/events` | No | - | Event listing with filters |
| 6 | EventDetailPage | `/events/:id` | No | - | Event details with ticket selection |
| 7 | CreateEventPage | `/create-event` | Yes | Organizer | Create new event form |
| 8 | EditEventPage | `/edit-event/:id` | Yes | Organizer | Edit event form |
| 9 | MyEventsPage | `/my-events` | Yes | Organizer | Organizer's event list |
| 10 | MyBookingsPage | `/my-bookings` | Yes | Any | User's booking history |
| 11 | BookingConfirmPage | `/booking/confirm/:bookingId` | Yes | Any | Payment confirmation |
| 12 | ManageTicketsPage | `/events/:eventId/tickets` | Yes | Organizer | Ticket type management |
| 13 | AttendeesPage | `/events/:eventId/attendees` | Yes | Organizer | Attendee list + check-in |
| 14 | AnalyticsDashboardPage | `/analytics` | Yes | Organizer | Revenue and sales charts |

### Page Details

#### 1. HomePage (`/`)
**Purpose:** Marketing landing page to attract users

**Sections:**
- Hero section with gradient background and animated orbs
- Call-to-action buttons (Explore Events, Start Organizing)
- Category cards (Music, Sports, Arts, Business, Tech, Food)
- Feature highlights (Event Discovery, Ticketing, Analytics)
- Statistics section (10K+ Events, 50K+ Attendees, etc.)
- Final CTA section

**Components Used:**
- Custom gradient backgrounds
- Floating animation effects
- Category cards with hover effects

---

#### 2. LoginPage (`/login`)
**Purpose:** User authentication

**Form Fields:**
- Email (required, email format)
- Password (required, min 8 chars)

**Features:**
- Form validation with Zod
- Error message display
- Redirect to dashboard on success
- Link to register page

---

#### 3. RegisterPage (`/register`)
**Purpose:** New user registration

**Form Fields:**
- First Name (required)
- Last Name (required)
- Email (required, unique)
- Password (required, min 8 chars)
- Confirm Password (must match)
- User Type (Organizer / Attendee radio buttons)
- Phone (optional)

**Features:**
- Password confirmation validation
- User type selection
- Redirect to dashboard on success

---

#### 4. DashboardPage (`/dashboard`)
**Purpose:** User overview after login

**Content:**
- Welcome message with user name
- Quick stats cards
- Recent activity
- Quick actions based on user role

---

#### 5. BrowseEventsPage (`/events`)
**Purpose:** Event discovery and filtering

**Features:**
- Search bar (name, venue)
- Category filter dropdown
- Date range filter
- Sort options (Date, Name)
- Paginated event grid (12 per page)
- Event cards with:
  - Category gradient background
  - Date badge
  - Event name
  - Venue location
  - Capacity indicator

---

#### 6. EventDetailPage (`/events/:id`)
**Purpose:** View event details and book tickets

**Sections:**
- Hero banner with category gradient
- Event description
- Date & location info
- Ticket selection (for attendees)
- Booking summary sidebar
- Organizer management buttons (for owner)

**Features:**
- Ticket type selection with radio buttons
- Quantity selector (1-10)
- Real-time price calculation
- Sold out indicator
- Past event handling

---

#### 7. CreateEventPage (`/create-event`)
**Purpose:** Create new events (Organizers only)

**Form Fields:**
- Event Name
- Description (textarea)
- Category (dropdown)
- Date picker
- Start Time
- End Time (optional)
- Venue
- Address (optional)
- Capacity
- Status (Draft/Published)

---

#### 8. EditEventPage (`/edit-event/:id`)
**Purpose:** Edit existing events (Owner only)

**Same as CreateEventPage but:**
- Pre-filled with existing data
- Ownership validation
- Update instead of create

---

#### 9. MyEventsPage (`/my-events`)
**Purpose:** Organizer's event management

**Features:**
- List of organizer's events
- Status indicators (Draft, Published, Cancelled)
- Quick actions (Edit, View, Manage Tickets, Attendees)
- Stats per event (tickets sold, revenue)

---

#### 10. MyBookingsPage (`/my-bookings`)
**Purpose:** View booking history

**Features:**
- Filter tabs (All, Upcoming, Past)
- Booking cards with:
  - Event thumbnail
  - Event name and date
  - Ticket type and quantity
  - Payment status badge
  - Check-in status badge
  - Total amount

---

#### 11. BookingConfirmPage (`/booking/confirm/:bookingId`)
**Purpose:** Confirm payment

**Features:**
- Mock payment confirmation
- Success animation
- Redirect options (My Bookings, Browse More)

---

#### 12. ManageTicketsPage (`/events/:eventId/tickets`)
**Purpose:** Manage ticket types for an event

**Features:**
- Add new ticket type (modal form)
- Edit existing tickets
- Delete tickets (only if no sales)
- Deactivate tickets
- Sales progress bar per ticket type

**Form Fields:**
- Ticket Type Name
- Price
- Quantity Available
- Description (optional)

---

#### 13. AttendeesPage (`/events/:eventId/attendees`)
**Purpose:** View and manage event attendees

**Features:**
- Stats cards (Total, Tickets, Checked In)
- Search by name/email
- Filter by check-in status
- Attendee table with:
  - Name and email
  - Ticket type
  - Quantity
  - Total paid
  - Check-in status
  - Check-in button
- Export to CSV

---

#### 14. AnalyticsDashboardPage (`/analytics`)
**Purpose:** View sales and revenue analytics

**Sections:**
- Overview stats grid (Revenue, Tickets, Bookings, Events)
- Revenue by Event (bar chart)
- Sales by Ticket Type (horizontal bars with colors)
- Sales Trend (30-day bar chart)
- Recent Bookings table

---

## 7. Page Navigation Flow

### Public User Flow

```
                                    ┌─────────────┐
                                    │  HomePage   │
                                    │     /       │
                                    └──────┬──────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
                    ▼                      ▼                      ▼
            ┌───────────────┐      ┌───────────────┐      ┌───────────────┐
            │   LoginPage   │      │  RegisterPage │      │ BrowseEvents  │
            │    /login     │      │   /register   │      │   /events     │
            └───────┬───────┘      └───────┬───────┘      └───────┬───────┘
                    │                      │                      │
                    └──────────┬───────────┘                      │
                               │                                  │
                               ▼                                  ▼
                       ┌───────────────┐                  ┌───────────────┐
                       │  DashboardPage│                  │EventDetailPage│
                       │   /dashboard  │                  │  /events/:id  │
                       └───────────────┘                  └───────────────┘
```

### Attendee User Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ BrowseEvents│────►│ EventDetail │────►│  Booking    │────►│ MyBookings  │
│   /events   │     │ /events/:id │     │   Confirm   │     │ /my-bookings│
└─────────────┘     │ + Ticket    │     │ /booking/   │     └─────────────┘
                    │   Selection │     │ confirm/:id │
                    └─────────────┘     └─────────────┘
```

### Organizer User Flow

```
┌─────────────┐     ┌─────────────┐
│  Dashboard  │────►│ CreateEvent │
│ /dashboard  │     │/create-event│
└──────┬──────┘     └─────────────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  MyEvents   │────►│ EventDetail │────►│ManageTickets│     │  Attendees  │
│ /my-events  │     │ /events/:id │     │ /:id/tickets│     │/:id/attendees│
└──────┬──────┘     └──────┬──────┘     └─────────────┘     └─────────────┘
       │                   │                   ▲                   ▲
       │                   └───────────────────┴───────────────────┘
       │
       ▼
┌─────────────┐
│  Analytics  │
│ /analytics  │
└─────────────┘
```

### Navigation Bar Links

| Link | Visible To | Route |
|------|------------|-------|
| Browse Events | Everyone | `/events` |
| Dashboard | Authenticated | `/dashboard` |
| My Bookings | Authenticated | `/my-bookings` |
| My Events | Organizers | `/my-events` |
| Analytics | Organizers | `/analytics` |
| Create Event | Organizers | `/create-event` |
| Sign In | Guests | `/login` |
| Get Started | Guests | `/register` |
| Logout | Authenticated | (action) |

---

## 8. Authentication System

### JWT Token Flow

```
┌────────────┐     ┌────────────┐     ┌────────────┐
│   Client   │     │   Server   │     │  MongoDB   │
└─────┬──────┘     └─────┬──────┘     └─────┬──────┘
      │                  │                  │
      │  POST /login     │                  │
      │  {email,password}│                  │
      │─────────────────►│                  │
      │                  │  Find user       │
      │                  │─────────────────►│
      │                  │◄─────────────────│
      │                  │  Compare password│
      │                  │  (bcrypt)        │
      │                  │                  │
      │                  │  Generate JWT    │
      │                  │  (7 day expiry)  │
      │◄─────────────────│                  │
      │  {token, user}   │                  │
      │                  │                  │
      │  Store in        │                  │
      │  localStorage    │                  │
      │                  │                  │
      │  GET /events     │                  │
      │  Header: Bearer  │                  │
      │  <token>         │                  │
      │─────────────────►│                  │
      │                  │  Verify JWT      │
      │                  │  Extract userId  │
      │                  │  Attach to req   │
      │                  │─────────────────►│
      │                  │◄─────────────────│
      │◄─────────────────│                  │
      │  {events data}   │                  │
```

### Token Structure

```javascript
// JWT Payload
{
  "userId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "userType": "organizer",
  "iat": 1706600000,  // Issued at
  "exp": 1707204800   // Expires (7 days later)
}
```

### Password Security

1. **Hashing:** bcrypt with 10 salt rounds
2. **Storage:** Password never stored in plain text
3. **Comparison:** bcrypt.compare() for verification
4. **Selection:** Password excluded from queries by default (`select: false`)

### Protected Route Implementation

```typescript
// Client-side route protection
<Route
  path="dashboard"
  element={
    <ProtectedRoute requiredRole="organizer">
      <DashboardPage />
    </ProtectedRoute>
  }
/>

// Server-side middleware
router.get('/my-events', authenticate, isOrganizer, getOrganizerEvents);
```

---

## 9. Feature Implementation Details

### 9.1 Event Creation (FR2.1-FR2.5)

**Implementation:**
1. User fills form with event details
2. Zod schema validates input on client
3. Server receives POST request
4. Server validates with Zod schema
5. Mongoose creates document
6. Response with created event

**Files Involved:**
- `client/src/pages/CreateEventPage.tsx`
- `shared/validation/event.ts`
- `server/src/routes/events.ts`
- `server/src/controllers/eventController.ts`
- `server/src/models/Event.ts`

### 9.2 Ticket Management (FR3.1-FR3.4)

**Implementation:**
1. Organizer opens ticket management page
2. Existing tickets fetched from API
3. Create/Edit ticket via modal form
4. Tickets linked to event via `eventId`
5. Quantity tracking with `quantitySold`

**Files Involved:**
- `client/src/pages/ManageTicketsPage.tsx`
- `client/src/services/tickets.ts`
- `server/src/routes/tickets.ts`
- `server/src/controllers/ticketController.ts`
- `server/src/models/Ticket.ts`

### 9.3 Booking Flow (FR8.1-FR9.5)

**Implementation:**
1. User selects ticket type and quantity
2. Booking created with `pending` status
3. Stripe checkout session created (or mock)
4. User completes payment
5. Webhook/confirm updates status to `completed`
6. Ticket `quantitySold` incremented

**Files Involved:**
- `client/src/pages/EventDetailPage.tsx`
- `client/src/pages/BookingConfirmPage.tsx`
- `server/src/controllers/bookingController.ts`
- `server/src/models/Booking.ts`

### 9.4 Check-in System (FR4.3)

**Implementation:**
1. Organizer opens attendees page
2. Attendee list fetched with check-in status
3. Click "Check In" toggles status
4. API updates `checkInStatus` field

**Files Involved:**
- `client/src/pages/AttendeesPage.tsx`
- `server/src/controllers/bookingController.ts` (`checkInAttendee`)

### 9.5 Analytics Dashboard (FR5.1-FR5.5)

**Implementation:**
1. Aggregation queries on bookings collection
2. Group by event, ticket type, date
3. Calculate totals and percentages
4. Return structured data for charts

**Files Involved:**
- `client/src/pages/AnalyticsDashboardPage.tsx`
- `server/src/controllers/analyticsController.ts`

---

## 10. Development Setup

### Prerequisites

- Node.js 20.x
- Docker & Docker Compose
- npm or yarn

### Quick Start

```bash
# Clone repository
git clone <repository-url>
cd ems_greenwich

# Install dependencies
npm install

# Start with Docker
docker compose up -d

# Access application
# Frontend: http://localhost:5173
# Backend:  http://localhost:5001
# MongoDB:  mongodb://localhost:27017
```

### Environment Variables

```env
# Server
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://emsadmin:emspassword@mongodb:27017/ems_db?authSource=admin
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Client
VITE_API_URL=http://localhost:5001/api
```

### Docker Services

| Service | Port | Description |
|---------|------|-------------|
| mongodb | 27017 | MongoDB database |
| server | 5001 | Express API server |
| client | 5173 | Vite dev server |

### Useful Commands

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f server
docker compose logs -f client

# Rebuild after code changes
docker compose up --build -d

# Stop all services
docker compose down

# Reset database (delete volume)
docker compose down -v
```

### MongoDB Access

```bash
# Connect to MongoDB shell
docker exec -it ems-mongodb mongosh -u emsadmin -p emspassword --authenticationDatabase admin

# Switch to database
use ems_db

# View collections
show collections

# Query users
db.users.find().pretty()

# Query events
db.events.find().pretty()
```

---

## Appendix: File Count Summary

| Category | Count |
|----------|-------|
| Frontend Pages | 14 |
| Frontend Components | 3 |
| Frontend Services | 5 |
| Server Routes | 6 |
| Server Controllers | 5 |
| Server Models | 4 |
| Shared Types | 5 |
| Shared Validations | 4 |
| **Total TypeScript Files** | **~46** |

---

**Document Version:** 1.0
**Last Updated:** January 2026
**Generated for:** MSc Dissertation Documentation

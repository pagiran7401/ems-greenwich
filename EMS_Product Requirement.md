
# Event Management System - Product Requirements Document (PRD)

## 1. Technical Stack

### Frontend

- **Framework:** React.js
- **Styling:** Tailwind CSS
- **State Management:** React Context API / Redux (if needed)
- **HTTP Client:** Axios
- **Charting:** Chart.js

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt

### Database

- **Database:** MongoDB
- **ODM:** Mongoose

### Full Stack

- **MERN Stack:** MongoDB + Express + React + Node.js

---

## 2. Core Features (Must Have)

### Organizer Features

|Feature|Priority|Description|
|---|---|---|
|Event Creation|MUST|Create events with name, description, date, venue, image|
|Multiple Ticket Types|MUST|Create multiple ticket tiers per event|
|Attendee List View|MUST|View all attendees for each event|
|Check-in System|MUST|Mark attendees as checked-in|
|Analytics Dashboard|MUST|View sales, revenue, ticket stats|

### Attendee Features

|Feature|Priority|Description|
|---|---|---|
|Event Browsing|MUST|Browse all public events|
|Search & Filters|MUST|Search by keyword, filter by date/category/price|
|Ticket Booking|MUST|Select tickets and book|
|Mock Payment|MUST|Stripe test mode or simple mock gateway|
|Booking History|MUST|View all past and upcoming bookings|

---

## 3. Should Have Features (If Time Permits)

|Feature|Priority|Description|
|---|---|---|
|Event Categories|SHOULD|Categorize events (Music, Sports, Business, etc.)|
|Advanced Analytics|SHOULD|Charts for organizers (line charts, pie charts)|
|Email Notifications|SHOULD|Mock email for booking confirmations|
|In-app Notifications|SHOULD|Pop-up notifications for bookings/updates|

**Profile Picture Upload:** Removed (database storage concern)

---

## 4. Performance Targets

|Metric|Target|
|---|---|
|Page Load Time|< 2 seconds|
|API Response Time|< 500ms|
|Concurrent Users|100+|
|Database Query Time|< 200ms|

---

## 5. Testing Approach

- **Manual Testing:** Self-testing all workflows
- **Automated Unit Tests:** Optional (Jest/Mocha if time permits)
- **Usability Testing:** No user recruitment needed
- **Performance Testing:** Optional load testing
- **Security Testing:** Manual SQL injection, XSS checks

---

## 6. Development Timeline

|Phase|Duration|Tasks|
|---|---|---|
|**Total Project**|3-4 months|Full development cycle|
|**Core Features**|6-8 weeks|MUST HAVE features|
|**Testing**|2-3 weeks|Manual testing, bug fixes|
|**Documentation**|3-4 weeks|Dissertation writing|

---

## 7. Payment Integration

**Primary Choice:** Stripe (Test Mode)

- Free to use in test mode
- High API rate limits
- Well-documented
- Realistic payment flow simulation

**Fallback:** Simple mock payment gateway

- Form that simulates card entry
- 90% success rate, 10% random failure
- Generate mock transaction IDs

---

## 8. Analytics Complexity

**Level:** Basic/Minimal

**Metrics to Display:**

- Total revenue (number)
- Total tickets sold (number)
- Tickets sold per event (simple bar chart)
- Revenue per ticket type (pie chart)
- Sales over time (line chart - optional)

**No Need For:**

- Advanced BI dashboards
- Predictive analytics
- Real-time updates
- Complex filtering

---

## 9. Email Notifications

**Implementation Approach:**

### Option 1: Nodemailer (Recommended)

- Free SMTP service (Gmail/Mailtrap)
- Send actual emails to test accounts
- Save email logs to database

### Option 2: Mock Email Service

- Log emails to console
- Save to database as "sent"
- Display in UI (notification center)

**Notification Types:**

- Booking confirmation
- Event reminder (1 day before)
- Event updates/cancellations
- Check-in confirmation

**Plus:** In-app pop-up notifications (React Toast)

---

## 10. Dissertation Focus

**Primary Focus:** Technical Implementation + Problem-Solving

**What to Emphasize:**

1. How you pulled together full-stack architecture
2. Effective problem-solving and design decisions
3. Documentation and academic rigor
4. Comparative analysis vs competitors

**Balance:**

- 40% Technical Implementation
- 30% Problem-Solving & Design
- 30% Documentation & Analysis

---

## 11. Evaluation Approach

**Primary Method:** Comparative Analysis

**Competitors to Analyze:**

1. **Eventbrite** (UK/Global)
2. **Ticketmaster** (UK)
3. **Eventful** (if still active in UK)
4. **Meetup** (UK)
5. **Skiddle** (UK-focused)
6. **Dice** (UK music events)

**Evaluation Criteria:**

- Feature comparison matrix
- Nielsen's heuristics evaluation
- Pricing structure comparison
- Ease of use assessment
- Your unique value proposition

---

## 12. Functional Requirements

### FR1: User Authentication

|ID|Requirement|Priority|
|---|---|---|
|FR1.1|Users shall register with email/password|MUST|
|FR1.2|Users shall login with JWT tokens|MUST|
|FR1.3|Passwords shall be hashed with bcrypt|MUST|
|FR1.4|Sessions shall expire after 30 min inactivity|MUST|
|FR1.5|Users shall select role (Organizer/Attendee)|MUST|

### FR2: Event Management (Organizer)

|ID|Requirement|Priority|
|---|---|---|
|FR2.1|Organizers shall create events with full details|MUST|
|FR2.2|Organizers shall upload event images (max 5MB)|MUST|
|FR2.3|Organizers shall edit/delete events|MUST|
|FR2.4|Organizers shall set event categories|SHOULD|
|FR2.5|Events shall have status (Draft/Published/Cancelled)|MUST|

### FR3: Ticket Management

|ID|Requirement|Priority|
|---|---|---|
|FR3.1|Organizers shall create multiple ticket types|MUST|
|FR3.2|Each ticket type shall have price, quantity, description|MUST|
|FR3.3|Organizers shall enable/disable ticket sales|MUST|
|FR3.4|System shall track sold vs available quantity|MUST|

### FR4: Attendee Management

|ID|Requirement|Priority|
|---|---|---|
|FR4.1|Organizers shall view complete attendee list|MUST|
|FR4.2|Organizers shall search/filter attendees|MUST|
|FR4.3|Organizers shall mark attendees as checked-in|MUST|
|FR4.4|Organizers shall export attendee data to CSV|SHOULD|

### FR5: Analytics Dashboard

|ID|Requirement|Priority|
|---|---|---|
|FR5.1|Display total revenue across all events|MUST|
|FR5.2|Display total tickets sold|MUST|
|FR5.3|Show revenue per event (bar chart)|MUST|
|FR5.4|Show tickets by type (pie chart)|SHOULD|
|FR5.5|Show sales over time (line chart)|COULD|

### FR6: Event Discovery (Attendee)

|ID|Requirement|Priority|
|---|---|---|
|FR6.1|Attendees shall browse all public events|MUST|
|FR6.2|Events shall display in grid/list view|MUST|
|FR6.3|Attendees shall view event details|MUST|
|FR6.4|Events shall show date, location, price|MUST|

### FR7: Search & Filtering

|ID|Requirement|Priority|
|---|---|---|
|FR7.1|Attendees shall search events by keyword|MUST|
|FR7.2|Attendees shall filter by date range|MUST|
|FR7.3|Attendees shall filter by category|SHOULD|
|FR7.4|Attendees shall filter by price range|SHOULD|
|FR7.5|Attendees shall sort results|SHOULD|

### FR8: Ticket Booking

|ID|Requirement|Priority|
|---|---|---|
|FR8.1|Attendees shall select ticket type and quantity|MUST|
|FR8.2|System shall calculate total cost|MUST|
|FR8.3|System shall validate ticket availability|MUST|
|FR8.4|Attendees shall proceed to checkout|MUST|

### FR9: Payment Processing

|ID|Requirement|Priority|
|---|---|---|
|FR9.1|System shall integrate Stripe test mode|MUST|
|FR9.2|System shall accept mock card payments|MUST|
|FR9.3|System shall generate transaction IDs|MUST|
|FR9.4|System shall update booking status on payment|MUST|
|FR9.5|System shall handle payment failures|MUST|

### FR10: Booking History

|ID|Requirement|Priority|
|---|---|---|
|FR10.1|Attendees shall view all bookings|MUST|
|FR10.2|Bookings shall show event details|MUST|
|FR10.3|Attendees shall filter (Upcoming/Past)|MUST|
|FR10.4|Attendees shall download booking confirmation|SHOULD|

### FR11: Notifications

|ID|Requirement|Priority|
|---|---|---|
|FR11.1|System shall send booking confirmation email|SHOULD|
|FR11.2|System shall send event reminders|SHOULD|
|FR11.3|System shall display in-app notifications|SHOULD|
|FR11.4|Organizers shall receive booking notifications|SHOULD|

---

## 13. Non-Functional Requirements

### NFR1: Performance

|ID|Requirement|Target|
|---|---|---|
|NFR1.1|Page load time|< 2 seconds|
|NFR1.2|API response time|< 500ms|
|NFR1.3|Support concurrent users|100+|
|NFR1.4|Database query time|< 200ms|

### NFR2: Security

|ID|Requirement|Implementation|
|---|---|---|
|NFR2.1|Password encryption|bcrypt (salt rounds: 10)|
|NFR2.2|SQL injection prevention|Mongoose (NoSQL) parameterization|
|NFR2.3|XSS prevention|Input sanitization, CSP headers|
|NFR2.4|CSRF protection|JWT tokens, SameSite cookies|
|NFR2.5|Session management|JWT with 30-min expiry|

### NFR3: Usability

|ID|Requirement|Target|
|---|---|---|
|NFR3.1|User satisfaction score|> 4/5|
|NFR3.2|First-time user intuitiveness|No tutorial needed|
|NFR3.3|Mobile responsiveness|Full support|
|NFR3.4|Error messages|Clear and actionable|

### NFR4: Reliability

|ID|Requirement|Target|
|---|---|---|
|NFR4.1|System uptime|99% during testing|
|NFR4.2|Data persistence|No data loss|
|NFR4.3|Error handling|Graceful failures|

### NFR5: Maintainability

|ID|Requirement|Standard|
|---|---|---|
|NFR5.1|Code comments|All functions documented|
|NFR5.2|Coding standards|ESLint + Prettier|
|NFR5.3|API documentation|Postman collection|
|NFR5.4|Database schema|Documented with examples|

---

## 14. System Architecture

### High-Level Architecture

```
┌─────────────────┐
│   React.js      │  (Frontend - Tailwind CSS)
│   (Client)      │
└────────┬────────┘
         │
         │ HTTP/HTTPS (Axios)
         │
┌────────▼────────┐
│   Express.js    │  (Backend - REST API)
│   (Server)      │  (JWT Authentication)
└────────┬────────┘
         │
         │ Mongoose ODM
         │
┌────────▼────────┐
│   MongoDB       │  (Database)
│   (Atlas/Local) │
└─────────────────┘
```

### Database Schema (MongoDB Collections)

**Users Collection**

javascript

```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  userType: String (enum: ['organizer', 'attendee']),
  firstName: String,
  lastName: String,
  createdAt: Date
}
```

**Events Collection**

javascript

```javascript
{
  _id: ObjectId,
  organizerId: ObjectId (ref: Users),
  eventName: String,
  description: String,
  eventDate: Date,
  eventTime: String,
  venue: String,
  category: String,
  eventImage: String (URL),
  status: String (enum: ['draft', 'published', 'cancelled']),
  createdAt: Date
}
```

**Tickets Collection**

javascript

```javascript
{
  _id: ObjectId,
  eventId: ObjectId (ref: Events),
  ticketType: String,
  price: Number,
  quantityAvailable: Number,
  quantitySold: Number,
  description: String
}
```

**Bookings Collection**

javascript

```javascript
{
  _id: ObjectId,
  attendeeId: ObjectId (ref: Users),
  eventId: ObjectId (ref: Events),
  ticketId: ObjectId (ref: Tickets),
  quantity: Number,
  totalAmount: Number,
  bookingDate: Date,
  paymentStatus: String (enum: ['pending', 'completed', 'failed']),
  transactionId: String
}
```

**Notifications Collection** (Optional)

javascript

````javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  message: String,
  type: String (enum: ['booking', 'reminder', 'update']),
  read: Boolean,
  createdAt: Date
}
```

---

## 15. API Endpoints

### Authentication
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
POST   /api/auth/logout        - Logout user
GET    /api/auth/me            - Get current user
```

### Events (Organizer)
```
POST   /api/events             - Create event
GET    /api/events             - Get all events (public)
GET    /api/events/:id         - Get event by ID
PUT    /api/events/:id         - Update event
DELETE /api/events/:id         - Delete event
GET    /api/organizer/events   - Get organizer's events
```

### Tickets
```
POST   /api/events/:id/tickets - Create ticket type
GET    /api/events/:id/tickets - Get tickets for event
PUT    /api/tickets/:id        - Update ticket
DELETE /api/tickets/:id        - Delete ticket
```

### Bookings
```
POST   /api/bookings           - Create booking
GET    /api/bookings           - Get user's bookings
GET    /api/events/:id/bookings - Get event bookings (organizer)
PUT    /api/bookings/:id       - Update booking status
```

### Analytics
```
GET    /api/analytics/dashboard      - Get organizer dashboard stats
GET    /api/analytics/events/:id     - Get event-specific analytics
```

### Check-in
```
PUT    /api/checkin/:bookingId - Mark attendee as checked-in
````

---

## 16. MoSCoW Prioritization

### MUST HAVE (Week 1-6)

- User authentication (register/login)
- Event CRUD operations
- Ticket management
- Event browsing and search
- Ticket booking workflow
- Stripe test mode integration
- Basic organizer dashboard
- Attendee list and check-in
- Booking history

### SHOULD HAVE (Week 7-9)

- Event categories
- Advanced search filters
- Email notifications (Nodemailer)
- In-app notifications
- Basic analytics charts
- CSV export

### COULD HAVE (Week 10-11)

- Advanced analytics
- Event recommendations
- Social sharing (mock)
- Discount codes
- Event templates

### WON'T HAVE

- Real payment processing (Stripe live mode)
- Native mobile apps
- Real-time chat
- Multi-language support
- Social media API integration
- Cloud deployment

---

## 17. Competitor Analysis Framework

### Competitors to Analyze

|Platform|Type|Market|Focus|
|---|---|---|---|
|**Eventbrite**|Direct|Global/UK|All events, marketplace|
|**Ticketmaster**|Indirect|Global/UK|Large venues, concerts|
|**Skiddle**|Direct|UK|Music, nightlife|
|**Dice**|Direct|UK|Music events, no fees|
|**Meetup**|Adjacent|Global/UK|Community, networking|
|**Eventful**|Direct|Global/UK|Event discovery|

### Evaluation Criteria

**Nielsen's 10 Usability Heuristics:**

1. Visibility of system status
2. Match between system and real world
3. User control and freedom
4. Consistency and standards
5. Error prevention
6. Recognition rather than recall
7. Flexibility and efficiency of use
8. Aesthetic and minimalist design
9. Help users recognize, diagnose, recover from errors
10. Help and documentation

**Feature Comparison Matrix:**

|Feature|Eventbrite|Ticketmaster|Skiddle|Dice|Your EMS|
|---|---|---|---|---|---|
|Event Creation|★★★★★|★★★★★|★★★★|★★★|★★★★|
|Ticketing|★★★★★|★★★★★|★★★★|★★★★★|★★★★|
|Fees|High (15%+)|Very High|Moderate|None|None (Academic)|
|Ease of Use|★★★|★★|★★★★|★★★★★|★★★★|
|Analytics|★★★★|★★★★★|★★★|★★|★★★|
|Mobile App|★★★★★|★★★★★|★★★★|★★★★★|N/A|

---

## 18. Development Milestones

### Month 1: Foundation

**Week 1-2:**

- ✅ Set up MERN stack environment
- ✅ Database schema design
- ✅ User authentication (JWT)
- ✅ Basic frontend routing

**Week 3-4:**

- ✅ Event creation functionality
- ✅ Event listing page
- ✅ Ticket type management
- ✅ Basic organizer dashboard

### Month 2: Core Features

**Week 5-6:**

- ✅ Event search and filtering
- ✅ Event detail page
- ✅ Ticket booking flow
- ✅ Stripe test mode integration

**Week 7-8:**

- ✅ Booking history
- ✅ Attendee management
- ✅ Check-in system
- ✅ Basic analytics

### Month 3: Enhancement & Testing

**Week 9-10:**

- ✅ Event categories
- ✅ Email notifications
- ✅ In-app notifications
- ✅ Analytics charts

**Week 11-12:**

- ✅ Manual testing all workflows
- ✅ Bug fixes
- ✅ Performance optimization
- ✅ Documentation

### Month 4: Dissertation

**Week 13-16:**

- ✅ Literature review writing
- ✅ Competitor analysis
- ✅ Evaluation and testing
- ✅ Final dissertation writing

---

## 19. Success Criteria

|Metric|Target|How to Measure|
|---|---|---|
|**Functional Completeness**|100% of MUST features|Checklist completion|
|**Page Load Time**|< 2 seconds|Chrome DevTools|
|**API Response Time**|< 500ms|Postman/console logs|
|**Concurrent Users**|100+|Manual stress testing|
|**User Satisfaction**|> 4/5|Usability survey (if conducted)|
|**Code Quality**|ESLint 0 errors|Linting reports|
|**Bug Count**|< 10 critical bugs|Bug tracker|

---

## 20. Risks & Mitigation

|Risk|Impact|Probability|Mitigation|
|---|---|---|---|
|Time overrun|High|Medium|Stick to MUST features only|
|Stripe API issues|Medium|Low|Have mock payment fallback|
|Database performance|Medium|Medium|Optimize queries, add indexes|
|Scope creep|High|High|Strictly follow MoSCoW|
|Learning curve (MERN)|Medium|Medium|Allocate week 1 for setup/learning|

---

## 21. Deliverables Checklist

### Code Deliverables

- [ ]  Frontend React application
- [ ]  Backend Express API
- [ ]  MongoDB database with seed data
- [ ]  README with setup instructions
- [ ]  API documentation (Postman)
- [ ]  Environment configuration examples

### Documentation Deliverables

- [ ]  Requirements specification (this PRD)
- [ ]  System architecture diagrams
- [ ]  Database schema documentation
- [ ]  User manual (organizer & attendee)
- [ ]  Testing report
- [ ]  Dissertation (15,000-17,000 words)

---

**PRD Version:** 1.0  
**Last Updated:** December 2024  
**Project Timeline:** 3-4 months  
**Target Completion:** March/April 2025
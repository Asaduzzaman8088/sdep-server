# SDEP Backend API (Social Development Events Platform)

Express and MongoDB REST API powering the Social Development Events Platform (SDEP).

- **Client Live Site URL:** [https://sdep-client.vercel.app](https://sdep-client.vercel.app)
- **Client Repository:** [https://github.com/Asaduzzaman8088/sdep-client](https://github.com/Asaduzzaman8088/sdep-client)
- **Server Repository:** [https://github.com/Asaduzzaman8088/sdep-server](https://github.com/Asaduzzaman8088/sdep-server)
- **API Base URL:** `http://localhost:5000` (or your deployed server URL)

---

## Key Features

- **RESTful Event Management:** Full CRUD operations for community service events with automatic slugging, capacity calculation, and indexing.
- **Future Date & Strict Validation:** Zod-validated payloads ensuring only upcoming dates are accepted and past events are excluded from the public directory.
- **JWT & Bearer Authentication:** Secure middleware verifying BetterAuth JWT tokens on private organizer and attendee endpoints.
- **Event Ownership Enforcement:** Strict authorization checks preventing non-creators from editing or deleting events.
- **MongoDB Atlas Integration:** High-performance replica set connection with Mongoose and native MongoDB driver utilities.
- **RSVP & Join Tracking:** Atomic joining and cancellation endpoints with real-time attendee counts and user tracking.

---

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js 5
- **Database:** MongoDB Atlas via Mongoose & Native MongoDB Driver
- **Security:** Helmet, CORS, JWT verification via Jose
- **Validation:** Zod

---

## API Endpoints

### Public Endpoints
- `GET /api/events/upcoming` — Fetch 6 upcoming events (uses `.limit()`)
- `GET /api/events` — Paginated and filtered events list (`search`, `type`, `location`)
- `GET /api/events/:id` — Single event details with attendee status
- `GET /api/health` — API health check

### Protected Endpoints (Bearer JWT required)
- `POST /api/events` — Create a new service event
- `PATCH /api/events/:id` — Update an existing event (creator only)
- `DELETE /api/events/:id` — Delete an event (creator only)
- `POST /api/events/:id/join` — Join an event
- `DELETE /api/events/:id/join` — Cancel RSVP
- `GET /api/my/events` — Retrieve events created by logged-in user
- `GET /api/my/joined` — Retrieve events joined by logged-in user

---

## Getting Started

### 1. Install dependencies:
```bash
npm install
```

### 2. Configure Environment Variables:
Copy `.env.example` to `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://sdep:AUBuQaFTI6U0C39W@ac-fdwbtuv-shard-00-00.8d1n9vg.mongodb.net:27017,ac-fdwbtuv-shard-00-01.8d1n9vg.mongodb.net:27017,ac-fdwbtuv-shard-00-02.8d1n9vg.mongodb.net:27017/?ssl=true&replicaSet=atlas-1m1cx9-shard-0&authSource=admin
DB_NAME=sdep
CLIENT_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000
```

### 3. Start the API Server:
```bash
npm run dev
# or
node index.js
```

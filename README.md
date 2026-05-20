# TaskNova — Server API

Backend REST API for the **TaskNova** Micro Task & Earning Platform, built with Node.js, Express, and MongoDB.

## 🔗 Live API
`https://your-server-url.com`

## 👤 Admin Credentials
- **Email:** admin@tasknova.com
- **Password:** admin123

---

## 🚀 Tech Stack
- **Runtime:** Node.js (v22+)
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** Firebase + JWT
- **Payment:** Stripe

---

## ✨ Features

- 🔐 **JWT Authentication** — secure token-based auth for all protected routes
- 👥 **Role-Based Access Control** — Worker, Buyer, Admin middleware
- 📋 **Task Management** — full CRUD with search, filter and sort
- 📤 **Submission System** — workers submit, buyers approve or reject
- 💰 **Coin Economy** — automated coin transfer on approval/withdrawal
- 🔔 **Notification System** — real-time notifications on key actions
- 💳 **Payment Integration** — Stripe-ready payment and coin purchase
- 🏧 **Withdrawal System** — workers withdraw earnings via multiple methods
- 🚨 **Report System** — buyers can report invalid submissions
- 🛡️ **Input Validation** — request validation middleware on all routes
- 🌐 **Global Error Handler** — consistent error responses across the API

---

## 📁 Folder Structure

```
server/
├── config/
│   ├── db.js               # MongoDB connection
│   └── validateEnv.js      # Environment variable validation
├── controllers/            # Route logic
├── middleware/
│   ├── verifyToken.js      # JWT verification
│   ├── verifyRole.js       # Role-based access
│   ├── validateRequest.js  # Input validation
│   └── errorHandler.js     # Global error handler
├── models/                 # Mongoose schemas
├── routes/                 # Express routers
└── server.js               # Entry point
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/jwt` | Generate JWT token |
| POST | `/api/users` | Create/register user |
| GET  | `/api/users` | Get all users (admin) |
| GET  | `/api/users/top-workers` | Get top 6 workers |
| GET  | `/api/tasks/available` | Get available tasks (with filter) |
| POST | `/api/tasks` | Create task (buyer) |
| POST | `/api/submissions` | Submit task (worker) |
| PATCH| `/api/submissions/approve/:id` | Approve submission |
| PATCH| `/api/submissions/reject/:id` | Reject submission |
| POST | `/api/withdrawals` | Request withdrawal |
| PATCH| `/api/withdrawals/approve/:id` | Approve withdrawal (admin) |
| POST | `/api/payments` | Record coin purchase |
| GET  | `/api/notifications/:email` | Get user notifications |
| GET  | `/api/admin/stats` | Platform stats (admin) |
| POST | `/api/reports` | Report a submission |
| GET  | `/api/reports` | Get all reports (admin) |

---

## ⚙️ Setup

```bash
# Install dependencies
npm install

# Add environment variables
cp .env.example .env

# Run in development
npm run dev

# Run in production
npm start
```

---

## 🌍 Environment Variables

```bash
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_...
CLIENT_URL=http://localhost:3000
```
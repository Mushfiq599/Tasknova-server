import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import validateEnv from './config/validateEnv.js'
import errorHandler from './middleware/errorHandler.js'

import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import submissionRoutes from './routes/submissionRoutes.js'
import withdrawalRoutes from './routes/withdrawalRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import reportRoutes from './routes/reportRoutes.js'

dotenv.config()
validateEnv()
connectDB()

const app = express()
const PORT = process.env.PORT || 5000

// ── Middleware ───────────────────────────────────────────────
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
}))
app.use(express.json())

// ── Routes ───────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/submissions', submissionRoutes)
app.use('/api/withdrawals', withdrawalRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/reports', reportRoutes)

// ── Health check ─────────────────────────────────────────────
app.get('/', (req, res) => res.json({
    message: '✅ TaskNova API is running',
    version: '1.0.0',
    endpoints: [
        '/api/auth', '/api/users', '/api/tasks',
        '/api/submissions', '/api/withdrawals',
        '/api/payments', '/api/notifications',
        '/api/admin', '/api/reports',
    ],
}))

// ── 404 ──────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: 'Route not found' }))

// ── Global error handler ─────────────────────────────────────
app.use(errorHandler)

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
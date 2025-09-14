import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { connectToDatabase } from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import listingRoutes from './routes/listing.routes.js'
import adminRoutes from './routes/admin.routes.js'

const app = express()

// Basic security and parsing middleware
app.use(helmet())
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('dev'))

// CORS (adjust origins via env)
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map((o) => o.trim())

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  })
)

// Rate limit auth and general
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
app.use('/api/', apiLimiter)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV || 'development' })
})

// Placeholder routes (to be implemented)
app.use('/api/auth', authRoutes)
app.use('/api/listings', listingRoutes)
app.use('/api/admin', adminRoutes)

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const status = err.status || 500
  res.status(status).json({ message: err.message || 'Internal Server Error' })
})

const PORT = Number(process.env.PORT || 4000)

async function start() {
  await connectToDatabase()

  const httpServer = createServer(app)
  const io = new SocketIOServer(httpServer, {
    cors: { origin: allowedOrigins, credentials: true },
  })

  io.on('connection', (socket) => {
    // Placeholder for future messaging features
    socket.on('disconnect', () => {})
  })

  httpServer.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${PORT}`)
  })
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', err)
  process.exit(1)
})


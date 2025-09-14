import { Router } from 'express'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { User } from '../models/User.js'
import { signAccessToken, authenticateUser } from '../middleware/auth.js'
import { env } from '../config/env.js'

const router = Router()

const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['owner', 'tenant']).optional(),
})

router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ message: 'Invalid payload', errors: parsed.error.flatten() })
  const { fullName, email, password, role } = parsed.data

  const existing = await User.findOne({ email })
  if (existing) return res.status(409).json({ message: 'Email already in use' })

  const passwordHash = await bcrypt.hash(password, 10)
  const resolvedRole = env.adminEmail && email.toLowerCase() === env.adminEmail.toLowerCase() ? 'admin' : (role || 'tenant')
  const user = await User.create({ fullName, email, passwordHash, role: resolvedRole })
  const token = signAccessToken({ userId: user._id.toString(), role: user.role })
  res
    .cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.cookieSecure,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(201)
    .json({ user: sanitizeUser(user), token })
})

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) })

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ message: 'Invalid payload', errors: parsed.error.flatten() })
  const { email, password } = parsed.data
  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
  const token = signAccessToken({ userId: user._id.toString(), role: user.role })
  res
    .cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.cookieSecure,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({ user: sanitizeUser(user), token })
})

router.post('/logout', (_req, res) => {
  res.clearCookie('access_token').json({ message: 'Logged out' })
})

router.get('/me', authenticateUser, async (req, res) => {
  const user = await User.findById(req.user.userId)
  if (!user) return res.status(404).json({ message: 'Not found' })
  return res.json({ user: sanitizeUser(user) })
})

function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    role: user.role,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    location: user.location,
    verified: user.verified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

export default router


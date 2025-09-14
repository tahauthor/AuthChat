import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export function signAccessToken(payload, options = {}) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: '7d', ...options })
}

export function authenticateUser(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const tokenFromHeader = header.startsWith('Bearer ') ? header.slice(7) : null
    const tokenFromCookie = req.cookies?.access_token
    const token = tokenFromHeader || tokenFromCookie
    if (!token) return res.status(401).json({ message: 'Unauthorized' })
    const decoded = jwt.verify(token, env.jwtSecret)
    req.user = { userId: decoded.userId, role: decoded.role }
    return next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' })
    return next()
  }
}


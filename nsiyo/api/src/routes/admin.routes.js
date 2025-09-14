import { Router } from 'express'
import { authenticateUser, requireRoles } from '../middleware/auth.js'
import { User } from '../models/User.js'
import { Listing } from '../models/Listing.js'

const router = Router()

router.use(authenticateUser, requireRoles('admin'))

router.get('/users', async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).limit(200)
  res.json({ items: users.map((u) => ({ id: u._id, fullName: u.fullName, email: u.email, role: u.role, createdAt: u.createdAt })) })
})

router.get('/listings', async (_req, res) => {
  const listings = await Listing.find().sort({ createdAt: -1 }).limit(200)
  res.json({ items: listings })
})

router.patch('/listings/:id/status', async (req, res) => {
  const { status } = req.body
  const listing = await Listing.findById(req.params.id)
  if (!listing) return res.status(404).json({ message: 'Not found' })
  listing.status = status || listing.status
  await listing.save()
  res.json(listing)
})

export default router


import { Router } from 'express'
import { z } from 'zod'
import { Listing } from '../models/Listing.js'
import { authenticateUser, requireRoles } from '../middleware/auth.js'

const router = Router()

const createListingSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.enum(['housing', 'hotel', 'event_space']),
  propertyType: z.enum(['apartment', 'house', 'studio', 'hotel_room', 'villa', 'hall', 'conference_room', 'outdoor', 'other']),
  address: z
    .object({ country: z.string().optional(), city: z.string().optional(), street: z.string().optional(), lat: z.number().optional(), lng: z.number().optional() })
    .optional(),
  photos: z.array(z.object({ url: z.string().url(), alt: z.string().optional() })).optional(),
  amenities: z.array(z.string()).optional(),
  capacity: z.number().optional(),
  price: z.object({ amount: z.number(), currency: z.string().default('XOF'), per: z.enum(['night', 'day', 'hour', 'event']) }),
  availability: z
    .object({ type: z.enum(['calendar', 'always']).default('always'), unavailableDates: z.array(z.string()).optional() })
    .optional(),
  rules: z.array(z.string()).optional(),
})

router.get('/', async (req, res) => {
  const { city, q, category, type, minPrice, maxPrice, page = '1', limit = '20' } = req.query
  const filters = { status: 'active' }
  if (city) filters['address.city'] = city
  if (category) filters.category = category
  if (type) filters.propertyType = type
  if (minPrice) filters['price.amount'] = { ...(filters['price.amount'] || {}), $gte: Number(minPrice) }
  if (maxPrice) filters['price.amount'] = { ...(filters['price.amount'] || {}), $lte: Number(maxPrice) }

  const query = Listing.find(filters)
  if (q) query.find({ $text: { $search: String(q) } })
  const pageNum = Math.max(1, parseInt(String(page), 10))
  const limitNum = Math.max(1, Math.min(50, parseInt(String(limit), 10)))
  const [items, total] = await Promise.all([
    query
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Listing.countDocuments(filters),
  ])
  res.json({ items, total, page: pageNum, pageSize: limitNum })
})

router.get('/:id', async (req, res) => {
  const item = await Listing.findById(req.params.id)
  if (!item) return res.status(404).json({ message: 'Not found' })
  res.json(item)
})

router.post('/', authenticateUser, requireRoles('owner', 'admin'), async (req, res) => {
  const parsed = createListingSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ message: 'Invalid payload', errors: parsed.error.flatten() })
  const payload = parsed.data
  const listing = await Listing.create({ ...payload, ownerId: req.user.userId })
  res.status(201).json(listing)
})

router.patch('/:id', authenticateUser, requireRoles('owner', 'admin'), async (req, res) => {
  const listing = await Listing.findById(req.params.id)
  if (!listing) return res.status(404).json({ message: 'Not found' })
  if (String(listing.ownerId) !== req.user.userId && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' })
  Object.assign(listing, req.body)
  await listing.save()
  res.json(listing)
})

router.delete('/:id', authenticateUser, requireRoles('owner', 'admin'), async (req, res) => {
  const listing = await Listing.findById(req.params.id)
  if (!listing) return res.status(404).json({ message: 'Not found' })
  if (String(listing.ownerId) !== req.user.userId && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' })
  await listing.deleteOne()
  res.status(204).send()
})

export default router


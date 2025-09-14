import mongoose from 'mongoose'

const photoSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    alt: { type: String },
  },
  { _id: false }
)

const listingSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['housing', 'hotel', 'event_space'], required: true, index: true },
    propertyType: {
      type: String,
      enum: ['apartment', 'house', 'studio', 'hotel_room', 'villa', 'hall', 'conference_room', 'outdoor', 'other'],
      required: true,
      index: true,
    },
    address: {
      country: String,
      city: { type: String, index: true },
      street: String,
      lat: Number,
      lng: Number,
    },
    photos: [photoSchema],
    amenities: [String],
    capacity: { type: Number },
    price: {
      amount: { type: Number, required: true, index: true },
      currency: { type: String, default: 'XOF' },
      per: { type: String, enum: ['night', 'day', 'hour', 'event'], required: true },
    },
    availability: {
      type: { type: String, enum: ['calendar', 'always'], default: 'always' },
      unavailableDates: [Date],
    },
    rules: [String],
    status: { type: String, enum: ['active', 'inactive', 'moderation', 'archived'], default: 'active', index: true },
    views: { type: Number, default: 0 },
    favoritesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

listingSchema.index({ title: 'text', description: 'text' })

export const Listing = mongoose.model('Listing', listingSchema)


import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['owner', 'tenant', 'admin'], default: 'tenant', index: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    phone: { type: String },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String },
    bio: { type: String },
    location: {
      country: String,
      city: String,
      lat: Number,
      lng: Number,
    },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const User = mongoose.model('User', userSchema)


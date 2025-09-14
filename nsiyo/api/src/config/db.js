import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let memoryServer = null

export async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nsiyo'
  mongoose.set('strictQuery', true)
  try {
    await mongoose.connect(mongoUri, { autoIndex: true })
  } catch (err) {
    if (process.env.USE_IN_MEMORY_DB === 'true' || mongoUri === 'memory') {
      memoryServer = await MongoMemoryServer.create()
      const uri = memoryServer.getUri()
      await mongoose.connect(uri, { autoIndex: true })
      return
    }
    throw err
  }
}


import mongoose from 'mongoose'

interface IConnectDb {
  url: string
}

export const connectDB = async ({url}: IConnectDb) => {
  try {
    await mongoose.connect(url)
    console.log('Connected to MongoDB using Mongoose')
    console.log(`Using database: ${mongoose.connection.name}`)
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    process.exit(1)
  }
}

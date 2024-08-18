import mongoose from 'mongoose'
import express from 'express'
import dotenv from 'dotenv'
import {connectDB} from './config/db'
import authRouter from './routes/authentication'
import productRoutes from './routes/products'
import cookieParser from 'cookie-parser'
import {authenticateUser} from './middleware/authenticated-user'

// secrets
dotenv.config()

// configurations
const app = express()
const PORT = process.env.PORT || ''
const MONGO_URI = process.env.MONGODB_URI || ''

// middleware
app.use(express.json())
app.use(cookieParser())

// routes
app.use('/auth', authRouter)
app.use('/api/products', productRoutes)

// main server entrypoint
const startServer = async (): Promise<void> => {
  try {
    await connectDB({url: MONGO_URI})
    app.listen(PORT, () => {
      console.log(`Server running on PORT: ${PORT}`)
    })
  } catch (error) {
    console.log('Failed to start server: ', error)
    if (error instanceof Error) {
      console.error('Error information: ', error.message)
      console.error('Stack trace: ', error.stack)
    }
    process.exit(1)
  }
}

startServer()

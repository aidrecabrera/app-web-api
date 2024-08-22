import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { connectDB } from './config/db'
import { authenticateUser } from './middleware/authenticated-user'
import authRoute from './routes/authentication'
import productRoute from './routes/products'
import userRoute from './routes/user'

// secrets
dotenv.config()

// configurations
const app = express()
const PORT = process.env.PORT || ''
const MONGO_URI = process.env.MONGODB_URI || ''

// middleware
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
)

// routes
app.use('/auth', authRoute)
app.use('/user', authenticateUser, userRoute)
app.use('/api/products', authenticateUser, productRoute)

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

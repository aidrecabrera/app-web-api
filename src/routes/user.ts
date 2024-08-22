import { fetchUser } from '@/controllers/user/user'
import express from 'express'

const userRoute = express.Router()
userRoute.get('/', fetchUser)
export default userRoute

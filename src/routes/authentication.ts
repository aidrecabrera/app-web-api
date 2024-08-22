import { loginUser } from '@/controllers/authentication/login'
import { logoutUser } from '@/controllers/authentication/logout'
import { refreshToken } from '@/controllers/authentication/refresh'
import { registerUser } from '@/controllers/authentication/register'
import { checkAuthStatus } from '@/controllers/authentication/status'
import { authenticateUser } from '@/middleware/authenticated-user'
import express from 'express'
import { body } from 'express-validator'

const authRouter = express.Router()

const validateRegister = [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password')
    .isLength({min: 6})
    .withMessage('Password must be at least 6 characters long'),
]

authRouter.post('/login', loginUser)
authRouter.post('/logout', logoutUser)
authRouter.post('/refresh', refreshToken)
authRouter.post('/register', validateRegister, registerUser)
authRouter.get('/status', authenticateUser, checkAuthStatus)
export default authRouter
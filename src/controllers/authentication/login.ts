import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '@/config/secrets'
import User from '@/models/user'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

interface ILoginUser {
  email: string
  password: string
}

export const loginUser = async (req: Request, res: Response) => {
  try {
    const {email, password} = req.body as unknown as ILoginUser
    // check the user
    const user = await User.findOne({email})
    if (!user) {
      return res.status(401).json({error: 'Invalid credentials'})
    }
    // check password credential
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({error: 'Invalid credentials'})
    }
    // generate access and refresh tokens
    const token = jwt.sign({userId: user._id}, ACCESS_TOKEN_SECRET, {
      expiresIn: '15m',
    })
    const refreshToken = jwt.sign({userId: user._id}, REFRESH_TOKEN_SECRET, {
      expiresIn: '7d',
    })
    // set cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 min
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    res.json({userId: user._id, message: 'Login successful'})
  } catch (error) {
    console.error('Error logging in user', error)
    res.status(500).json({
      error: 'Failed to log in',
    })
  }
}

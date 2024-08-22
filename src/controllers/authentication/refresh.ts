import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '@/config/secrets'
import User from '@/models/user'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export const refreshToken = async (req: Request, res: Response) => {
  console.log('Cookies:', req.cookies)
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    return res.status(401).json({error: 'Refresh token not provided'})
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as {
      userId: string
    }
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(401).json({error: 'User not found'})
    }

    const token = jwt.sign({userId: user._id}, ACCESS_TOKEN_SECRET, {
      expiresIn: '15m',
    })

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    })

    res.json({message: 'Token refreshed successfully'})
  } catch (error) {
    console.error('Error refreshing token:', error)
    res.status(403).json({error: 'Invalid refresh token'})
  }
}

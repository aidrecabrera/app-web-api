import {Request, Response, NextFunction} from 'express'
import jwt, {JsonWebTokenError, TokenExpiredError} from 'jsonwebtoken'
import User from '@/models/user'
import {AuthenticatedRequest} from '@/types/auth-request'
import {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} from '@/config/secrets'

interface DecodedToken {
  userId: string
}

const handleAuthError = (res: Response, message: string) => {
  return res.status(401).json({error: message})
}

const handleServerError = (res: Response, message: string) => {
  return res
    .status(500)
    .json({error: 'Internal server error', details: message})
}

const verifyToken = (token: string, secret: string): DecodedToken | null => {
  try {
    return jwt.verify(token, secret) as DecodedToken
  } catch (error) {
    return null
  }
}

const findUserById = async (userId: string) => {
  return await User.findById(userId)
}

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.accessToken
  const refreshToken = req.cookies.refreshToken

  if (!accessToken && !refreshToken) {
    return handleAuthError(res, 'No token provided, authentication failed.')
  }

  let decoded = verifyToken(accessToken, ACCESS_TOKEN_SECRET)

  if (decoded) {
    const user = await findUserById(decoded.userId)
    if (user) {
      req.user = user
      return next()
    }
    return handleAuthError(res, 'Invalid token: User not found.')
  }

  if (!refreshToken) {
    return handleAuthError(res, 'Authentication failed, no valid token found.')
  }

  decoded = verifyToken(refreshToken, REFRESH_TOKEN_SECRET)

  if (!decoded) {
    return handleAuthError(res, 'Invalid refresh token.')
  }

  const user = await findUserById(decoded.userId)
  if (!user) {
    return handleAuthError(res, 'Invalid refresh token: User not found.')
  }

  const newAccessToken = jwt.sign({userId: user._id}, ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  })

  res.cookie('accessToken', newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
  })

  req.user = user
  next()
}

import {Request, Response} from 'express'

export const logoutUser = (req: Request, res: Response): void => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  }

  // Clear access token and refresh token cookies
  res.clearCookie('accessToken', cookieOptions)
  res.clearCookie('refreshToken', cookieOptions)

  res.status(200).json({message: 'Logged out successfully'})
}

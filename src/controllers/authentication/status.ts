import { AuthenticatedRequest } from '@/types/auth.types'
import { Response } from 'express'

export const checkAuthStatus = (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }
    
    // return non-sensitive user data
    const { email, _id } = req.user
    res.status(200).json({
      user: { email, id: _id }
    })
  } catch (error) {
    console.error('Error checking auth status:', error)
    res.status(500).json({ message: 'Error checking auth status' })
  }
}
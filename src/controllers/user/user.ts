import { AuthenticatedRequest } from '@/types/auth.types'
import { Response } from 'express'

export const fetchUser = (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({message: 'Unauthorized'})
      return
    }
    const {email} = req.user
    res.status(200).json({
      user: email,
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({message: 'Error fetching user'})
  }
}

import {Request} from 'express'

export interface UserPayload {
  // biome-ignore lint/suspicious/noExplicitAny:
  _id: any
  email: string
  password: string
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload
}

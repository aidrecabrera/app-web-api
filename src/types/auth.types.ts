import {Request} from 'express'

export interface AuthenticatedRequest extends Request {
  // biome-ignore lint/suspicious/noExplicitAny:
  user?: any
}

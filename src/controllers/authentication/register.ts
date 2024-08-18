import User from '@/models/user'
import {Request, Response} from 'express'
import {validationResult} from 'express-validator'
import bcrpyt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} from '@/config/secrets'

interface IRegisterUser {
  email: string
  password: string
}

export const registerUser = async (req: Request, res: Response) => {
  try {
    const {email, password} = req.body as IRegisterUser
    // validate registration input
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      })
    }
    // check existing user
    const existingUser = await User.findOne({email})
    if (existingUser) {
      return res.status(400).json({error: 'Email already in use'})
    }
    // hash the password
    const hashedPassword = await bcrpyt.hash(password, 10)
    // create the user
    const result = await User.create({email, password: hashedPassword})
    // generate tokens
    const accessToken = jwt.sign({userId: result._id}, ACCESS_TOKEN_SECRET, {
      expiresIn: '15m',
    })
    const refreshToken = jwt.sign({userId: result._id}, REFRESH_TOKEN_SECRET, {
      expiresIn: '7d',
    })
    // set cookies
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    return res.status(201).json({
      message: 'User registered successfully',
      userId: result._id,
    })
  } catch (error) {
    console.error('Error registering user:', error)
    return res
      .status(500)
      .json({error: 'An error occurred during registration'})
  }
}

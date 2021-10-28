import config from '../config'
import { User } from '../resources/user/user.model'
import jwt from 'jsonwebtoken'

export const newToken = user => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

export const signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'Email and password required' })
  }
  try {
    const email = req.body.email
    const password = req.body.password
    const user = await User.create({
      email,
      password
    })
    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (e) {
    console.error(e)
    return res.status(400).end()
  }
}

export const signin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'email and password required' })
  }
  const email = req.body.email
  const password = req.body.password
  try {
    let user = await User.findOne({ email }).exec()
    if (!user) {
      return res.status(401).send({ message: 'user must be real' })
    }
    if (await user.checkPassword(password)) {
      const token = newToken(user)
      return res.status(201).send({ token })
    }
    return res.status(401).send({ message: 'passwords must match' })
  } catch (e) {
    console.error(e)
  }
}

export const protect = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).end()
  }
  if (req.headers.authorization.slice(0, 7) !== 'Bearer ') {
    return res.status(401).end()
  }
  try {
    const token = req.headers.authorization.slice(7)
    const payload = await verifyToken(token)
    const newUser = await User.findById(payload.id)
      .select('-password')
      .lean()
      .exec()
    req.user = newUser
    next()
  } catch (e) {
    console.error(e)
    return res.status(401).end()
  }
}

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { asyncHandler } = require('../utils/asyncHandler.utils')
const { validationResult } = require('express-validator')
const { throwError } = require('../utils/throwError.utils')
const User = require('../models/user.model')

exports.signup = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    throwError('Validation failed!', 422)
  }

  const { email, name, password } = req.body

  const hashedPassword = await bcrypt.hash(password, 12)
  if (!hashedPassword) throwError('Something went wrong.', 500)

  const user = new User({ email, password: hashedPassword, name })
  await user.save()

  return res.status(201).json({ message: 'User created.', userId: user._id })
})

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user) throwError('Incorrect email or password.', 401)

  const comparePassword = await bcrypt.compare(password, user.password)

  if (!comparePassword) throwError('Incorrect email or password.', 401)

  // generate new jwt token
  const token = jwt.sign(
    { email, userId: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )

  return res.status(200).json({ token, userId: user._id.toString() })
})

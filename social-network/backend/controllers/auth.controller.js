const bcrypt = require('bcryptjs')
const { asyncHandler } = require('../utils/asyncHandler.utils')
const { validationResult } = require('express-validator')
const { throwError } = require('../utils/throwError.utils')
const User = require('../models/user.model')

exports.signup = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    console.log(errors.array())
    throwError('Validation failed!', 422)
  }

  const { email, name, password } = req.body

  const hashedPassword = await bcrypt.hash(password, 12)
  if (!hashedPassword) throwError('Something went wrong.', 500)

  const user = new User({ email, password: hashedPassword, name })
  await user.save()

  return res.status(201).json({ message: 'User created.', userId: user._id })
})

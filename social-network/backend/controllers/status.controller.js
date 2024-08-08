const { asyncHandler } = require('../utils/asyncHandler.utils')
const { validationResult } = require('express-validator')
const { throwError } = require('../utils/throwError.utils')

// model
const User = require('../models/user.model')

/**
 * @method GET
 * @route /status
 * @access Private
 */
exports.getStatus = asyncHandler(async (req, res, next) => {
  const { userId } = req

  const user = await User.findById(userId)
  if (!user) throwError('User not found.', 404)

  return res.json({ status: user.status })
})

/**
 * @method POST
 * @route /status
 * @access Private
 */
exports.updateStatus = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) throwError('Invalid status')

  const { status } = req.body

  const user = await User.findById(req.userId)
  if (!user) throwError('User not found.', 404)

  user.status = status
  await user.save()

  return res.status(200).json({ message: 'Status updated.' })
})

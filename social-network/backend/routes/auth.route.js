const { Router } = require('express')
const { body } = require('express-validator')
const { throwError } = require('../utils/throwError.utils')
const User = require('../models/user.model')

// controllers
const { signup } = require('../controllers/auth.controller')

const router = Router()

router.post(
  '/signup',
  [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value })

        if (user) return Promise.reject('Email is already in use.')

        return true
      })
      .normalizeEmail(),
    body('password').isLength({ min: 5 }),
    body('name').trim().not().isEmpty().withMessage('Name cannot be empty.'),
  ],
  signup
)

module.exports = router

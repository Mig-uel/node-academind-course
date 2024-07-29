const { Router } = require('express')
const { check, body } = require('express-validator')
const User = require('../models/user.models')

// controllers
const {
  getLogin,
  login,
  logout,
  getSignUp,
  signup,
  getResetPasswordRequest,
  resetPasswordRequest,
  getResetPassword,
  resetPassword,
} = require('../controllers/auth.controller')

const authRouter = Router()

authRouter.route('/login').get(getLogin).post(login)
authRouter.route('/logout').get(logout)
authRouter
  .route('/signup')
  .get(getSignUp)
  .post(
    [
      check('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom(async (value, { req }) => {
          const userExists = await User.findOne({ email: req.body.email })
          if (userExists) throw new Error('Email is already in use')
          return true
        }),
      body('password', 'Password must be at least 5 characters').isLength({
        min: 5,
      }),
      body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password)
          throw new Error('Passwords do not match')

        return true
      }),
    ],
    signup
  )
authRouter
  .route('/resetpassword')
  .get(getResetPasswordRequest)
  .post(resetPasswordRequest)
authRouter.route('/reset/:token').get(getResetPassword)
authRouter.route('/reset').post(resetPassword)

module.exports = { authRouter }

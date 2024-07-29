const { Router } = require('express')
const { check, body } = require('express-validator')

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
      check('email').isEmail().withMessage('Please enter a valid email'),
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

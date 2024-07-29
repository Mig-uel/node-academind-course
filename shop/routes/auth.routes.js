const { Router } = require('express')
const { check } = require('express-validator')

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
    check('email').isEmail().withMessage('Please enter a valid email'),
    signup
  )
authRouter
  .route('/resetpassword')
  .get(getResetPasswordRequest)
  .post(resetPasswordRequest)
authRouter.route('/reset/:token').get(getResetPassword)
authRouter.route('/reset').post(resetPassword)

module.exports = { authRouter }

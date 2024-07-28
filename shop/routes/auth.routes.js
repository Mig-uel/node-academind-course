const { Router } = require('express')

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
} = require('../controllers/auth.controller')

const authRouter = Router()

authRouter.route('/login').get(getLogin).post(login)
authRouter.route('/logout').get(logout)
authRouter.route('/signup').get(getSignUp).post(signup)
authRouter
  .route('/resetpassword')
  .get(getResetPasswordRequest)
  .post(resetPasswordRequest)
authRouter.route('/reset/:token').get(getResetPassword)

module.exports = { authRouter }

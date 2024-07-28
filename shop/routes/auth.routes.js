const { Router } = require('express')

// controllers
const {
  getLogin,
  login,
  logout,
  getSignUp,
  signup,
  getResetPassword,
  resetPassword,
} = require('../controllers/auth.controller')

const authRouter = Router()

authRouter.route('/login').get(getLogin).post(login)
authRouter.route('/logout').get(logout)
authRouter.route('/signup').get(getSignUp).post(signup)
authRouter.route('/reset').get(getResetPassword).post(resetPassword)

module.exports = { authRouter }

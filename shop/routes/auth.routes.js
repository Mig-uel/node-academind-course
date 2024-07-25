const { Router } = require('express')

// controllers
const {
  getLogin,
  login,
  logout,
  getSignUp,
  signup,
} = require('../controllers/auth.controller')

const authRouter = Router()

authRouter.route('/login').get(getLogin).post(login)
authRouter.route('/logout').get(logout)
authRouter.route('/signup').get(getSignUp).post(signup)

module.exports = { authRouter }

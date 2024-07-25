const { Router } = require('express')

// controllers
const { getLogin, login, logout } = require('../controllers/auth.controller')

const authRouter = Router()

authRouter.route('/login').get(getLogin).post(login)
authRouter.route('/logout').get(logout)

module.exports = { authRouter }

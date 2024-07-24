const { Router } = require('express')

// controllers
const { getLogin } = require('../controllers/auth.controller')

const authRouter = Router()

authRouter.route('/login').get(getLogin).post()

module.exports = { authRouter }

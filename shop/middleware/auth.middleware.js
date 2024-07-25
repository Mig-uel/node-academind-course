const User = require('../models/user.models')

const csrfMiddleware = async (req, res, next) => {
  res.locals.authorized = req.session.authorized
  res.locals.csrfToken = req.csrfToken()
  next()
}

const isAuthenticated = async (req, res, next) => {
  if (req.session.user) return next()

  return res.redirect('/auth/login')
}

const hydrateUser = async (req, res, next) => {
  if (req.session.user) {
    req.session.user = new User().init(req.session.user)
  }

  next()
}

module.exports = { isAuthenticated, hydrateUser, csrfMiddleware }

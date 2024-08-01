const User = require('../models/user.models')

const isAuthenticated = async (req, res, next) => {
  if (req.authorized) return next()

  return res.redirect('/auth/login')
}

const hydrateUser = async (req, res, next) => {
  if (!req.session.user) return next()

  const user = await User.findById(req.session.user)

  req.user = user
  req.authorized = true

  next()
}

module.exports = { isAuthenticated, hydrateUser }

const User = require('../models/user.models')

const isAuthenticated = async (req, res, next) => {
  if (!req.session.authorized) return res.redirect('/auth/login')

  next()
}

const hydrateUser = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return next()
    }

    const user = await User.findById(req.session.user)

    if (!user) return next()

    req.user = user
    req.authorized = true

    next()
  } catch (error) {
    return next(error)
  }
}

module.exports = { isAuthenticated, hydrateUser }

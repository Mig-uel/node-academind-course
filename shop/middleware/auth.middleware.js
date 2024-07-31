const User = require('../models/user.models')

const isAuthenticated = async (req, res, next) => {
  if (req.session.user) return next()

  return res.redirect('/auth/login')
}

const hydrateUser = async (req, res, next) => {
  if (req.session.user) {
    const user = await User.findById(req.session.user)

    req.session.user = user
    req.session.authorized = true

    await req.session.save()
  }

  next()
}

module.exports = { isAuthenticated, hydrateUser }

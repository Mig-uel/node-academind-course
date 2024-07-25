const isAuthenticated = async (req, res, next) => {
  if (req.user) return next()
  else {
    console.log('Not authorized')
    return res.redirect('/auth/login')
  }
}

module.exports = { isAuthenticated }

const use404 = (req, res, next) =>
  res.status(404).render('404', {
    docTitle: 'Page Not Found',
    isAuthenticated: req.cookies.loggedIn,
  })

module.exports = { use404 }

const getLogin = async (req, res) => {
  return res.render('auth/login', {
    path: '/login',
    docTitle: 'Login',
  })
}

module.exports = { getLogin }

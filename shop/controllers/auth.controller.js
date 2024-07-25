const getLogin = async (req, res) => {
  if (req.session.authorized) {
    return res.redirect('/')
  }

  return res.render('auth/login', {
    path: '/login',
    docTitle: 'Login',
  })
}

const login = async (req, res) => {
  try {
    req.session.authorized = true

    return res.redirect('/')
  } catch (error) {
    console.log(error)
  }
}

const logout = async (req, res) => {
  try {
    return res.redirect('/')
  } catch (error) {
    console.log(error)
  }
}

module.exports = { getLogin, login, logout }

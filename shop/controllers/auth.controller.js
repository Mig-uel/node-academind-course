const getLogin = async (req, res) => {
  const loggedIn = req.cookies.loggedIn

  return res.render('auth/login', {
    path: '/login',
    docTitle: 'Login',
    isAuthenticated: loggedIn,
  })
}

const login = async (req, res) => {
  try {
    res.cookie('loggedIn', 'true')

    return res.redirect('/')
  } catch (error) {
    console.log(error)
  }
}

const logout = async (req, res) => {
  try {
    const cookie = req.cookies.loggedIn
    res.cookie('loggedIn', '', { maxAge: Date.now() })

    console.log(cookie)
    return res.redirect('/')
  } catch (error) {
    console.log(error)
  }
}

module.exports = { getLogin, login, logout }

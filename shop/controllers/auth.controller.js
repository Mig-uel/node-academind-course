const User = require('../models/user.models')

const getLogin = async (req, res) => {
  if (req.session.authorized) {
    return res.redirect('/')
  }

  return res.render('auth/login', {
    path: '/login',
    docTitle: 'Login',
    isAuthenticated: req.session.user,
  })
}

const login = async (req, res) => {
  try {
    const user = await User.findById('66a02ed53e6b9281c2e26289')

    req.session.authorized = true
    req.session.user = user

    return res.redirect('/')
  } catch (error) {
    console.log(error)
  }
}

const logout = async (req, res) => {
  try {
    req.session.destroy()
    return res.redirect('/')
  } catch (error) {
    console.log(error)
  }
}

const getSignUp = async (req, res) => {
  if (req.session.authorized) {
    return res.redirect('/')
  }

  return res.render('auth/signup', {
    path: '/signup',
    docTitle: 'Sign Up',
    isAuthenticated: req.session.user,
  })
}
const signup = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) return res.redirect('/auth/signup')

    const user = new User({ email, password, cart: { items: [] } })

    await user.save()

    return res.redirect('/auth/login')
  } catch (error) {
    console.log(error)
  }
}

module.exports = { getLogin, login, logout, getSignUp, signup }

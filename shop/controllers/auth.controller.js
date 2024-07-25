const bcrypt = require('bcryptjs')
const User = require('../models/user.models')

const getLogin = async (req, res) => {
  if (req.session.authorized) {
    return res.redirect('/')
  }

  return res.render('auth/login', {
    path: '/login',
    docTitle: 'Login',
    isAuthenticated: req.session.user,
    error: req.flash('error'),
  })
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      req.flash('error', 'Invalid email or password')
      return res.redirect('/auth/login')
    }

    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) return res.redirect('/auth/login')

    req.session.user = user
    req.session.authorized = true
    await req.session.save()

    return res.redirect('/')
  } catch (error) {
    console.log(error)
    return res.send(`<h1>${error}</h1>`)
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

    req.session.user = user
    req.session.authorized = true

    return res.redirect('/')
  } catch (error) {
    console.log(error)
  }
}

module.exports = { getLogin, login, logout, getSignUp, signup }

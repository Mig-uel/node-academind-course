const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const User = require('../models/user.models')
const { sendMail } = require('../utils/email.utils')

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
    if (!checkPassword) {
      req.flash('error', 'Invalid email or password')
      return res.redirect('/auth/login')
    }

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
    error: req.flash('error'),
  })
}
const signup = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
      req.flash('error', 'Email is already in use')
      return res.redirect('/auth/signup')
    }

    const user = new User({ email, password, cart: { items: [] } })
    await user.save()

    req.session.user = user
    req.session.authorized = true

    await sendMail(
      user.email,
      'Account Created',
      `Your account ${user.email} has been successfully created!`
    )

    return res.redirect('/')
  } catch (error) {
    console.log(error)
  }
}

const getResetPassword = async (req, res) => {
  return res.render('auth/reset', {
    path: '/reset',
    docTitle: 'Reset Password',
    isAuthenticated: req.session.user,
    error: req.flash('error'),
  })
}

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      req.flash(
        'error',
        'If the email address you provided is associated with an account, you will receive instructions to reset your password.'
      )
      return res.redirect('/auth/reset')
    }

    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        console.log(err)
        req.flash('error', 'Something went wrong, please try again later.')
        return res.redirect('/reset')
      }

      const token = buffer.toString('hex')
      user.resetToken = token
      user.resetTokenExp = Date.now() + 3600000
      return user
        .save()
        .then((result) => {
          req.flash(
            'error',
            'If the email address you provided is associated with an account, you will receive instructions to reset your password.'
          )
          sendMail(
            user.email,
            'Password Reset',
            `You requested a password reset.
            Click this <a href='http://localhost:3000/auth/reset/${token}'>link</a> to reset your password.`
          ).then((result) => res.redirect('/auth/reset'))
        })
        .catch((err) => console.log(err))
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getLogin,
  login,
  logout,
  getSignUp,
  signup,
  getResetPassword,
  resetPassword,
}

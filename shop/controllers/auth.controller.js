const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const User = require('../models/user.models')
const { sendMail } = require('../utils/email.utils')

const getLogin = async (req, res) => {
  if (req.session.authorized) {
    return res.redirect('/')
  }

  // validation
  const errors = validationResult(req)

  return res.render('auth/login', {
    path: '/login',
    docTitle: 'Login',
    isAuthenticated: req.session.user,
    errors: errors.array(),
  })
}

const login = async (req, res) => {
  try {
    // validation
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.render('auth/login', {
        path: '/login',
        docTitle: 'Login',
        isAuthenticated: req.session.user,
        errors: errors.array(),
      })
    }

    const { user } = req

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

  // validation
  const errors = validationResult(req)

  return res.render('auth/signup', {
    path: '/signup',
    docTitle: 'Sign Up',
    isAuthenticated: req.session.user,
    errors: errors.array(),
  })
}
const signup = async (req, res) => {
  try {
    const { email, password } = req.body

    // validation
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(422).render('auth/signup', {
        path: '/signup',
        docTitle: 'Sign Up',
        isAuthenticated: req.session.user,
        errors: errors.array(),
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = new User({
      email,
      password: hashedPassword,
      cart: { items: [] },
    })
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

const getResetPasswordRequest = async (req, res) => {
  return res.render('auth/reset-password-request', {
    path: '/login',
    docTitle: 'Reset Password',
    isAuthenticated: req.session.user,
    error: req.flash('error'),
  })
}

const resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      req.flash(
        'error',
        'If the email address you provided is associated with an account, you will receive instructions to reset your password.'
      )
      return res.redirect('/auth/resetpassword')
    }

    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        console.log(err)
        req.flash('error', 'Something went wrong, please try again later.')
        return res.redirect('/resetpassword')
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
          ).then((result) => res.redirect('/auth/resetpassword'))
        })
        .catch((err) => console.log(err))
    })
  } catch (error) {
    console.log(error)
  }
}

const getResetPassword = async (req, res) => {
  const { token } = req.params
  const user = await User.findOne({
    resetToken: token,
    resetTokenExp: { $gt: Date.now() },
  })

  if (!user) {
    req.flash(
      'error',
      'The password reset link has expired, please request a new password reset link.'
    )
    return res.redirect('/auth/resetpassword')
  }

  return res.render('auth/reset', {
    path: '/login',
    docTitle: 'Reset Password',
    isAuthenticated: req.session.user,
    error: req.flash('error'),
    userId: user._id.toString(),
    resetToken: token,
  })
}

const resetPassword = async (req, res) => {
  try {
    const { userId, password, confirmPassword, resetToken } = req.body

    const user = await User.findOne({
      resetToken,
      resetTokenExp: { $gt: Date.now() },
      _id: userId,
    })

    if (password !== confirmPassword) {
      req.flash('error', 'Passwords must match. Please try again.')
      res.redirect(`/auth/reset/${resetToken}`)
    }

    user.password = await bcrypt.hash(password, 12)
    user.resetToken = null
    user.resetTokenExp = undefined
    await user.save()

    req.flash('Password has been reset.')
    return res.redirect('/auth/login')
  } catch (error) {
    req.flash('error', 'Invalid session')
    return res.redirect('/auth/resetpassword')
  }
}

module.exports = {
  getLogin,
  login,
  logout,
  getSignUp,
  signup,
  getResetPasswordRequest,
  resetPasswordRequest,
  getResetPassword,
  resetPassword,
}

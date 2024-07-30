const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const User = require('../models/user.models')
const { sendMail } = require('../utils/email.utils')
const path = require('path')

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

const login = async (req, res, next) => {
  try {
    // validation
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(422).render('auth/login', {
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
    return next(error)
  }
}

const logout = async (req, res, next) => {
  try {
    req.session.destroy()

    return res.redirect('/')
  } catch (error) {
    return next(error)
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
    prevInput: { email: '' },
  })
}
const signup = async (req, res, next) => {
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
        prevInput: { email },
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
    return next(error)
  }
}

const getResetPasswordRequest = async (req, res) => {
  // validation
  const errors = validationResult(req)

  return res.render('auth/reset-password-request', {
    path: '/login',
    docTitle: 'Reset Password',
    isAuthenticated: req.session.user,
    errors: errors.array(),
  })
}

const resetPasswordRequest = async (req, res, next) => {
  try {
    // validation
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.render('auth/reset-password-request', {
        path: '/login',
        docTitle: 'Reset Password',
        isAuthenticated: req.session.user,
        errors: errors.array(),
      })
    }

    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      const error = new Error()
      error.name = 'EmailNotFound'

      throw error
    }

    crypto.randomBytes(32, (err, buffer) => {
      if (err) throw new Error('Something went wrong!')

      const token = buffer.toString('hex')
      user.resetToken = token
      user.resetTokenExp = Date.now() + 3600000

      return user.save().then((result) => {
        sendMail(
          user.email,
          'Password Reset',
          `You requested a password reset.
            Click this <a href='http://localhost:3000/auth/reset/${token}'>link</a> to reset your password.`
        ).then((result) =>
          res.status(200).render('info', {
            docTitle: 'Email sent',
            path: '',
            isAuthenticated: req.session.authorized,
            errors: [],
            infos: [
              {
                msg: 'If the email address you provided is associated with an account, you will receive instructions to reset your password.',
              },
            ],
          })
        )
      })
    })
  } catch (error) {
    return next(error)
  }
}

const getResetPassword = async (req, res, next) => {
  try {
    const { token } = req.params
    const user = await User.findOne({
      resetToken: token,
      resetTokenExp: { $gt: Date.now() },
    })

    if (!user)
      throw new Error(
        'The password reset link has expired, please request a new link.'
      )

    // validation
    const errors = validationResult(req)

    return res.render('auth/reset', {
      path: '/login',
      docTitle: 'Reset Password',
      isAuthenticated: req.session.user,
      userId: user._id.toString(),
      resetToken: token,
      errors: errors.array(),
    })
  } catch (error) {
    return next(error)
  }
}

const resetPassword = async (req, res, next) => {
  try {
    const { userId, password, resetToken } = req.body

    const user = await User.findOne({
      resetToken,
      resetTokenExp: { $gt: Date.now() },
      _id: userId,
    })

    if (!user)
      throw new Error(
        'The password reset link has expired, please request a new link.'
      )

    // validation
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.render('auth/reset', {
        path: '/login',
        docTitle: 'Reset Password',
        isAuthenticated: req.session.user,
        userId: user._id.toString(),
        resetToken,
        errors: errors.array(),
      })
    }

    user.password = await bcrypt.hash(password, 12)
    user.resetToken = null
    user.resetTokenExp = undefined

    await user.save()

    return res.render('info', {
      docTitle: 'Success',
      path: '',
      infos: [{ msg: 'Password has been reset successfully' }],
      isAuthenticated: req.session.authorized,
      errors: [],
    })
  } catch (error) {
    console.log(error)
    return next(error)
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

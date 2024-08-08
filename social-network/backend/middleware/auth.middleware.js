const jwt = require('jsonwebtoken')
const { asyncHandler } = require('../utils/asyncHandler.utils')

exports.isAuth = asyncHandler(async (req, res, next) => {
  // retrieve 'authorization' header from request
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    req.isAuth = false
    next()
  }

  // get token from header
  const token = authHeader.split(' ')[1]

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

  if (!decodedToken) {
    req.isAuth = false
    next()
  }

  req.userId = decodedToken.userId
  req.isAuth = true

  next()
})

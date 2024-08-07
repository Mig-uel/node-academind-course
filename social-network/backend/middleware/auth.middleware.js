const jwt = require('jsonwebtoken')
const { asyncHandler } = require('../utils/asyncHandler.utils')
const { throwError } = require('../utils/throwError.utils')

exports.isAuth = asyncHandler(async (req, res, next) => {
  // retrieve 'authorization' header from request
  const authHeader = req.get('Authorization')
  if (!authHeader) throwError('Unauthorized.', 401)

  // get token from header
  const token = authHeader.split(' ')[1]

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

  if (!decodedToken) throwError('Unauthorized.', 401)

  req.userId = decodedToken.userId

  next()
})

const errorHandler = (error, req, res, next) => {
  const status = error.statusCode || 500
  const { message } = error
  const stack = process.env.NODE_ENV === 'dev' ? error.stack : '🥞'

  return res.status(status).json({ status, message, stack })
}

module.exports = { errorHandler }

const errorHandler = (error, req, res, next) => {
  let status = error.statusCode || 500

  console.dir(JSON.stringify(error, null, 2))

  if (error.name === 'CastError') {
    return res.status(status).render('500', {
      docTitle: 'Internal Server Error',
      path: '',
      isAuthenticated: req.session.authorized,
      errors: [{ msg: 'Invalid Product ID' }],
    })
  }

  return res.status(status).render('500', {
    docTitle: 'Internal Server Error',
    path: '',
    isAuthenticated: req.session.authorized,
    errors: [{ msg: error.message }],
  })
}

module.exports = { errorHandler }

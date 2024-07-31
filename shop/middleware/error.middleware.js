const errorHandler = (error, req, res, next) => {
  let status = error.statusCode || 500

  console.dir(JSON.stringify(error, null, 2))

  if (error.name === 'CastError') {
    return res.status(status).render('500', {
      docTitle: 'Internal Server Error',
      path: '',
      isAuthenticated: req.session.authorized,
      errors: [{ msg: 'Invalid Product ID' }],
      email: req?.session?.user?.email,
    })
  }

  if (error.name === 'EmailNotFound') {
    return res.status(200).render('info', {
      docTitle: 'Email sent',
      path: '',
      isAuthenticated: req.session.authorized,
      errors: [],
      infos: [
        {
          msg: 'If the email address you provided is associated with an account, you will receive instructions to reset your password.',
        },
      ],
      email: req?.session?.user?.email,
    })
  }

  return res.status(status).render('500', {
    docTitle: 'Internal Server Error',
    path: '',
    isAuthenticated: req.session.authorized,
    errors: [{ msg: error.message }],
    email: req?.session?.user?.email,
  })
}

module.exports = { errorHandler }

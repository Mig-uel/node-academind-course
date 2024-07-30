const use404 = (req, res, next) =>
  res.status(404).render('404', {
    docTitle: 'Page Not Found',
  })

const use500 = (req, res, next) =>
  res.status(500).render('500', { docTitle: 'Internal Server Error' })

module.exports = { use404, use500 }

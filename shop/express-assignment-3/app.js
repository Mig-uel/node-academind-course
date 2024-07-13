const path = require('path')
const express = require('express')

const app = express()
const users = []

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.redirect(302, '/users'))

app
  .route('/users')
  .get((req, res) => res.render('index', { users, docTitle: 'Users' }))
  .post((req, res) => {
    const {
      body: { name },
    } = req

    users.push({ name })

    return res.redirect('/users')
  })

app.use((req, res, next) => res.render('404', { docTitle: 'Page Not Found' }))

app.listen(3500, () => {
  console.log('Express Assignment 3 - Running...')
})

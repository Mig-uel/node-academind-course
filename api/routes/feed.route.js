const { Router } = require('express')

// feed controllers
const { getPosts, addPost } = require('../controllers/feed.controller')

// init router obj
const router = Router()

router.get('/posts', getPosts)
router.post('/posts', addPost)

module.exports = router

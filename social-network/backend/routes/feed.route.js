const { Router } = require('express')
const { body } = require('express-validator')

// feed controllers
const { getPosts, addPost } = require('../controllers/feed.controller')

// init router obj
const router = Router()

// GET /feed/posts
router.get('/posts', getPosts)

// POST /feed/posts
router.post(
  '/posts',
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  addPost
)

module.exports = router

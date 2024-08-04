const { Router } = require('express')

// feed controllers
const { getPosts } = require('../controllers/feed.controller')

// init router obj
const router = Router()

/**
 * @method GET
 * @route /feed/posts
 */
router.get('/posts', getPosts)

module.exports = router

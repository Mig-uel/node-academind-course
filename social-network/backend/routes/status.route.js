const { Router } = require('express')

// middleware
const { isAuth } = require('../middleware/auth.middleware')
const { body } = require('express-validator')

// controllers
const { getStatus, updateStatus } = require('../controllers/status.controller')

const router = Router()

router.get('/', isAuth, getStatus)
router.patch(
  '/',
  isAuth,
  [
    body('status')
      .trim()
      .isString()
      .not()
      .isEmpty()
      .withMessage('Status cannot be empty.')
      .not()
      .isURL()
      .withMessage('Status cannot contain URLs.'),
  ],
  updateStatus
)

module.exports = router

const multer = require('multer')

const destination = (req, file, cb) => {
  cb(null, 'images')
}

const filename = (req, file, cb) => {
  cb(null, `${Date.now()}-${file.originalname}`)
}

const storage = multer.diskStorage({
  destination,
  filename,
})

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  )
    cb(null, true)
  else {
    cb(null, false)
  }
}

module.exports = { storage, fileFilter }

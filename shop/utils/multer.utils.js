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

module.exports = { storage }

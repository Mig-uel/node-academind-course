const multer = require('multer')
const { v4: uuid } = require('uuid')

const destination = (req, file, cb) => {
  cb(null, 'images')
}

const filename = (req, file, cb) => {
  cb(null, uuid())
}

exports.fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  )
    cb(null, true)
  else cb(null, false)
}

exports.storage = multer.diskStorage({
  destination,
  filename,
})

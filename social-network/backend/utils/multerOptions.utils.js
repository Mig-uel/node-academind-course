const multer = require('multer')
const { v4: uuid } = require('uuid')

const destination = (req, file, cb) => {
  cb(null, 'images')
}

const filename = (req, file, cb) => {
  console.log(file)
  cb(null, `${uuid()}.${file.originalname.split('.')[1]}`)
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

const fs = require('fs')
const path = require('path')

const unlinkFile = (filePath) => {
  filePath = path.join(__dirname, '..', filePath)
  fs.unlink(filePath, (err) => console.log(err))
}

module.exports = { unlinkFile }

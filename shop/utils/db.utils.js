const mongoose = require('mongoose')

// mongodb uri
const uri = process.env.MONGO_URI

const db = async () => {
  try {
    const conn = await mongoose.connect(uri)
    return
  } catch (error) {
    console.log(error)
  }
}

module.exports = { db }

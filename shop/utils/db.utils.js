const mongoose = require('mongoose')

// mongodb uri
const uri = process.env.MONGO_URI

mongoose.connection.on('connected', () =>
  console.log(
    `CONNECTED TO MONGOOSE: ${mongoose.connection.name}`.green.inverse
  )
)

const db = async () => {
  try {
    const conn = await mongoose.connect(uri)

    return conn
  } catch (error) {
    console.log(error)
  }
}

module.exports = { db }

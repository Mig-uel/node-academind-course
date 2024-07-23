const mongoose = require('mongoose')

// mongodb uri
const uri = process.env.MONGO_URI

const db = async () => {
  try {
    const conn = await mongoose.connect(uri)

    console.log(`CONNECTED TO MONGOOSE: ${conn.connection.name}`.green.inverse)
  } catch (error) {
    console.log(error)
  }
}

module.exports = { db }

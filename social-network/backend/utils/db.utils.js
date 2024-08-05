const mongoose = require('mongoose')

// mongodb uri
const uri = process.env.MONGO_URI

const connectToDatabase = async () => {
  try {
    const conn = await mongoose.connect(uri)

    console.log(' x - - - - - - - - - - - - x')
    console.log(`CONNECTED TO MONGOOSE: ${conn.connection.name}`)
  } catch (error) {
    console.log(error)
  }
}

module.exports = { connectToDatabase }

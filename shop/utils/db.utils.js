const { MongoClient } = require('mongodb')

// mongodb uri
const uri = process.env.MONGO_URI

const client = new MongoClient(uri)

client.once('serverOpening', (e) => {
  console.log('CONNECTED TO MONGODB'.green.inverse)
})

const connectDB = async () => {
  try {
    const res = await client.connect()

    return res
  } catch (error) {
    console.log(error)
  }
}

module.exports = { connectDB }

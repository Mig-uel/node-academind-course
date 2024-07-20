const { MongoClient } = require('mongodb')

// mongodb uri
const uri = process.env.MONGO_URI

const client = new MongoClient(uri)

const connectDB = async () => {
  try {
    const res = await client.connect()

    return res
  } finally {
    await client.close()
  }
}

module.exports = { connectDB }

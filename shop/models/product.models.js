const { ObjectId } = require('mongodb')
const { connectDB } = require('../utils/db.utils')

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title
    this.price = price
    this.description = description
    this.imageUrl = imageUrl
  }

  async save() {
    try {
      const db = (await connectDB()).db()

      const res = await db.collection('products').insertOne(this)

      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  static async fetchAllProducts() {
    try {
      const db = (await connectDB()).db()

      return db.collection('products').find().toArray()
    } catch (error) {
      console.log(error)
    }
  }

  static async fetchProductById(id) {
    try {
      const db = (await connectDB()).db()

      const product = db
        .collection('products')
        .findOne({ _id: ObjectId.createFromHexString(id) })

      return product
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = { Product }

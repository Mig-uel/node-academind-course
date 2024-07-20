const { ObjectId } = require('mongodb')
const { connectDB } = require('../utils/db.utils')

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title
    this.price = price
    this.description = description
    this.imageUrl = imageUrl
    this._id = id ? ObjectId.createFromHexString(id) : null
    this._userId = userId || null
  }

  async save() {
    try {
      const db = (await connectDB()).db()

      if (this._id) {
        await db.collection('products').updateOne(
          { _id: this._id },
          {
            $set: this,
          }
        )
        return
      }

      const res = await db.collection('products').insertOne(this)

      return
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

  static async deleteByProductById(id) {
    try {
      const db = (await connectDB()).db()

      const objectId = ObjectId.createFromHexString(id)

      if (!ObjectId.isValid(objectId)) throw new Error()

      const res = await db.collection('products').deleteOne({ _id: objectId })

      return { product: res, error: null }
    } catch (error) {
      return { product: null, error }
    }
  }
}

module.exports = { Product }

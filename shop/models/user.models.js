const { connectDB } = require('../utils/db.utils')
const { ObjectId } = require('mongodb')

class User {
  constructor(username, email, id = null) {
    this.name = username
    this.email = email
    this._id = id ? ObjectId.createFromHexString(id) : id
  }

  async save() {
    try {
      const db = (await connectDB()).db()

      if (this._id) {
        const updatedUser = await db
          .collection('users')
          .updateOne({ _id: this._id }, { $set: this })

        return { user: updatedUser, error: null }
      }

      const user = await db.collection('users').insertOne(this)

      return { user, error: null }
    } catch (error) {
      return { user: null, error }
    }
  }

  static async findUserById(id) {
    try {
      const db = (await connectDB()).db()
      const objectId = ObjectId.createFromHexString(id)

      if (!ObjectId.isValid(objectId)) throw new Error()

      const user = await db.collection('users').findOne({ _id: objectId })

      return { user, error: null }
    } catch (error) {
      return { user: null, error }
    }
  }
}

module.exports = { User }

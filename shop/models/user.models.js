const { connectDB } = require('../utils/db.utils')
const { ObjectId } = require('mongodb')

class User {
  constructor(username, email, id, cart = { items: [] }) {
    this.name = username
    this.email = email
    this._id = id || null
    this.cart = cart
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

  async addToCart(product) {
    const { items } = this.cart

    try {
      const db = (await connectDB()).db()
      const existingItem = items.find(
        (i) => i.productId.toString() === product._id.toString()
      )

      if (existingItem) {
        this.cart.items = items.map((i) => {
          if (i.productId === existingItem.productId)
            return { ...existingItem, qty: existingItem.qty + 1 }
          else return i
        })
      } else {
        this.cart.items = [...items, { productId: product._id, qty: 1 }]
      }

      const addItem = await db
        .collection('users')
        .updateOne({ _id: this._id }, { $set: { cart: this.cart } })

      return addItem
    } catch (error) {}
  }

  async getCart() {
    try {
      const db = (await connectDB()).db()

      const cartItemIdArray = this.cart.items.map((i) => i.productId)

      const cart = await db
        .collection('products')
        .find({ _id: { $in: cartItemIdArray } })
        .toArray()

      const fullCart = cart.map((i) => ({
        ...i,
        qty: this.cart.items.find(
          (p) => i._id.toString() === p.productId.toString()
        ).qty,
      }))

      return fullCart
    } catch (error) {
      console.log(error)
    }
  }

  async deleteItemFromCart(id) {
    try {
      this.cart.items = this.cart.items.filter(
        (item) => item.productId.toString() !== id.toString()
      )

      const db = (await connectDB()).db()
      await db
        .collection('users')
        .updateOne({ _id: this._id }, { $set: { cart: this.cart } })
    } catch (error) {
      console.log(error)
    }
  }

  async addOrder() {
    try {
      const db = (await connectDB()).db()
      const cart = await this.getCart()

      const order = await db.collection('orders').insertOne({
        items: cart,
        user: { _id: this._id, name: this.name },
      })

      // update local and server cart
      await db
        .collection('users')
        .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } })
      this.cart = { items: [] }

      return
    } catch (error) {
      console.log(error)
    }
  }

  async getOrders() {
    try {
      const db = (await connectDB()).db()
      return await db.collection('orders')
    } catch (error) {}
  }
}

module.exports = { User }

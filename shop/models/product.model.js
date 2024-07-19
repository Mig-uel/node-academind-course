const { db } = require('../utils/db.utils')
const { Cart } = require('../models/cart.models')

class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title
    this.imageUrl = imageUrl
    this.description = description
    this.price = price
  }

  async save() {
    try {
      const sql =
        'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)'

      const res = await db.execute(queryString, [
        this.title,
        this.price,
        this.imageUrl,
        this.description,
      ])

      if (!res) throw new Error()

      return res
    } catch (error) {
      return error.message
    }
  }

  static async fetchAllProducts() {
    try {
      const queryString = 'SELECT * FROM products'
      const data = await db.execute(queryString)

      if (!data) throw new Error()

      return data[0]
    } catch (error) {
      return error.message
    }
  }

  static async findById(id) {
    try {
      const sql = 'SELECT * FROM PRODUCTS WHERE products.id = ?'
      const data = await db.execute(sql, [id])

      if (!data) throw new Error()

      return data[0][0]
    } catch (error) {
      return error.message
    }
  }

  static deleteById(id) {}
}

module.exports = { Product }

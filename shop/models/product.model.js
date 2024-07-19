const fs = require('fs')
const path = require('path')

const { v4: uuidv4, v4 } = require('uuid')
const { Cart } = require('../models/cart.models')

const pathName = path.join(__dirname, '..', 'data', 'products.json')

const getProductsFromFile = (callback) => {
  fs.readFile(pathName, (error, data) => {
    if (error) callback([])
    else {
      callback(JSON.parse(data))
    }
  })
}

class Product {
  constructor(title, imageUrl, description, price, id = v4()) {
    this.title = title
    this.imageUrl = imageUrl
    this.description = description
    this.price = price
    this.id = id
  }

  save() {
    getProductsFromFile((products) => {
      const existingProduct = products.find((p) => p.id === this.id)

      if (existingProduct) {
        products = products.map((p) => {
          if (p.id === existingProduct.id) return this
          else return p
        })
      } else {
        products.push(this)
      }

      fs.writeFile(pathName, JSON.stringify(products), (err) =>
        console.log(err)
      )
    })
  }

  static fetchAll(callback) {
    getProductsFromFile(callback)
  }

  static findById(id, callback) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id)

      callback(product)
    })
  }

  static deleteById(id) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id)
      products = products.filter((p) => p.id !== id)

      fs.writeFile(pathName, JSON.stringify(products), (err) => {
        if (!err) {
          Cart.deleteFromCart(id, product.price)
        }
      })
    })
  }
}

module.exports = { Product }

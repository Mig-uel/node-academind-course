const fs = require('fs')
const path = require('path')

const { v4: uuidv4, v4 } = require('uuid')

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
  constructor(title, imageUrl, description, price) {
    this.title = title
    this.imageUrl = imageUrl
    this.description = description
    this.price = price
  }

  save() {
    this.id = v4()
    getProductsFromFile((products) => {
      products.push(this)
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
}

module.exports = { Product }

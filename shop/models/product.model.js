const fs = require('fs')
const path = require('path')

class Product {
  static pathname = path.join(__dirname, '..', 'data', 'products.json')

  constructor(title) {
    this.title = title
  }

  save() {
    fs.readFile(Product.pathname, (err, data) => {
      let products = []

      if (!err) {
        products = JSON.parse(data)
      }

      products.push(this)

      fs.writeFile(Product.pathname, JSON.stringify(products), (err) => {
        console.log(err)
      })
    })
  }

  static fetchAll(callback) {
    fs.readFile(Product.pathname, (err, data) => {
      if (err) callback([])

      callback(JSON.parse(data))
    })
  }
}

module.exports = { Product }

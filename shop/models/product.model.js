const fs = require('fs')
const path = require('path')

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
}

module.exports = { Product }

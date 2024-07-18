const fs = require('fs')
const path = require('path')

const pathName = path.join(__dirname, '..', 'data', 'cart.json')

class Cart {
  static addProduct(id, price) {
    // fetch prev cart
    fs.readFile(pathName, (err, data) => {
      let cart = { products: [], totalPrice: 0 }

      if (!err) cart = JSON.parse(data)

      // analyze cart - find existing product
      const existingProduct = cart.products.find((p) => p.id === id)

      // add new product or increase qty
      if (existingProduct) {
        // update cart
        cart.products = cart.products.map((product) => {
          if (product.id === existingProduct.id)
            return { ...existingProduct, qty: existingProduct.qty + 1 }
          else return product
        })
      } else {
        // update cart
        cart.products = [...cart.products, { id, qty: 1 }]
      }

      // update total
      cart.totalPrice = Number(
        (Number(cart.totalPrice) + Number(price)).toFixed(2)
      )

      // save to file
      fs.writeFile(pathName, JSON.stringify(cart), (err) => console.log(err))
    })
  }
}

module.exports = { Cart }

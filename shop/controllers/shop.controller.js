const { Product } = require('../models/product.model')

const getProducts = async (req, res) => {
  Product.fetchAll((products) => {
    return res.render('shop', { products, docTitle: 'Shop', path: '/' })
  })
}

module.exports = { getProducts }

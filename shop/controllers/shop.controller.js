const { Product } = require('../models/product.model')

const getProducts = async (req, res) => {
  const products = Product.fetchAll()
  
  return res.render('shop', { products, docTitle: 'Shop', path: '/' })
}

module.exports = { getProducts }

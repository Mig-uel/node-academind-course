const { products } = require('../controllers/admin.controller')

const getProducts = async (req, res) => {
  return res.render('shop', { products, docTitle: 'Shop', path: '/' })
}

module.exports = { getProducts }

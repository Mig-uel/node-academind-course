const products = []

const getAddProductForm = async (req, res) => {
  return res.status(200).render('add-product', {
    docTitle: 'Add Product',
    path: '/admin/product',
  })
}

const addProduct = async (req, res) => {
  const { body } = req
  const { title } = body

  products.push({ title })

  return res.redirect('/')
}

module.exports = { getAddProductForm, addProduct, products }

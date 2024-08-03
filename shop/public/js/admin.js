const id = document.querySelector('input[name="id"]').value

const deleteProduct = async (btn) => {
  const parentNode = btn.parentNode
  const id = parentNode.querySelector('input[name="id"]').value

  const res = await fetch(`/admin/delete/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    alert('Could not delete product')
    return
  }

  await res.json()

  const productNode = parentNode.parentNode
  productNode.parentNode.removeChild(productNode)
}

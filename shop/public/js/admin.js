const id = document.querySelector('input[name="id"]').value

const deleteProduct = async (btn) => {
  const parentNode = btn.parentNode
  const id = parentNode.querySelector('input[name="id"]').value

  const deleteRes = await fetch(`/admin/delete/${id}`, {
    method: 'DELETE',
  })

  const json = await deleteRes.json()

  console.log(json)
}

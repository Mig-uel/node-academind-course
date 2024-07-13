const p = document.querySelector('p')
const button = document.querySelector('button')

button.addEventListener('click', (e) => {
  const randomInt = Math.floor(Math.random() * 100)

  p.innerText = randomInt
})

button.removeEventListener('click', () => console.log('Event listener removed'))

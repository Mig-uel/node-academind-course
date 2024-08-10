const text = 'this is a text to be stored in a file'

const encoder = new TextEncoder()
const data = encoder.encode(text)

try {
  await Deno.writeFile('message.txt', data)
  console.log('Write to file!')
} catch (error) {
  console.log(error)
}

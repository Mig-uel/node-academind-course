const http = require('http')

const server = http.createServer((req, res) => {
  const { url, method } = req

  if (url === '/') {
    res.setHeader('Content-Type', 'text/html')
    res.write('<html>')
    res.write(`<head><title>Assignment - ${url}</title></head>`)
    res.write(
      '<body><h1>Hello, world!</h1><form action="/create-user" method="POST"><input type="text" name="user"/><button type="submit">Submit</button></form></body>'
    )
    res.write('</html>')
    return res.end()
  }

  if (url === '/users') {
    res.setHeader('Content-Type', 'text/html')
    res.write('<html>')
    res.write(`<head><title>Assignment - ${url}</title></head>`)
    res.write(
      '<body><ul><li>Mario</li><li>Luigi</li><li>Peach</li></ul></body>'
    )
    res.write('</html>')
    return res.end()
  }

  if (url === '/create-user' && method === 'POST') {
    const user = []

    req.on('data', (chunk) => user.push(chunk))

    return req.on('end', () => {
      const parsedUser = Buffer.concat(user).toString().split('=')[1]
      console.log(parsedUser)

      res.statusCode = 302
      res.setHeader('Location', '/')
      return res.end()
    })
  }

  res.statusCode = 302
  res.setHeader('Location', '/')
  res.end()
})

server.listen(3000)

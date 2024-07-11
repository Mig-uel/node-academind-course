const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
  const { url, method } = req

  // set header metadata to html (says we are sending html); there are many headers
  // some headers are set automatically by the server
  res.setHeader('Content-Type', 'text/html')

  if (url === '/') {
    // writes/sends back chunks of data
    res.write('<html>')
    res.write('<head><title>Enter message</title></head>')
    res.write(
      `<body>
        <form action='/message' method='POST'>
          <input type='text' name='message'/>
          <button type='submit'>Submit</button>
        </form>
      </body>`
    )
    res.write('</html>')
    return res.end()
  }

  if (url === '/message' && method === 'POST') {
    const body = []

    req.on('data', (chunk) => {
      console.log(chunk)
      body.push(chunk)
    }) // on every every stream of data/chunk

    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString() // concat the array of chunks into a new Buffer and convert to string assuming it's text

      const message = parsedBody.split('=')[1]

      fs.writeFileSync('message.txt', message)
    })

    res.statusCode = 302
    res.setHeader('Location', '/')
    return res.end()
  }
}) // creates a server

server.listen(3000)

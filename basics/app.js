const http = require('http')

const server = http.createServer((req, res) => {
  const { method, url } = req

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
}) // creates a server

server.listen(3000)

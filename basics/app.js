const http = require('http')

const server = http.createServer((req, res) => {
  const { method, url } = req

  console.log(url, method)

  // set header metadata to html (says we are sending html)
  // there are many headers
  // some headers are set automatically by the server
  res.setHeader('Content-Type', 'text/html')

  // writes/sends back chunks of data
  res.write('<html>')
  res.write('<head><title>My first page</title></head>')
  res.write('<body><h1>Hello from my Node.js Server!</h1></body>')
  res.write('</html>')
  res.end()
}) // creates a server

server.listen(3000)

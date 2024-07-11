const http = require('http')

// route handlers
const requestHandler = require('./routes')

const server = http.createServer(requestHandler) // creates a server

server.listen(3000)

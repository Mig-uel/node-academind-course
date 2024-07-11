const http = require('http')

// route handlers
const routes = require('./routes')

const server = http.createServer(routes) // creates a server

server.listen(3000)

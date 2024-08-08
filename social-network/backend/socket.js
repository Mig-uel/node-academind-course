const { Server } = require('socket.io')

let io

module.exports = {
  init: (httpServer) => {
    io = new Server(httpServer, {
      cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] },
    })

    io.on('connection', (socket) => {
      console.log(`SOCKET.IO: ${socket.id} CONNECTED`)
      console.log(' x - - - - - - - - - - - - x')
    })

    return io
  },
}

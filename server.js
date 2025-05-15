const express = require('express')
const cors = require('cors')
const { createServer } = require('http')
const { Server } = require('socket.io')

const app = express()
app.use(cors())

const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    // origin: 'http://localhost:3002', 
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {
  console.log('🔌 Nouveau client connecté')

  socket.on('chat message', (msg) => {
    console.log('💬', msg)
    io.emit('chat message', msg)
  })

  socket.on('disconnect', () => {
    console.log('❌ Client déconnecté')
  })
})

httpServer.listen(3001, () => {
  console.log('✅ WebSocket prêt sur http://localhost:3003')
})
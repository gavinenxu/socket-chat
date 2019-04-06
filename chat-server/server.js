const http = require('http')
const sockjs = require('sockjs')

const echo = sockjs.createServer({
  sockjs_url: ''
})
const clients = {}

function broadcast(message) {
  // eslint-disable-next-line no-restricted-syntax
  for (const client of Object.values(clients)) {
    console.log(`send back to client: ${message} `)
    client.write(message)
  }
}

echo.on('connection', conn => {
  console.log(`connect: ${conn.id}`)
  clients[conn.id] = conn
  conn.on('data', message => {
    broadcast(message)
  })
  conn.on('close', () => {
    console.log(`disconnect: ${conn.id}`)
    delete clients[conn.id]
  })
})

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  })
  res.write('Chat Room')
  res.end()
})
echo.installHandlers(server, {
  prefix: '/chat'
})

const port = process.env.PORT || 8080
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

// src/server.js
import net from 'net'

const server = net.createServer((socket) => {
  console.log(
    'Cliente conectado ' + socket.remoteAddress + ':' + socket.remotePort
  )
  socket.write('¡Bienvenido al servidor!\n')

  socket.on('data', (data) => {
    console.log(`Recibido del cliente: ${data}`)
    socket.write('Mensaje recibido\n')
  })

  socket.on('end', () => {
    console.log('Cliente desconectado')
  })
})

export function openServer(port = 8080) {
  server.listen(port, () => {
    console.log('Servidor TCP escuchando en el puerto ' + port + '...')
  })
}
export function closeServer() {
  server.close()
  console.log('Servidor cerrado...')
}

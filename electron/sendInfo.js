import net from 'net'
import os from 'os'

// Crear un socket global para reutilizarlo
let socket = null

function connectToServer(server, port) {
  if (socket && !socket.destroyed) {
    return socket
  }

  socket = new net.Socket()

  socket.on('connect', () => {
    console.log('Conexión establecida con el servidor')
  })

  socket.on('error', (err) => {
    console.error('Error en el socket:', err.message)
    socket.destroy()
    socket = null
  })

  socket.on('close', () => {
    console.log('Conexión cerrada por el servidor')
    socket.destroy()
    socket = null
  })

  socket.connect(port, server)
  return socket
}

export const sendInfo = (server, counter, port) => {
  const currentSocket = connectToServer(server, port)

  if (currentSocket && !currentSocket.destroyed) {
    const hardware = {
      hostname: os.hostname(),
      osInfo: os.type(),
      memory: os.totalmem(),
      cpu: os.cpus()[0].model,
      cpuspeed: os.cpus()[0].speed,
      score: counter,
    }

    currentSocket.write(JSON.stringify(hardware))
  } else {
    console.error(
      'No se pudo enviar la información porque el socket está destruido'
    )
  }
}

export const closeConnection = (server, port) => {
  const currentSocket = connectToServer(server, port)

  if (currentSocket && !currentSocket.destroyed) {
    socket.destroy()
    console.log('Conexión cerrada por el cliente')
  } else {
    console.error(
      'No se pudo enviar la información porque el socket está destruido'
    )
  }
}

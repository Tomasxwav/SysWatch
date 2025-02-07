import net from 'net'
import os from 'os'

// Crear un socket global para reutilizarlo
let socket = null

function connectToServer(server, port = 8080) {
  if (socket && !socket.destroyed) {
    // Si el socket ya está conectado y no está destruido, reutilízalo
    return socket
  }

  socket = new net.Socket()

  socket.on('connect', () => {
    console.log('Conexión establecida con el servidor')
  })

  socket.on('error', (err) => {
    console.error('Error en el socket:', err.message)
    socket.destroy()
    socket = null // Resetear el socket para intentar reconectar
  })

  socket.on('close', () => {
    console.log('Conexión cerrada por el servidor')
    socket.destroy()
    socket = null // Resetear el socket
  })

  socket.connect(port, server)
  return socket
}

export const sendInfo = (server, counter) => {
  const currentSocket = connectToServer(server, 8080)

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

export const closeConnection = (server) => {
  const currentSocket = connectToServer(server, 8080)

  if (currentSocket && !currentSocket.destroyed) {
    socket.destroy()
    console.log('Conexión cerrada por el cliente')
  } else {
    console.error(
      'No se pudo enviar la información porque el socket está destruido'
    )
  }
}

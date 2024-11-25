import net from 'net'
import os from 'os'

function sendHardware(hardware, server, port = 8080) {
  const socket = new net.Socket()

  socket.on('connect', () => {
    socket.write(JSON.stringify(hardware))
  })

  socket.on('error', (err) => {
    socket.destroy()
  })

  socket.connect(port, server)
}

export const sendInfo = (server, counter) => {
  sendHardware(
    {
      hostname: os.hostname(),
      osInfo: os.type(),
      memory: os.totalmem(),
      prueba: counter,
    },
    server,
    8080
  )
}

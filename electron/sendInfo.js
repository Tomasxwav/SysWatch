import net from 'net'

export function sendHardware(hardware, server, port = 8080) {
  const socket = new net.Socket()
  socket.connect(port, server, () => {
    socket.write(JSON.stringify(hardware))
  })
}

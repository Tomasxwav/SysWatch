// src/networkScanner.js
import os from 'os'
import net from 'net'

export function getLocalIPAddress() {
  const nets = os.networkInterfaces()
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address
      }
    }
  }
  return '127.0.0.1'
}

function checkPort(ip, port) {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket()
    socket.setTimeout(1000)

    socket.on('connect', () => {
      socket.end()
      resolve({ ip, port, status: 'open' })
    })

    socket.on('timeout', () => {
      socket.destroy()
      reject({ ip, port, status: 'closed' })
    })

    socket.on('error', (err) => {
      socket.destroy()
      reject({ ip, port, status: 'closed' })
    })

    socket.connect(port, ip)
  })
}

export async function scanNetwork(port = 8080) {
  const ipAddress = getLocalIPAddress()
  const subnet = ipAddress.split('.').slice(0, 3).join('.')
  const promises = []
  const serverList = []

  for (let i = 1; i <= 254; i++) {
    const ip = `${subnet}.${i}`
    promises.push(checkPort(ip, port))
  }

  try {
    const results = await Promise.allSettled(promises)
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        serverList.push(result.value.ip)
      }
    })
  } catch (error) {
    console.error('Error al verificar puertos:', error)
  }
  return serverList
}

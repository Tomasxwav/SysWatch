import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import os, { networkInterfaces } from 'os'
import { fileURLToPath } from 'url'
import net from 'net'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, '/preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  })

  // Carga la aplicación React
  win.loadURL('http://localhost:3000') // Para desarrollo

  // Para producción, si usas un build de React:
  // win.loadFile(path.join(__dirname, 'build', 'index.html'));
}

/*Creacion del servidor TCP de la maquina local*/
const server = net.createServer((socket) => {
  console.log(
    'Cliente conectado ' + socket.remoteAddress + ':' + socket.remotePort
  )

  socket.write('¡Bienvenido al servidor!\n')

  // Escuchar mensajes del cliente
  socket.on('data', (data) => {
    console.log(`Recibido del cliente: ${data}`)
    // Responder al cliente
    socket.write('Mensaje recibido\n')
  })

  socket.on('end', () => {
    console.log('Cliente desconectado')
  })
})

/*El servidor se inicia y escucha en el puerto 8080*/
function openServer(port = 8080) {
  server.listen(port, () => {
    console.log('Servidor TCP escuchando en el puerto ' + port + '...')
  })
}

/* Función para verificar si un puerto está abierto o cerrado */
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

/*Función principal para escanear la red*/
async function scanNetwork(port = 8080) {
  const ipAddress = getLocalIPAddress()
  console.log('ip ' + ipAddress)
  const subnet = ipAddress.split('.').slice(0, 3).join('.')

  const promises = []
  const serverList = []
  for (let i = 1; i <= 254; i++) {
    const ip = `${subnet}.${i}`
    promises.push(checkPort(ip, port))
  }
  try {
    const results = await Promise.allSettled(promises) // Espera todas las promesas
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        console.log(
          `${result.value.ip}:${result.value.port} está ${result.value.status}`
        )
        serverList.push(result.value.ip)
      } else {
        console.log(
          `${result.reason.ip}:${result.reason.port} está ${result.reason.status}`
        )
      }
    })
  } catch (error) {
    console.error('Error al verificar puertos:', error)
  }
  return serverList
}

/*Funciones para obtener la dirección IP local y verificar puertos*/
function getLocalIPAddress() {
  const nets = networkInterfaces()
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address
      }
    }
  }
  return '127.0.0.1'
}

/* Funcion para obtener datos del hardware */
async function getHardware() {
  const hostname = os.hostname()
  const osInfo = os.type()
  const cpus = os.cpus()
  const cpu = cpus[0].model
  const cpuspeed = cpus[0].speed
  const memory = os.totalmem()
  const freemem = os.freemem()
  const freemempercent = os.freemem() / os.totalmem()
  return {
    hostname,
    osInfo,
    cpus,
    cpu,
    memory,
    freemem,
    freemempercent,
    cpuspeed,
  }
}

ipcMain.handle('scan-network', async () => {
  const result = await scanNetwork()
  return result
})
ipcMain.handle('open-server', async (event, port) => {
  openServer(port)
})
ipcMain.handle('get-hardware', async () => {
  const result = await getHardware()
  return result
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

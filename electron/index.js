// src/main.js
import { app, ipcMain } from 'electron'
/* import { getHardware } from './hardware.js'*/
import { sendInfo, closeConnection } from './sendInfo.js'
import { scanNetwork } from './networkScanner.js'
import { fileURLToPath } from 'url'
import { BrowserWindow } from 'electron'
import path from 'path'
import net from 'net'

let win
let server = null
const clients = new Map()
let counter = 0
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, '/preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  })
  // Carga la aplicación React (modo desarrollo)
  win.loadURL('http://localhost:3000')
  win.webContents.openDevTools()

  // Para producción:
  // win.loadFile(path.join(__dirname, 'build', 'index.html'))

  /////////////////////////////////////////////////////////////////////

  // Manejo de eventos de IPC

  /////////////////////// EVENTO SCAN  ///////////////////////
  ipcMain.handle('scan-network', async (event, port) => {
    const serverList = await scanNetwork(port)
    return serverList
  })

  ////////////////////// EVENTO ABRIR SERVER ///////////////////////
  ipcMain.handle('open-server', async (event, port) => {
    if (server) {
      return 'El servidor ya está en ejecución.'
    }

    server = net.createServer((socket) => {
      const clientId = `${socket.remoteAddress}:${socket.remotePort}`
      console.log('Cliente conectado ' + clientId)
      clients.set(clientId, { socket, data: null })
      socket.write('¡Bienvenido al servidor!\n')

      sendClientsToRenderer()

      socket.on('data', (data) => {
        try {
          const parsedData = JSON.parse(data)
          console.log(`Mensaje de ${clientId}: ${parsedData.hostname}`)
          clients.set(clientId, { socket, data: parsedData })
          socket.write('Mensaje recibido\n')
          sendClientsToRenderer()
        } catch (error) {
          console.error(`Error al procesar mensaje de ${clientId}:`, error)
          socket.write('Error en el formato del mensaje\n')
        }
      })

      socket.on('end', () => {
        console.log(`Cliente desconectado: ${clientId}`)
        clients.delete(clientId)
        sendClientsToRenderer()
      })
    })

    server.on('error', (err) => {
      console.error('Error en el servidor:', err)
    })

    server.listen(port, '0.0.0.0', () => {
      console.log(`Servidor TCP escuchando en el puerto ${port}`)
    })
    /* 
    console.log(
      `Servidor corriendo en: ${server.address().address}:${
        server.address().port
      }`
    ) */

    return `Servidor iniciado correctamente en el puerto ${port}.`
  })
  /////////////////////// EVENTO CERRAR SERVER ///////////////////////
  ipcMain.handle('close-server', () => {
    if (!server) {
      return 'El servidor ya está cerrado.'
    }

    clients.forEach(({ socket }, clientId) => {
      console.log(`Desconectando cliente: ${clientId}`)
      socket.end('El servidor se está cerrando...\n')
      socket.destroy()
    })

    clients.clear()

    server.close(() => {
      console.log('Servidor cerrado correctamente.')
      server = null
      counter = 0
    })

    return 'Servidor cerrándose...'
  })

  /////////////////////// EVENTO ENVIAR INFORMACION ///////////////////////
  ipcMain.handle('send-info', async (event, server, port) => {
    sendInfo(server, counter, port)
    counter++
  })
  ipcMain.handle('close-connection', async (event, server, port) => {
    closeConnection(server, port)
  })
  /////////////////////////////////////////////////////////////////////
  function sendClientsToRenderer() {
    const clientList = Array.from(clients.entries()).map(([id, { data }]) => ({
      id,
      ...data,
    }))
    console.log(`clients ${clientList.length} ${JSON.stringify(clientList)}`)

    win.webContents.send('send-received-data', clientList)
  }
  /////////////////////////////////////////////////////////////////////
}

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

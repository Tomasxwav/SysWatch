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
let server
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
  ipcMain.handle('scan-network', async () => {
    const serverList = await scanNetwork()

    return serverList
  })

  ////////////////////// EVENTO ABRIR SERVER ///////////////////////
  ipcMain.handle('open-server', async (event, port = 8080) => {
    if (server) {
      console.log('El servidor ya ha iniciado.')
    }

    server = net.createServer((socket) => {
      const clientId = `${socket.remoteAddress}:${socket.remotePort}`
      console.log('Cliente conectado ' + clientId)
      clients.set(clientId, { socket, data: null })
      socket.write('¡Bienvenido al servidor!\n')

      sendClientsToRenderer()

      socket.on('data', (data) => {
        const parsedData = JSON.parse(data) // Asegúrate de procesar correctamente los datos
        console.log(`Mensaje de ${clientId}: ${parsedData.hostname}`)

        // Actualizar datos del cliente
        clients.set(clientId, { socket, data: parsedData })
        socket.write('Mensaje recibido\n')

        // Envía datos al renderer
        sendClientsToRenderer()
      })

      socket.on('end', () => {
        console.log('Cliente desconectado')

        clients.delete(clientId)
        sendClientsToRenderer()
      })
    })

    server.listen(port, () => {
      console.log('Servidor TCP escuchando en el puerto ' + port)
    })

    return 'Servidor iniciado correctamente en el puerto ' + port + '.'
  })
  /////////////////////// EVENTO CERRAR SERVER ///////////////////////
  ipcMain.handle('close-server', () => {
    if (!server) {
      return 'El servidor ya está cerrado.'
    }
    server.close()
    console.log('Servidor cerrado...')
    counter = 0
  })

  /////////////////////// EVENTO ENVIAR INFORMACION ///////////////////////
  ipcMain.handle('send-info', async (event, server, port) => {
    sendInfo(server, counter)
    counter++
  })
  ipcMain.handle('close-connection', async (event, server, port) => {
    closeConnection(server)
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

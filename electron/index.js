// src/main.js
import { app, ipcMain } from 'electron'
import { scanNetwork } from './networkScanner.js'
import { getHardware } from './hardware.js'
import { sendHardware } from './sendInfo.js'
import { fileURLToPath } from 'url'
import { BrowserWindow } from 'electron'
import path from 'path'
import net from 'net'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
let win
let server

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

  // Manejo de eventos de IPC

  ipcMain.handle('open-server', async (event, port = 8080) => {
    if (server) {
      return 'El servidor ya está iniciado.'
    }

    server = net.createServer((socket) => {
      console.log(
        'Cliente conectado ' + socket.remoteAddress + ':' + socket.remotePort
      )
      socket.write('¡Bienvenido al servidor!\n')

      socket.on('data', (data) => {
        console.log(`Recibido del cliente: ${data}`)
        socket.write('Mensaje recibido\n')

        // Envía datos al renderer
        win.webContents.send('server-message', data.toString())
      })

      socket.on('end', () => {
        console.log('Cliente desconectado')
      })
    })

    server.listen(port, () => {
      console.log('Servidor TCP escuchando en el puerto ' + port)
    })

    return 'Servidor iniciado correctamente en el puerto ' + port + '.'
  })
  // Detener el servidor cuando se indique desde el renderer
  ipcMain.handle('close-server', async () => {
    if (!server) {
      return 'El servidor no está activo.'
    }

    server.close(() => {
      console.log('Servidor detenido.')
      server = null
    })

    return 'Servidor detenido correctamente.'
  })

  ipcMain.handle('get-hardware', async () => {
    const result = await getHardware()
    return result
  })
  ipcMain.handle('send-hardware', async (event, hardware, server, port) => {
    sendHardware(hardware, server, port)
  })
  ipcMain.handle('scan-network', async () => {
    const result = await scanNetwork(8080)
    return result
  })
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

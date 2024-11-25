// src/main.js
import { app, ipcMain } from 'electron'
/* import { getHardware } from './hardware.js'*/
import { sendInfo } from './sendInfo.js'
import { scanNetwork } from './networkScanner.js'
import { fileURLToPath } from 'url'
import { BrowserWindow } from 'electron'
import path from 'path'
import net from 'net'

let win
let server
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
    const result = await scanNetwork()
    if (result.length > 0) {
      console.log('Se encontro un servidor ' + result[0])
      setInterval(() => {
        sendInfo(result[0], counter)
        counter++
      }, 3000)
    }
    return result
  })

  ////////////////////// EVENTO ABRIR SERVER ///////////////////////
  ipcMain.handle('open-server', async (event, port = 8080) => {
    if (server) {
      console.log('El servidor ya ha iniciado.')
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
        let info = JSON.parse(data)
        win.webContents.send('send-received-data', info)
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
  /////////////////////// EVENTO CERRAR SERVER ///////////////////////
  ipcMain.handle('close-server', () => {
    if (!server) {
      return 'El servidor ya está cerrado.'
    }
    server.close()
    console.log('Servidor cerrado...')
  })
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

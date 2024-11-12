// src/main.js
import { app, ipcMain } from 'electron'
import { openServer } from './server.js'
import { scanNetwork } from './networkScanner.js'
import { getHardware } from './hardware.js'
import { fileURLToPath } from 'url'
import { BrowserWindow } from 'electron'
import path from 'path'

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
  // Carga la aplicación React (modo desarrollo)
  win.loadURL('http://localhost:3000')

  // Para producción:
  // win.loadFile(path.join(__dirname, 'build', 'index.html'))
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

// Manejo de eventos de IPC
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

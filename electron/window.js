// src/window.js
import { BrowserWindow } from 'electron'
import path from 'path'

const __dirname = path.resolve()

export function createWindow() {
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

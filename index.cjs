const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // opcional
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  // Carga la aplicación React
  win.loadURL('http://localhost:3000') // Para desarrollo

  // Para producción, si usas un build de React:
  // win.loadFile(path.join(__dirname, 'build', 'index.html'));
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

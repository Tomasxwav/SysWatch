const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  scanNetwork: async () => {
    const result = await ipcRenderer.invoke('scan-network')
    return result
  },
  openServer: (port = 8080) => {
    ipcRenderer.invoke('open-server', port)
  },
  closeServer: async () => {
    const result = await ipcRenderer.invoke('close-server')
    return result
  },
  onNewInfo: (callback) =>
    ipcRenderer.on('send-received-data', (event, info) => callback(info)),
})

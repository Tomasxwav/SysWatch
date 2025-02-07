const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  scanNetwork: async (port) => {
    const result = await ipcRenderer.invoke('scan-network', port)
    return result
  },
  openServer: async (port) => {
    return await ipcRenderer.invoke('open-server', port)
  },
  closeServer: async () => {
    const result = await ipcRenderer.invoke('close-server')
    return result
  },
  sendInfo: (server, port) => {
    ipcRenderer.invoke('send-info', server, port)
  },
  closeConnection: (server, port) => {
    ipcRenderer.invoke('close-connection', server, port)
  },
  onNewInfo: (callback) =>
    ipcRenderer.on('send-received-data', (event, info) => callback(info)),
})

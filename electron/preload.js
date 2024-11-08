const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  scanNetwork: async () => {
    const result = await ipcRenderer.invoke('scan-network')
    return result
  },
  openServer: async (port = 8080) => {
    const result = await ipcRenderer.invoke('open-server', port)
    return result
  },
})

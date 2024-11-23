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
  /*
  getHardware: async () => {
    const result = await ipcRenderer.invoke('get-hardware')
    return result
  },
  sendHardware: async (hardware, server, port = 8080) => {
    const result = await ipcRenderer.invoke(
      'send-hardware',
      hardware,
      server,
      port
    )
    return result
    
  },*/
})

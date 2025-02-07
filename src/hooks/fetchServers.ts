const PORT = import.meta.env.VITE_PORT || 3005

export const fetchServers = async (): Promise<string[]> => {
  try {
    const foundServers = await window.electron.scanNetwork(PORT)
    if (foundServers.length === 0) {
      return []
    } else {
      return foundServers
    }
  } catch (error) {
    console.error('Error al escanear la red:', error)
    return []
  }
}

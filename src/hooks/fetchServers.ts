export const fetchServers = async (): Promise<string[]> => {
  try {
    const foundServers = await window.electron.scanNetwork()
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

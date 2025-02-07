import { useEffect, useState } from 'react'

const PORT = import.meta.env.VITE_PORT || 3005

export const useScan = (isConnected: boolean, isServer?: boolean) => {
  const [servers, setServers] = useState<string[]>([])

  useEffect(() => {
    if (!isConnected) {
      setServers([])
      return
    }

    const fetchServers = async () => {
      try {
        const foundServers = await window.electron.scanNetwork(PORT)
        if (foundServers.length === 0) {
          setServers([])
          return
        } else {
          setServers(foundServers)
        }
      } catch (error) {
        console.error('Error al escanear la red:', error)
      }
    }

    fetchServers()
  }, [isConnected, isServer])

  return servers
}

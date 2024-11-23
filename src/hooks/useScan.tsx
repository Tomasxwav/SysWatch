import { useEffect, useState } from 'react'

export const useScan = (isConnected: boolean, isServer?: boolean) => {
  const [servers, setServers] = useState<string[]>([])

  useEffect(() => {
    if (!isConnected) {
      setServers([])
      return
    } // Solo ejecuta el efecto si isConnected es true

    const fetchServers = async () => {
      try {
        const foundServers = await window.electron.scanNetwork()
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

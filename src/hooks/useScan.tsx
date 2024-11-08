import { useEffect, useState } from 'react'

export const useScan = (isConnected: boolean) => {
  const [servers, setServers] = useState<string[]>([])

  useEffect(() => {
    if (!isConnected) return // Solo ejecuta el efecto si isConnected es true

    const fetchServers = async () => {
      try {
        const foundServers = await window.electron.scanNetwork()
        setServers(foundServers)
      } catch (error) {
        console.error('Error al escanear la red:', error)
      }
    }

    fetchServers()
  }, [isConnected])
  return servers
}

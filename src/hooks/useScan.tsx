import { useEffect, useState } from 'react'

export const useScan = (isConnected: boolean) => {
  const [servers, setServers] = useState<string[] | null>([])

  useEffect(() => {
    if (!isConnected) return // Solo ejecuta el efecto si isConnected es true

    const fetchServers = async () => {
      try {
        const foundServers = await window.electron.scanNetwork()
        console.log(foundServers.length)
        if (foundServers.length === 0) {
          setServers(null)
          return
        } else {
          setServers(foundServers)
        }

        setServers(foundServers)
      } catch (error) {
        console.error('Error al escanear la red:', error)
      }
    }

    fetchServers()
  }, [isConnected])
  return servers ?? null
}

import { useEffect, useState } from 'react'

export const useHardware = (isConnected: boolean) => {
  const [hardware, setHardware] = useState<any>(null)
  useEffect(() => {
    if (!isConnected) return
    const fetchHardware = async () => {
      try {
        const foundHardware = await window.electron.getHardware()
        setHardware(foundHardware)
      } catch (error) {
        console.error('Error al obtener la información del hardware:', error)
      }
    }
    fetchHardware()
  }, [isConnected])

  return hardware
}

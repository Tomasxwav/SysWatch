import { useEffect } from 'react'

export const useOpenServer = (isConnected: boolean) => {
  useEffect(() => {
    if (!isConnected) return
    window.electron.openServer()
  }, [isConnected])
}

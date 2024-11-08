import { useEffect } from 'react'

export const useOpenSvr = (isConnected: boolean) => {
  useEffect(() => {
    if (!isConnected) return
    window.electron.openServer()
  }, [isConnected])
}

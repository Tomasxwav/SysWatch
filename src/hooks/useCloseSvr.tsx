import { useEffect } from 'react'

export const useCloseSvr = (isConnected: boolean) => {
  useEffect(() => {
    if (isConnected) return
    window.electron.closeServer()
  }, [isConnected])
}

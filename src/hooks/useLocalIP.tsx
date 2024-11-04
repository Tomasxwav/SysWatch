import { useEffect, useState } from 'react'

export const useLocalIP = () => {
  const [ip, setIP] = useState('null')

  useEffect(() => {
    const peerConnection = new RTCPeerConnection({ iceServers: [] })
    peerConnection.createDataChannel('')
    peerConnection
      .createOffer()
      .then((offer) => peerConnection.setLocalDescription(offer))
      .catch((error) => console.error('Error al crear la oferta:', error))

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        const localIP = event.candidate.candidate.split(' ')[4]
        setIP(localIP)
        peerConnection.close()
      }
    }
  }, [])

  return ip
}

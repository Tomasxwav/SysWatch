import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

const IPContext = createContext<string | null>(null)

interface IPProviderProps {
  children: ReactNode
}

export const IPProvider: React.FC<IPProviderProps> = ({ children }) => {
  const [ip, setIP] = useState<string | null>(null)

  useEffect(() => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    })

    peerConnection.createDataChannel('')

    peerConnection
      .createOffer()
      .then((offer) => {
        // console.log('Oferta creada:', offer)
        return peerConnection.setLocalDescription(offer)
      })
      .catch((error) => console.error('Error al crear la oferta:', error))

    peerConnection.onicecandidate = (event) => {
      // console.log('Candidato ICE recibido:', event.candidate)
      if (event.candidate) {
        const localIP = event.candidate.candidate.split(' ')[4]
        setIP(localIP)
        peerConnection.close()
        // console.log(localIP)
      }
    }

    return () => {
      peerConnection.close()
    }
  }, [])

  return <IPContext.Provider value={ip}>{children}</IPContext.Provider>
}

export const useIP = () => {
  return useContext(IPContext)
}

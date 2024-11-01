import { useState } from 'react'

export const Header = () => {
  const [isConnected, setIsConnected] = useState(false)

  const handleConnectToServer = () => {
    const peerConnection = new RTCPeerConnection({ iceServers: [] })
    peerConnection.createDataChannel('')
    peerConnection
      .createOffer()
      .then((offer) => peerConnection.setLocalDescription(offer))
      .catch((error) => console.error('Error al crear la oferta:', error))

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        const ip = event.candidate.candidate.split(' ')[4]
        alert('Tu dirección IP local es: ' + ip)
        peerConnection.close()
      }
    }

    isConnected
      ? alert('Connecting to server...') //TODO
      : alert('Disconnecting from server...') //TODO

    if (isConnected) {
    }

    setIsConnected(!isConnected)
  }
  return (
    <div className='w-full bg-[#363554] flex justify-around 2xl:h-24 xl:h-20 h-12 items-center shadow-lg'>
      <div className='flex items-center'>
        <img
          src='logo.svg'
          alt='logo'
          className='  2xl:size-20 xl:size-16 size-12'
        />
        <p className='font-extrabold text-xl text-[#7474A2] sm:flex hidden'>
          SysWatch
        </p>
      </div>
      <h1 className='font-extrabold text-3xl text-[#7474A2]'>PC1</h1>
      {isConnected ? (
        <button
          onClick={handleConnectToServer}
          className='xl:border-4  border-2 border-green-500 2xl:p-6 xl:p-3 p-2 rounded-full font-extrabold '
        >
          On
        </button>
      ) : (
        <button
          onClick={handleConnectToServer}
          className='xl:border-4  border-2 border-red-500 2xl:p-6 xl:p-3 p-2 rounded-full font-extrabold '
        >
          Off
        </button>
      )}
    </div>
  )
}

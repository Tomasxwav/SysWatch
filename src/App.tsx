import './App.css'
import { Device } from './components/Device'
import { Filters } from './components/Filters'
import { Header } from './components/Header'
import { useState } from 'react'
import { useLocalIP } from './hooks/useLocalIP'
// import { useIP } from './context/IPContext'

function App() {
  const ip = useLocalIP()

  const [isConnected, setIsConnected] = useState<boolean>(false)

  const handleConnection = async (data: boolean) => {
    if (data) {
      for (let i = 2; i <= 5; i++) {
        const ipdest = `192.168.1.${i}`
        console.log(`Probando con ${ipdest}`)

        if (ipdest === '192.168.1.5') {
          console.log('Entro?')
          setIsConnected(data)
          break
        }

        // Evitar auto-conexión si ya se conoce la IP
        if (ipdest !== ip) {
          await new Promise<void>((resolve) => {
            const socket = new WebSocket(`ws://${ipdest}:8080`)

            socket.onopen = () => {
              console.log(`Conectado a ${ipdest}`)
              socket.send('Hola')
              socket.close()
              resolve() // Continuar al siguiente después de cerrar
            }

            socket.onerror = (error) => {
              console.log(`Error al conectar a ${ipdest}: ${error}`)
              resolve() // Continuar incluso si hubo error
            }
          })
        }
      }
      console.log('FIN')
      //setIsConnected(data)
    } else {
      setIsConnected(data)
    }
  }
  return (
    <div className=''>
      <Header
        ip={ip}
        handleConnect={handleConnection}
        isConnected={isConnected}
      />
      {isConnected ? <p>Si</p> : <p>No</p>}
      <Filters />
      <div className='device flex justify-around flex-wrap sm:flex-nowrap sm:overflow-x-auto mx-8 sm:border border-[#2a2a49]'>
        <Device />
        <Device />
        <Device />
        <Device />
        <Device />
      </div>
    </div>
  )
}

export default App

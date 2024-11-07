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
  const [servers, setServers] = useState<string[]>([])
  const [status, setStatus] = useState('...')

  const foundServers: string[] = []

  const handleConnection = async (data: boolean) => {
    if (data) {
      setStatus('Buscando servidores...')
      try {
        // Llama al proceso principal para escanear la red
        const scanFetch = await window.electron
          .scanNetwork()
          .then((result: string[]) => {
            foundServers.push(result.toString())
            setStatus('Servidores encontrados: ')
          })
          .catch((err: Error) => {
            setStatus('Error escaneando servidores: ' + err)
            console.log('Error al escanear la red:', err)
          })
        console.log(foundServers)
        setServers(foundServers)

        if (foundServers.length > 0) {
          setStatus('Servidores encontrados: ')
          // Enviar mensaje a cada servidor encontrado
          /* foundServers.forEach(async (server) => {
          await sendMessageToServer(server, {
            message: 'Hola desde Electron + React',
          })
        }) 
        setStatus('Mensajes enviados a todos los servidores.')*/
        } else {
          setStatus('No se encontraron servidores.')
        }
      } catch (error) {
        console.error('Error buscando servidores:', error)
        setStatus('Error durante la búsqueda.')
      }
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

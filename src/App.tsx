import './App.css'
import { Device } from './components/Device'
import { Filters } from './components/Filters'
import { Header } from './components/Header'
import { useEffect, useState } from 'react'
import { useLocalIP } from './hooks/useLocalIP'
import { useScan } from './hooks/useScan'
import { Skeleton } from './components/Skeleton'

const PORT = import.meta.env.VITE_PORT || 3005

declare global {
  interface ClientInfo {
    id: string
    hostname: string
    memory: number
    cpu: string
    cpuspeed: number
    score: number
  }

  interface Window {
    electron: {
      sendInfo: (server: string, port: number) => void
      closeConnection: (server: string, port: number) => void
      onNewInfo: (callback: (newInfo: ClientInfo[]) => void) => void
      openServer: (port: number) => Promise<string>
      closeServer: () => void
      scanNetwork: (port: number) => Promise<string[]>
    }
  }
}

function App() {
  console.log('App: Controlador de cargas')

  const ip = useLocalIP()

  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isServer, setIsServer] = useState<boolean>(false)
  const [status, setStatus] = useState('Desconectado')
  let servers: string[] = useScan(isConnected, isServer) // Causa de que se renderize 2 veces

  const [info, setInfo] = useState<ClientInfo[]>([])

  let cont = 0

  ////////////Maneja el intervalo que envía información a los servidores.//////////////////////
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null // Intervalo para enviar información a los servidores

    if (servers.length > 0) {
      interval = setInterval(() => {
        window.electron.sendInfo(servers[0], PORT)
        console.log('intervalo ' + cont)
        cont++
      }, 3000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
        window.electron.closeConnection(servers[0], PORT)

        console.log('Intervalo limpiado')
      }
    }
  }, [servers])

  ////////////////////////// Lógica de conexión/desconexión ////////////////////////////////////
  useEffect(() => {
    if (isConnected) {
      if (servers.length > 0) {
        window.electron.onNewInfo((NewInfo: ClientInfo[]) => {
          setInfo(NewInfo)
          console.log('Info ' + JSON.stringify(NewInfo))
        })
      } else {
        console.log(
          'No se encontraron servidores ... se manda a abrir este servidor'
        )
        setStatus('No se encontraron servidores... Se agregará este servidor')

        window.electron
          .openServer(PORT)
          .then((msg) => {
            console.log(msg) // Asegúrate de que realmente inicia
            setIsServer(true)
          })
          .catch((err) => {
            console.error('Error al iniciar el servidor:', err)
          })
        /* if (!isServer && servers.length === 0) {
          window.electron.openServer(PORT).then((msg) => {
            console.log(msg)
            setIsServer(true)
          })
        } */
      }
    } else {
      window.electron.closeServer()
    }
  }, [servers])

  const handleConnection = async (data: boolean) => {
    if (data) {
      setIsConnected(data)
      setStatus('Buscando servidores...')
    } else {
      setIsConnected(data)
      setIsServer(false)
      servers = []
      setStatus('Desconectado')
    }
  }

  return (
    <div className=''>
      <Header
        ip={ip}
        handleConnect={handleConnection}
        isConnected={isConnected}
      />
      <Filters />
      {<p>{status}</p>}

      <div className='device flex justify-around flex-wrap sm:flex-nowrap sm:overflow-x-auto mx-8 sm:border border-[#2a2a49]'>
        {info.length > 0 ? (
          info.map((data, index) => (
            <Device
              key={index}
              hostname={data.hostname}
              memory={data.memory}
              cpu={data.cpu}
              cpuspeed={data.cpuspeed}
              score={data.score}
            />
          ))
        ) : (
          <Skeleton />
        )}
      </div>
    </div>
  )
}

export default App

import './App.css'
import { Device } from './components/Device'
import { Filters } from './components/Filters'
import { Header } from './components/Header'
import { useEffect, useState } from 'react'
import { useLocalIP } from './hooks/useLocalIP'
import { useScan } from './hooks/useScan'

function App() {
  console.log('App: Controlador de cargas')
  interface DeviceInfo {
    hostname: string
    memory: number
    cpu: string
    cpuspeed: number
    score: number
  }
  interface ClientInfo {
    id: string
    hostname: string
    memory: number
    cpu: string
    cpuspeed: number
    score: number
  }

  const ip = useLocalIP()

  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isServer, setIsServer] = useState<boolean>(false)
  const [status, setStatus] = useState('Desconectado')
  let servers: string[] = useScan(isConnected, isServer) // Causa de que se renderize 2 veces

  const [info, setInfo] = useState<ClientInfo[]>([])

  let cont = 0

  ////////////Maneja el intervalo que envía información a los servidores.//////////////////////
  useEffect(() => {
    let interval: number | null = null

    if (servers.length > 0) {
      interval = setInterval(() => {
        window.electron.sendInfo(servers[0], 8080)
        console.log('intervalo ' + cont)
        cont++
      }, 3000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
        window.electron.closeConnection(servers[0], 8080)

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
          console.log(NewInfo)
        })
      } else {
        console.log('No hay servidores... se manda a abir este servidor')
        //setStatus('No se encontraron servidores... Se agregara este servidor') //Con esto se renderiza 1 vez mas
        window.electron.openServer()
        setIsServer(true)
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
      {<p>{servers}</p>}
      <p> {info.length > 0 && info[0]?.hostname} </p>

      <div className='device flex justify-around flex-wrap sm:flex-nowrap sm:overflow-x-auto mx-8 sm:border border-[#2a2a49]'>
        {info &&
          info.map((data, index) => (
            <Device
              key={index}
              hostname={data.hostname}
              memory={data.memory}
              cpu={data.cpu}
              cpuspeed={data.cpuspeed}
            />
          ))}
        <Device />
        <Device />
      </div>
    </div>
  )
}

export default App

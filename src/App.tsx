import './App.css'
import { Device } from './components/Device'
import { Filters } from './components/Filters'
import { Header } from './components/Header'
import { useEffect, useState } from 'react'
import { useLocalIP } from './hooks/useLocalIP'
import { useScan } from './hooks/useScan'
import { useOpenSvr } from './hooks/useOpenSvr'
import { useHardware } from './hooks/useHardware'

function App() {
  const ip = useLocalIP()

  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isServer, setIsServer] = useState<boolean>(false)

  const hardware = useHardware(true)
  console.log(hardware)
  useOpenSvr(isServer)
  const [status, setStatus] = useState('Desconectado')
  const servers: string[] | null = useScan(isConnected, isServer)

  useEffect(() => {
    if (servers && servers.length > 0 && isConnected) {
      setStatus('Servers encontrados: ' + servers + '. Enviando info...')
      setIsServer(false)
    } else if (servers === null && isConnected) {
      setStatus('No se encontraron servidores... Se agregara este servidor')
      console.log('No se encontraron servidores... Se agregara este servidor')

      setIsServer(true)
    }
  }, [servers])

  const handleConnection = async (data: boolean) => {
    if (data) {
      setIsConnected(data)
      setStatus('Buscando servidores...')
    } else {
      setIsConnected(data)
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
        {servers &&
          servers.map((server, index) => (
            <Device
              key={index}
              ip={server}
              hostname={hardware?.hostname}
              memory={hardware?.memory}
              cpu={hardware?.cpu}
              cpuspeed={hardware?.cpuspeed}
            />
          ))}
        <Device />
        <Device />
      </div>
    </div>
  )
}

export default App

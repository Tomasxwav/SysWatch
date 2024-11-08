import './App.css'
import { Device } from './components/Device'
import { Filters } from './components/Filters'
import { Header } from './components/Header'
import { useEffect, useState } from 'react'
import { useLocalIP } from './hooks/useLocalIP'
import { useScan } from './hooks/useScan'

function App() {
  const ip = useLocalIP()

  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [status, setStatus] = useState('...')
  const servers = useScan(isConnected)

  useEffect(() => {
    if (servers.length > 0) {
      setStatus('Servers encontrados: ' + servers)
    }
  }, [servers])
  console.log(servers)
  const handleConnection = async (data: boolean) => {
    if (data) {
      setStatus('Buscando servidores...')
      setIsConnected(data)
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
      {isConnected ? <p>Conectado: Si</p> : <p>Conectado: No</p>}
      {<p>{status}</p>}
      <div className='device flex justify-around flex-wrap sm:flex-nowrap sm:overflow-x-auto mx-8 sm:border border-[#2a2a49]'>
        {servers.map((server, index) => (
          <Device key={index} ip={server} />
        ))}
        <Device />
        <Device />
      </div>
    </div>
  )
}

export default App

import './App.css'
import { Device } from './components/Device'
import { Filters } from './components/Filters'
import { Header } from './components/Header'
import { useEffect, useState } from 'react'
import { useLocalIP } from './hooks/useLocalIP'
import { useScan } from './hooks/useScan'
import { useOpenServer } from './hooks/useOpenSvr'

function App() {
  const ip = useLocalIP()

  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [status, setStatus] = useState('...')
  const servers: string[] | null = useScan(isConnected)

  useEffect(() => {
    console.log(servers)
    if (servers && servers.length > 0 && isConnected) {
      setStatus('Servers encontrados: ' + servers)
    } else if (servers === null && isConnected) {
      setStatus('No se encontraron servidores... Se agregara este servidor')
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
      {servers}
      <Filters />
      {isConnected ? <p>Conectado: Si</p> : <p>Conectado: No</p>}
      {<p>{status}</p>}
      <div className='device flex justify-around flex-wrap sm:flex-nowrap sm:overflow-x-auto mx-8 sm:border border-[#2a2a49]'>
        {servers &&
          servers.map((server, index) => <Device key={index} ip={server} />)}
        <Device />
        <Device />
      </div>
    </div>
  )
}

export default App

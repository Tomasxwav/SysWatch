import './App.css'
import { Device } from './components/Device'
import { Filters } from './components/Filters'
import { Header } from './components/Header'
import { useEffect, useState } from 'react'
import { useLocalIP } from './hooks/useLocalIP'
import { useScan } from './hooks/useScan'

function App() {
  console.log('App: Controlador de cargas')
  const ip = useLocalIP()

  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [status, setStatus] = useState('Desconectado')
  const servers: string[] = useScan(isConnected) // Causa de que se renderize 2 veces

  useEffect(() => {
    if (isConnected) {
      if (servers.length > 0) {
        console.log(servers)
      } else {
        console.log('No hay servidores')
        //setStatus('No se encontraron servidores... Se agregara este servidor') //Con esto se renderiza 1 vez mas
        window.electron.openServer()
      }
    }
  }, [servers])
  /* const [isServer, setIsServer] = useState<boolean>(false)
  const hardware = useHardware(true)
  useOpenSvr(isServer)
  useCloseSvr(isConnected) */

  //

  /* useEffect(() => {
    if (servers && servers.length > 0 && isConnected) {
      setStatus('Servers encontrados: ' + servers + '. Enviando info...')
      window.electron.sendHardware(hardware, servers[0], 8080)
      setIsServer(false)
    } else if (servers === null && isConnected) {
      setStatus('No se encontraron servidores... Se agregara este servidor')
      console.log('No se encontraron servidores... Se agregara este servidor')

      setIsServer(true)
    }
  }, [servers]) */

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
      {<p>{servers}</p>}

      <div className='device flex justify-around flex-wrap sm:flex-nowrap sm:overflow-x-auto mx-8 sm:border border-[#2a2a49]'>
        {/*servers &&
          servers.map((server, index) => (
            <Device
              key={index}
              ip={server}
              hostname={hardware?.hostname}
              memory={hardware?.memory}
              cpu={hardware?.cpu}
              cpuspeed={hardware?.cpuspeed}
            />
          ))*/}
        <Device />
        <Device />
      </div>
    </div>
  )
}

export default App

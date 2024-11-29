import { Activity, Cpu, HardDrive, Wifi } from 'lucide-react'

export const Skeleton = () => {
  return (
    <div className='w-full h-[65vh] py-12 px-4 text-center'>
      <h2 className='text-2xl font-bold mb-4 text-primary'>
        Bienvenido al Sistema de Monitoreo
      </h2>
      <p className='text-muted-foreground mb-8'>
        Conecta tu dispositivo para comenzar a monitorear en tiempo real.
      </p>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-8 mb-8'>
        <div className='flex flex-col items-center'>
          <Cpu className='h-12 w-12 text-primary mb-2' />
          <span className='text-sm'>CPU</span>
        </div>
        <div className='flex flex-col items-center'>
          <HardDrive className='h-12 w-12 text-primary mb-2' />
          <span className='text-sm'>Almacenamiento</span>
        </div>
        <div className='flex flex-col items-center'>
          <Activity className='h-12 w-12 text-primary mb-2' />
          <span className='text-sm'>Rendimiento</span>
        </div>
        <div className='flex flex-col items-center'>
          <Wifi className='h-12 w-12 text-primary mb-2' />
          <span className='text-sm'>Conectividad</span>
        </div>
      </div>
    </div>
  )
}

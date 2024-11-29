interface DeviceProps {
  ip?: string
  hostname?: string
  memory?: number
  cpu?: string
  cpuspeed?: number
  score?: number
}

export const Device = ({
  ip,
  hostname,
  memory,
  cpu,
  cpuspeed,
  score,
}: DeviceProps) => {
  let device = {
    deviceName: hostname ? hostname : 'Unknown',
    deviceMemory: memory ? memory / 1000000000 : 0,
    cpu: cpu,
    cpuspeed: cpuspeed,
    score: score,
  }

  return (
    <div className=' w-fit rounded-2xl bg-[#22223C] shadow-xl shadow-gray-950  font-extrabold text-[#7474A2] xl:min-w-56 2xl:min-w-64  xl:min-h-72 2xl:min-h-96 my-4 sm:mx-4 sm:pb-12 2xl:pb-40 mb-8'>
      <div className='bg-[#363554] rounded-t-2xl p-2 shadow-md'>
        <p>{device.deviceName}</p>
      </div>
      <div className='flex sm:flex-col items-center justify-center'>
        <div className='flex flex-col p-2 2xl:my-12  items-center w-full'>
          <p className='m-2'>SCORE</p>
          <div className='flex border-4 border-green-500 p-6 rounded-full font-extrabold overflow-hidden size-24 justify-center items-center'>
            <p>{device.score}</p>
          </div>
        </div>

        <div className='py-4'>
          <div className=' my-0 mx-auto'>
            <p className='mx-4'>Memory</p>
            <textarea
              disabled
              className='h-8 mx-4 w-fit bg-[#363554]'
              value={device.deviceMemory.toFixed(2) + ' GB'}
            />
          </div>
          <div className='my-0 mx-auto'>
            <p className='mx-4'>CPU Speed</p>
            <textarea
              disabled
              className='h-8 mx-4 w-fit bg-[#363554]'
              value={device.cpuspeed + ' MHz'}
            />
          </div>
          <div className='my-0 mx-auto'>
            <p className='mx-4'>CPU Model</p>
            <textarea
              disabled
              className='h-fit mx-4 w-fit bg-[#363554]'
              value={device.cpu}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

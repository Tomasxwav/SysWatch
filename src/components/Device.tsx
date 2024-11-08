interface DeviceProps {
  ip?: string
}

export const Device = ({ ip }: DeviceProps) => {
  let device = {
    deviceName: ip,
    deviceRam: 33,
    deviceSpeed: 3.3,
    deviceConnection: 21,
    score: 8,
  }

  console.log(device)

  return (
    <div className=' w-fit rounded-2xl bg-[#22223C] shadow-xl shadow-gray-950  font-extrabold text-[#7474A2] xl:min-w-56 2xl:min-w-64  xl:min-h-72 2xl:min-h-96 my-4 sm:mx-4 sm:pb-12 2xl:pb-40 mb-8'>
      <div className='bg-[#363554] rounded-t-2xl p-2 shadow-md'>
        <p>Device Name: {device.deviceName}</p>
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
            <p className='mx-4'>Aviable RAM</p>
            <textarea
              disabled
              className='h-8 mx-4 w-48 bg-[#363554]'
              value={device.deviceRam + ' %'}
            />
          </div>
          <div className='my-0 mx-auto'>
            <p className='mx-4'>CPU Speed</p>
            <textarea
              disabled
              className='h-8 mx-4 w-48 bg-[#363554]'
              value={device.deviceSpeed + ' Ghz'}
            />
          </div>
          <div className='my-0 mx-auto'>
            <p className='mx-4'>Connection Speed</p>
            <textarea
              disabled
              className='h-8 mx-4 w-48 bg-[#363554]'
              value={device.deviceConnection + ' mb/s'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

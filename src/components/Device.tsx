export const Device = () => {
  let device = {
    deviceName: 'PC1',
    deviceRam: 33,
    deviceSpeed: 3.3,
    deviceConnection: 21,
    score: 8,
  }

  return (
    <div className='w-fit rounded-2xl bg-[#22223C] shadow-xl shadow-gray-950  font-extrabold text-[#7474A2] min-w-64 min-h-96 m-4 pb-32'>
      <div className='bg-[#363554] rounded-t-2xl p-2 shadow-md'>
        <p>Device Name: {device.deviceName}</p>
      </div>
      <div className='flex flex-col items-center justify-center'>
        <div className='flex flex-col p-2 my-12  items-center w-full'>
          <p className='m-2'>SCORE</p>
          <div className='flex border-4 border-green-500 p-6 rounded-full font-extrabold overflow-hidden size-24 justify-center items-center'>
            <p>{device.score}</p>
          </div>
        </div>

        <div className='my-0 mx-auto'>
          <p>Aviable RAM</p>
          <textarea
            disabled
            className='h-8 w-48 bg-[#363554]'
            value={device.deviceRam + ' %'}
          />
        </div>
        <div className='my-0 mx-auto'>
          <p>CPU Speed</p>
          <textarea
            disabled
            className='h-8 w-48 bg-[#363554]'
            value={device.deviceSpeed + ' Ghz'}
          />
        </div>
        <div className='my-0 mx-auto'>
          <p>Connection Speed</p>
          <textarea
            disabled
            className='h-8 w-48 bg-[#363554]'
            value={device.deviceConnection + ' mb/s'}
          />
        </div>
      </div>
    </div>
  )
}

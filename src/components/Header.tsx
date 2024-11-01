export const Header = () => {
  return (
    <div className='w-full bg-[#363554] flex justify-around h-24 items-center shadow-lg'>
      <div className='flex items-center'>
        <img src='logo.svg' alt='logo' className='size-20' />
        <p className='font-extrabold text-xl text-[#7474A2]'>SysWatch</p>
      </div>
      <h1 className='font-extrabold text-3xl text-[#7474A2]'>PC1</h1>
      <button className='border-4 border-green-500 p-6 rounded-full font-extrabold '>
        On
      </button>
    </div>
  )
}

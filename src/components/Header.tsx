export const Header = () => {
  return (
    <div className='w-full bg-[#363554] flex justify-around 2xl:h-24 xl:h-20 h-12 items-center shadow-lg'>
      <div className='flex items-center'>
        <img
          src='logo.svg'
          alt='logo'
          className='  2xl:size-20 xl:size-16 size-12'
        />
        <p className='font-extrabold text-xl text-[#7474A2] sm:flex hidden'>
          SysWatch
        </p>
      </div>
      <h1 className='font-extrabold text-3xl text-[#7474A2]'>PC1</h1>
      <button className='xl:border-4  border-2 border-green-500 2xl:p-6 xl:p-3 p-2 rounded-full font-extrabold '>
        On
      </button>
    </div>
  )
}

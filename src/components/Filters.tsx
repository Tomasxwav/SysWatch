export const Filters = () => {
  return (
    <div className='flex flex-row gap-4 m-4'>
      <div>
        <p className='font-extrabold text-[#7474A2]'>Order by</p>
        <select className='h-8 w-32 sm:w-48 bg-[#363554]'>
          <option value='name'>Name</option>
          <option value='ram'>RAM</option>
          <option value='storage'>Storage</option>
        </select>
      </div>
      <div>
        <p className='font-extrabold text-[#7474A2]'>Search</p>
        <select className='h-8 w-32 sm:w-48 bg-[#363554]'>
          <option value='name'>Name</option>
          <option value='ram'>RAM</option>
          <option value='storage'>Storage</option>
        </select>
      </div>
    </div>
  )
}

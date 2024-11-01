import './App.css'
import { Device } from './components/Device'
import { Filters } from './components/Filters'

function App() {
  return (
    <div className=''>
      <Filters />
      <div className='device flex justify-around flex-wrap sm:flex-nowrap sm:overflow-x-auto mx-8 sm:border border-[#2a2a49]'>
        <Device />
        <Device />
        <Device />
        <Device />
        <Device />
      </div>
    </div>
  )
}

export default App

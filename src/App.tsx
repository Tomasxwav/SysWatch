import './App.css'
import { Device } from './components/Device'
import { Filters } from './components/Filters'

function App() {
  return (
    <div className=''>
      <Filters />
      <div className='flex justify-around flex-wrap'>
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

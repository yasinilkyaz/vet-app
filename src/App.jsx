

import { Routes , Route } from 'react-router-dom'
import './App.css'
import Animal from './Pages/Animal/Animal'
import Report from './Pages/Report/Report'
import Appointment from './Pages/Appointment/Appointment'
import AvailableDate from './Pages/AvailableDate/AvailableDate'
import Customer from './Pages/Customer/Customer'
import Doctor from './Pages/Doctor/Doctor'
import Vaccine from './Pages/Vaccine/Vaccine'
import Navbar from './Components/Navbar'

function App() {
  

  return (
    <>
     <Navbar />

     <Routes>
        <Route path='/animal' element={<Animal />} />
        <Route path='/report' element={<Report />} />
        <Route path='/appointment' element={<Appointment />} />
        <Route path='/available-date' element={<AvailableDate />} />
        <Route path='/customer' element={<Customer />} />
        <Route path='/doctor' element={<Doctor />} />
        <Route path='/vaccine' element={<Vaccine />} />
     </Routes>
    </>
  )
}

export default App

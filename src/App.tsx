import { BrowserRouter, Routes, Route } from "react-router"
import PageAppointments from "@/pages/page-appointments"

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<PageAppointments />} />     
      </Routes>
    </BrowserRouter>
  )
}

export default App

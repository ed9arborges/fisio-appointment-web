import { BrowserRouter, Routes, Route } from "react-router"
import PageHome from "@/pages/page-home"
import PageAppointments from "@/pages/page-appointments"

function App() {
  return (
    <BrowserRouter>
      <Routes>
      
          <Route index element={<PageHome />} />
          <Route path="/appointments" element={<PageAppointments />} />
     
      </Routes>
    </BrowserRouter>
  )
}

export default App

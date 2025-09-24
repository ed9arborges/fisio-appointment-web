import { BrowserRouter, Routes, Route } from "react-router"
import LayoutMain from "@/pages/layout-main"
import PageHome from "@/pages/page-home"
import PageAppointments from "@/pages/page-appointments"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutMain />}>
          <Route index element={<PageHome />} />
          <Route path="/appointments" element={<PageAppointments />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

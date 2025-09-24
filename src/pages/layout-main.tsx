import { Outlet, useLocation } from "react-router"
import { Header } from "@/components/basic/header"
import MainContent from "@/core-components/main-content"
import Footer from "@/core-components/footer"

export default function LayoutMain() {
  const location = useLocation()
  const isAppointmentsPage = location.pathname === "/appointments"

  if (isAppointmentsPage) {
    return <Outlet />
  }

  return (
    <>
      <Header />
      <MainContent>
        <Outlet />
      </MainContent>
      <Footer />
    </>
  )
}

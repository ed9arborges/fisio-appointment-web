import { Outlet, useLocation } from "react-router"
import { Header } from "@/components/basic/header"
import MainContent from "@/components/layout/main-content"

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

    </>
  )
}

import { Header } from "@/components/basic/header"
import ApointCreate from "../components/layouts/apoint-create"
import ApointList from "../components/layouts/apoint-list"
import MainContent from "@/components/layouts/main-content"

export default function PageAppointments() {
  return (
    <MainContent className="min-h-screen bg-gray-100 relative overflow-hidden flex flex-col md:flex-row gap-4">
      {/* Scheduling sidebar */}
      <aside
        className="w-full  md:w-[498px] bg-gray-600 rounded-xl border-gray-300 flex-shrink-0 m-2 md:m-3"
        aria-label="Scheduling"
      >
        <Header />
        <ApointCreate />
      </aside>

      {/* Appointments list section */}
      <section
        className="w-full flex-1 bg-gray-100 p-4 md:p-20"
        aria-label="Appointments"
      >
        <ApointList />
      </section>
    </MainContent>
  )
}

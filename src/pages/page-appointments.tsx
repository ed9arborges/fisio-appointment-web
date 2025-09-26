import { Header } from "@/components/basic/header"
import ApointCreate from "../components/layout/apoint-create"
import ApointList from "../components/layout/apoint-list"

export default function PageAppointments() {
  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden flex flex-col md:flex-row p-2 md:p-3 gap-4">
      {/* Left sidebar - Scheduling form */}
      <div className="w-full md:w-[498px] md:h-screen bg-gray-600 rounded-xl border-gray-300 flex-shrink-0">
        <Header />
        <ApointCreate />
      </div>

      {/* Right section - Appointments list */}
      <div className="w-full flex-1 bg-gray-100 p-4 md:p-20">
        <ApointList />
      </div>
    </div>
  )
}

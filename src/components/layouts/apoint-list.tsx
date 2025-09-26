import { useState, useEffect } from "react"
import Text from "@/components/basic/text"
import Icon from "@/components/basic/icon"
import Calendar from "@/components/Calendar"
import AppointmentSection from "@/components/layouts/appointment-section"
import { appointmentApi, type GroupedAppointments } from "@/api/appointments"
import { formatDate, formatDateForAPI } from "@/utils/date"
import SunHorizonIcon from "@/assets/icons/SunHorizon.svg?react"
import CloudSunIcon from "@/assets/icons/CloudSun.svg?react"
import MoonStarsIcon from "@/assets/icons/MoonStars.svg?react"
import CaretDownIcon from "@/assets/icons/CaretDown.svg?react"
import CaretLeftIcon from "@/assets/icons/CaretLeft.svg?react"
import CaretRightIcon from "@/assets/icons/CaretRight.svg?react"
import CalendarBlankIcon from "@/assets/icons/CalendarBlank.svg?react"

interface ApointListProps {
  initialDate?: Date
  refreshKey?: number
  onAppointmentChanged?: () => void
}

export default function ApointList({
  initialDate,
  refreshKey,
  onAppointmentChanged,
}: ApointListProps) {
  const [viewDate, setViewDate] = useState(initialDate || new Date())
  const [appointments, setAppointments] = useState<GroupedAppointments>({
    morning: [],
    afternoon: [],
    evening: [],
  })
  const [isViewCalendarOpen, setIsViewCalendarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // formatDate now imported from utils/date

  useEffect(() => {
    loadViewData(viewDate)
    // eslint-disable-next-line
  }, [viewDate, refreshKey])

  async function loadViewData(date: Date) {
    setIsLoading(true)
    try {
      const dateStr = formatDateForAPI(date)
      const appointmentsData = await appointmentApi.getAppointmentsByDate(
        dateStr
      )
      setAppointments(appointmentsData)
    } catch (err) {
      // Optionally handle error
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDeleteAppointment(id: string) {
    const confirmed = window.confirm(
      "Deseja realmente excluir este agendamento?"
    )
    if (!confirmed) return

    try {
      await appointmentApi.deleteAppointment(id)
      await loadViewData(viewDate)
      if (onAppointmentChanged) onAppointmentChanged()
    } catch (err) {
      // Optionally handle error
      console.error(err)
    }
  }

  return (
    <section className="max-w-4xl mx-auto">
      <header className="flex items-start justify-between mb-8">
        <div>
          <Text variant="text-xl-bold" className="text-gray-600 mb-1">
            Sua agenda
          </Text>
          <Text
            as="div"
            variant="text-sm"
            className="hidden md:block text-gray-600"
          >
            Consulte os seus agendamentos por dia
          </Text>
        </div>
        <div className="relative">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const prevDay = new Date(viewDate)
                prevDay.setDate(prevDay.getDate() - 1)
                setViewDate(prevDay)
              }}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Dia anterior"
            >
              <Icon svg={CaretLeftIcon} className="w-4 h-4 fill-gray-600" />
            </button>
            <button
              onClick={() => setIsViewCalendarOpen(!isViewCalendarOpen)}
              className="flex items-center gap-2 px-3 py-3 border border-yellow-500 rounded-lg min-w-38 h-12 hover:border-yellow-600 transition-colors"
            >
              <Icon
                svg={CalendarBlankIcon}
                className="w-5 h-5 fill-yellow-500"
              />
              <div className="flex flex-col items-start flex-1">
                <Text variant="heading-md" className="text-gray-200">
                  {formatDate(viewDate)}
                </Text>
              </div>
              <Icon
                svg={CaretDownIcon}
                className={`w-4 h-4 fill-gray-400 transition-transform ${
                  isViewCalendarOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <button
              onClick={() => {
                const nextDay = new Date(viewDate)
                nextDay.setDate(nextDay.getDate() + 1)
                setViewDate(nextDay)
              }}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Próximo dia"
            >
              <Icon svg={CaretRightIcon} className="w-4 h-4 fill-gray-600" />
            </button>
            <button
              onClick={() => setViewDate(new Date())}
              className="px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
              title="Ir para hoje"
            >
              Hoje
            </button>
          </div>
          <Calendar
            selectedDate={viewDate}
            onDateSelect={(date) => {
              setViewDate(date)
              setIsViewCalendarOpen(false)
            }}
            isOpen={isViewCalendarOpen}
            onClose={() => setIsViewCalendarOpen(false)}
          />
        </div>
      </header>
      <div className="space-y-3">
        <AppointmentSection
          title="Manhã"
          timeRange="09h-12h"
          appointments={appointments.morning}
          iconComponent={SunHorizonIcon}
          onDelete={handleDeleteAppointment}
        />
        <AppointmentSection
          title="Tarde"
          timeRange="13h-18h"
          appointments={appointments.afternoon}
          iconComponent={CloudSunIcon}
          onDelete={handleDeleteAppointment}
        />
        <AppointmentSection
          title="Noite"
          timeRange="19h-21h"
          appointments={appointments.evening}
          iconComponent={MoonStarsIcon}
          onDelete={handleDeleteAppointment}
        />
      </div>
      {isLoading && (
        <div className="text-center py-8">
          <Text variant="text-sm" className="text-gray-400">
            Carregando agendamentos...
          </Text>
        </div>
      )}
    </section>
  )
}

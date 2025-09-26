import { useState, useEffect } from "react"
import Text from "@/components/basic/text"
import Button from "@/components/basic/button"
import Icon from "@/components/basic/icon"
import Calendar from "@/components/Calendar"
import {
  appointmentApi,
  type Appointment as ApiAppointment,
  type AvailableSlots,
  type GroupedAppointments,
} from "@/api/appointments"

// Icons
import CalendarBlankIcon from "@/assets/icons/CalendarBlank.svg?react"
import CaretDownIcon from "@/assets/icons/CaretDown.svg?react"
import CaretLeftIcon from "@/assets/icons/CaretLeft.svg?react"
import CaretRightIcon from "@/assets/icons/CaretRight.svg?react"
import UserSquareIcon from "@/assets/icons/UserSquare.svg?react"
import SunHorizonIcon from "@/assets/icons/SunHorizon.svg?react"
import CloudSunIcon from "@/assets/icons/CloudSun.svg?react"
import MoonStarsIcon from "@/assets/icons/MoonStars.svg?react"
import { Header } from "@/components/basic/header"

interface TimeSlot {
  time: string
  available: boolean
  selected?: boolean
  occupied?: boolean
  deactivated?: boolean
}

export default function PageAppointments() {
  const [selectedDate, setSelectedDate] = useState(new Date()) // Current date - for scheduling
  const [viewDate, setViewDate] = useState(new Date()) // Current date - for viewing appointments
  const [selectedTime, setSelectedTime] = useState("")
  const [clientName, setClientName] = useState("")
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isViewCalendarOpen, setIsViewCalendarOpen] = useState(false)
  const [appointments, setAppointments] = useState<GroupedAppointments>({
    morning: [],
    afternoon: [],
    evening: [],
  })
  const [availableSlots, setAvailableSlots] = useState<AvailableSlots>({
    morning: [
      { time: "09:00", available: true },
      { time: "10:00", available: true },
      { time: "11:00", available: true },
      { time: "12:00", available: true },
    ],
    afternoon: [
      { time: "13:00", available: true },
      { time: "14:00", available: true },
      { time: "15:00", available: true },
      { time: "16:00", available: true },
      { time: "17:00", available: true },
      { time: "18:00", available: true },
    ],
    evening: [
      { time: "19:00", available: true },
      { time: "20:00", available: true },
      { time: "21:00", available: true },
    ],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Helper functions for date formatting
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatDateForAPI = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  // Helper function to check if a time slot is in the past
  const isTimeSlotPast = (date: Date, timeSlot: string) => {
    const now = new Date()
    const [hours, minutes] = timeSlot.split(":").map(Number)
    const slotDateTime = new Date(date)
    slotDateTime.setHours(hours, minutes, 0, 0)

    return slotDateTime < now
  }

  // Load appointments and available slots for the selected date (for scheduling)
  const loadSchedulingData = async (date: Date) => {
    try {
      setIsLoading(true)
      setError("")
      const dateStr = formatDateForAPI(date)

      // First test API connectivity
      console.log("Testing API connectivity...")
      const healthCheck = await fetch(`http://localhost:3333/health`)
      if (!healthCheck.ok) {
        throw new Error(`API server not responding: ${healthCheck.status}`)
      }
      console.log("API connectivity OK")

      const slotsData = await appointmentApi.getAvailableSlots(dateStr)

      // Update available slots with API data while maintaining default structure
      setAvailableSlots(slotsData)
    } catch (err) {
      console.error("Error loading scheduling data:", err)
      setError(err instanceof Error ? err.message : "An error occurred")

      // Keep default slots visible even if API fails
      // This ensures time slots are always visible
    } finally {
      setIsLoading(false)
    }
  }

  // Load appointments for viewing (right section)
  const loadViewData = async (date: Date) => {
    try {
      const dateStr = formatDateForAPI(date)
      const appointmentsData = await appointmentApi.getAppointmentsByDate(
        dateStr
      )
      setAppointments(appointmentsData)
    } catch (err) {
      console.error("Error loading view data:", err)
      // Don't show error for view data loading to avoid confusion
    }
  }

  // Load data when component mounts or dates change
  useEffect(() => {
    loadSchedulingData(selectedDate)
  }, [selectedDate])

  useEffect(() => {
    loadViewData(viewDate)
  }, [viewDate])

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setIsCalendarOpen(false)
    setSelectedTime("") // Reset selected time when changing date
  }

  const handleViewDateSelect = (date: Date) => {
    setViewDate(date)
    setIsViewCalendarOpen(false)
  }

  const handleCreateAppointment = async () => {
    if (!selectedTime || !clientName.trim()) {
      setError("Por favor, selecione um horário e informe o nome do cliente")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      await appointmentApi.createAppointment({
        date: formatDateForAPI(selectedDate),
        time: selectedTime,
        client: clientName.trim(),
      })

      // Reload data to show the new appointment
      await loadSchedulingData(selectedDate)
      await loadViewData(selectedDate)

      // Reset form
      setSelectedTime("")
      setClientName("")

      alert("Agendamento criado com sucesso!")
    } catch (err) {
      console.error("Error creating appointment:", err)
      setError(err instanceof Error ? err.message : "Erro ao criar agendamento")
    } finally {
      setIsLoading(false)
    }
  }

  const TimeSlotButton = ({
    slot,
    onSelect,
  }: {
    slot: TimeSlot
    onSelect: (time: string) => void
  }) => {
    const enhancedSlot = {
      ...slot,
      selected: slot.time === selectedTime,
      occupied: !slot.available,
      deactivated: isTimeSlotPast(selectedDate, slot.time),
    }

    const getButtonStyle = () => {
      if (enhancedSlot.selected) {
        return "bg-blue-base border-blue-base text-white" // Selected state
      } else if (enhancedSlot.occupied) {
        return "bg-red-100 border-red-300 text-red-600 cursor-not-allowed opacity-75" // Occupied state
      } else if (enhancedSlot.deactivated) {
        return "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed opacity-50" // Deactivated (past time)
      } else {
        return "bg-gray-300 border-gray-400 text-gray-200 hover:bg-gray-400 hover:border-gray-500" // Available state
      }
    }

    const isClickable = !enhancedSlot.occupied && !enhancedSlot.deactivated

    return (
      <button
        className={`w-20 h-10 rounded-lg border text-base font-normal transition-colors ${getButtonStyle()}`}
        disabled={!isClickable}
        onClick={() => isClickable && onSelect(slot.time)}
        title={
          enhancedSlot.occupied
            ? "Horário ocupado"
            : enhancedSlot.deactivated
            ? "Horário já passou"
            : enhancedSlot.selected
            ? "Horário selecionado"
            : "Clique para selecionar"
        }
      >
        {slot.time}
      </button>
    )
  }

  const AppointmentSection = ({
    title,
    timeRange,
    appointments: sectionAppointments,
    iconComponent,
  }: {
    title: string
    timeRange: string
    appointments: ApiAppointment[]
    iconComponent: React.FC<React.ComponentProps<"svg">>
  }) => (
    <div className="border border-yellow-400 rounded-lg">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-300">
        <Icon svg={iconComponent} className="w-5 h-5 fill-yellow-600" />
        <Text variant="text-sm" className="text-gray-400 flex-1">
          {title}
        </Text>
        <Text variant="text-sm" className="text-gray-500">
          {timeRange}
        </Text>
      </div>
      <div className="p-5 space-y-1">
        {sectionAppointments.map((appointment, index) => (
          <div key={index} className="flex items-center gap-5 py-1 rounded-lg">
            <Text
              variant="heading-md-bold"
              className="text-gray-200 w-12 text-center"
            >
              {appointment.time}
            </Text>
            <Text variant="heading-md" className="text-gray-200 flex-1">
              {appointment.client}
            </Text>
          </div>
        ))}
        {sectionAppointments.length === 0 && (
          <Text variant="text-sm" className="text-gray-400 text-center py-4">
            Nenhum agendamento para este período
          </Text>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden flex flex-col md:flex-row p-2 md:p-3 gap-4">
      {/* Left sidebar - Scheduling form */}
      <div className="w-full md:w-[498px] md:h-screen bg-gray-600 rounded-xl border-gray-300 flex-shrink-0">
        {/* Logo area */}
        <Header />
        <div className="pt-8 pb-8 px-4 md:px-20 h-full flex flex-col">
          {/* Form content */}
          <div className="mt-11">
            <div className="mb-7">
              <Text variant="text-xl-bold" className="text-blue-base mb-1">
                Agende um atendimento
              </Text>
            </div>

            {/* Date selection */}
            <div className="mb-7 relative">
              <Text variant="heading-md-bold" className="text-gray-200 mb-2">
                Data
              </Text>
              <button
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="flex items-center gap-2 p-3 border border-gray-400 rounded-lg h-12 w-full bg-transparent"
              >
                <Icon
                  svg={CalendarBlankIcon}
                  className="w-5 h-5 fill-yellow-500"
                />
                <Text
                  variant="heading-md"
                  className="text-gray-200 flex-1 text-left"
                >
                  {formatDate(selectedDate)}
                </Text>
                <Icon
                  svg={CaretDownIcon}
                  className={`w-4 h-4 fill-gray-400 transition-transform ${
                    isCalendarOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
              />
            </div>

            {/* Time slots */}
            <div className="mb-7">
              <div className="flex items-center justify-between mb-2">
                <Text variant="heading-md-bold" className="text-gray-200">
                  Horários
                </Text>
                {isLoading && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-blue-base rounded-full animate-spin"></div>
                    <Text variant="text-xs" className="text-gray-400">
                      Atualizando...
                    </Text>
                  </div>
                )}
              </div>

              {/* Legend */}
              <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                <Text variant="text-xs" className="text-gray-400 mb-2">
                  Legenda:
                </Text>
                <div className="flex flex-wrap gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 border border-gray-400 rounded"></div>
                    <Text variant="text-xs" className="text-gray-400">
                      Disponível
                    </Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-base border border-blue-base rounded"></div>
                    <Text variant="text-xs" className="text-gray-400">
                      Selecionado
                    </Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                    <Text variant="text-xs" className="text-gray-400">
                      Ocupado
                    </Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded opacity-50"></div>
                    <Text variant="text-xs" className="text-gray-400">
                      Expirado
                    </Text>
                  </div>
                </div>
              </div>

              {/* Morning slots */}
              <div className="mb-3">
                <Text variant="text-sm" className="text-gray-400 mb-2">
                  Manhã (09h-12h)
                </Text>
                <div className="flex gap-2 flex-wrap">
                  {availableSlots.morning.map((slot, index) => (
                    <TimeSlotButton
                      key={index}
                      slot={slot}
                      onSelect={setSelectedTime}
                    />
                  ))}
                </div>
              </div>

              {/* Afternoon slots */}
              <div className="mb-3">
                <Text variant="text-sm" className="text-gray-400 mb-2">
                  Tarde (13h-18h)
                </Text>
                <div className="flex gap-2 flex-wrap">
                  {availableSlots.afternoon.map((slot, index) => (
                    <TimeSlotButton
                      key={index}
                      slot={slot}
                      onSelect={setSelectedTime}
                    />
                  ))}
                </div>
              </div>

              {/* Evening slots */}
              <div className="mb-3">
                <Text variant="text-sm" className="text-gray-400 mb-2">
                  Noite (19h-21h)
                </Text>
                <div className="flex gap-2 flex-wrap">
                  {availableSlots.evening.map((slot, index) => (
                    <TimeSlotButton
                      key={index}
                      slot={slot}
                      onSelect={setSelectedTime}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Client name */}
            <div className="mb-8">
              <Text variant="heading-md-bold" className="text-gray-200 mb-2">
                Cliente
              </Text>
              <div className="flex items-center gap-2 p-3 border border-gray-400 rounded-lg h-12">
                <Icon
                  svg={UserSquareIcon}
                  className="w-5 h-5 fill-yellow-500"
                />
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Nome do cliente"
                  className="flex-1 bg-transparent text-gray-200 placeholder-gray-400 outline-none"
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 border border-red-400 bg-red-100 rounded-lg">
                <Text
                  variant="text-sm"
                  className="text-red-600 font-semibold mb-2"
                >
                  ❌ Erro de Conexão
                </Text>
                <Text variant="text-xs" className="text-red-600 mb-2">
                  {error}
                </Text>
                <Text variant="text-xs" className="text-red-500">
                  💡 Verifique se a API está rodando em http://localhost:3333
                </Text>
                <div className="mt-2 pt-2 border-t border-red-300">
                  <Text variant="text-xs" className="text-red-500">
                    🔧 Para iniciar a API:{" "}
                    <code className="bg-red-200 px-1 rounded">
                      cd api && npm run dev
                    </code>
                  </Text>
                  <button
                    onClick={() => {
                      loadSchedulingData(selectedDate)
                      loadViewData(viewDate)
                    }}
                    className="mt-2 px-3 py-1 bg-red-200 text-red-700 rounded text-xs hover:bg-red-300"
                    disabled={isLoading}
                  >
                    {isLoading ? "Testando..." : "🔄 Tentar Novamente"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Schedule button - positioned at bottom */}
          <div className="mt-auto">
            <Button
              variant="primary"
              className="w-full h-14 bg-blue-base hover:bg-blue-light text-gray-600 font-bold rounded-lg disabled:opacity-50"
              onClick={handleCreateAppointment}
              disabled={isLoading || !selectedTime || !clientName.trim()}
            >
              {isLoading ? "AGENDANDO..." : "AGENDAR"}
            </Button>
          </div>
        </div>
      </div>

      {/* Right section - Appointments list */}
      <div className="w-full flex-1 bg-gray-100 p-4 md:p-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <Text variant="text-xl-bold" className="text-gray-600 mb-1">
                Sua agenda
              </Text>
              <Text as="span" variant="text-sm" className="text-gray-400">
                Consulte os seus agendamentos por dia (passados ou futuros)
              </Text>
            </div>
            <div className="relative">
              <div className="flex items-center gap-2">
                {/* Previous day button */}
                <button
                  onClick={() => {
                    const prevDay = new Date(viewDate)
                    prevDay.setDate(prevDay.getDate() - 1)
                    setViewDate(prevDay)
                  }}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Dia anterior"
                >
                  <Icon svg={CaretLeftIcon} className="w-4 h-4 fill-gray-400" />
                </button>

                {/* Date selector */}
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
                    {viewDate.toDateString() === new Date().toDateString() && (
                      <Text variant="text-xs" className="text-yellow-600">
                        Hoje
                      </Text>
                    )}
                    {viewDate < new Date() &&
                      viewDate.toDateString() !== new Date().toDateString() && (
                        <Text variant="text-xs" className="text-gray-400">
                          Passado
                        </Text>
                      )}
                    {viewDate > new Date() && (
                      <Text variant="text-xs" className="text-blue-500">
                        Futuro
                      </Text>
                    )}
                  </div>
                  <Icon
                    svg={CaretDownIcon}
                    className={`w-4 h-4 fill-gray-400 transition-transform ${
                      isViewCalendarOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Next day button */}
                <button
                  onClick={() => {
                    const nextDay = new Date(viewDate)
                    nextDay.setDate(nextDay.getDate() + 1)
                    setViewDate(nextDay)
                  }}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Próximo dia"
                >
                  <Icon
                    svg={CaretRightIcon}
                    className="w-4 h-4 fill-gray-400"
                  />
                </button>

                {/* Today button */}
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
                onDateSelect={handleViewDateSelect}
                isOpen={isViewCalendarOpen}
                onClose={() => setIsViewCalendarOpen(false)}
              />
            </div>
          </div>

          {/* Appointments sections */}
          <div className="space-y-3">
            {/* Summary */}
            <div className="mb-4 p-4 bg-gray-200 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <Text variant="heading-md-bold" className="text-gray-600">
                    Resumo do Dia
                  </Text>
                  <Text variant="text-sm" className="text-gray-400">
                    Total de agendamentos para {formatDate(viewDate)}
                  </Text>
                </div>
                <div className="text-right">
                  <Text variant="text-xl-bold" className="text-blue-base">
                    {appointments.morning.length +
                      appointments.afternoon.length +
                      appointments.evening.length}
                  </Text>
                  <Text variant="text-sm" className="text-gray-400">
                    agendamentos
                  </Text>
                </div>
              </div>
              <div className="flex gap-6 mt-3 text-sm">
                <div className="flex items-center gap-2">
                  <Icon
                    svg={SunHorizonIcon}
                    className="w-4 h-4 fill-yellow-500"
                  />
                  <Text variant="text-sm" className="text-gray-500">
                    Manhã: {appointments.morning.length}
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <Icon
                    svg={CloudSunIcon}
                    className="w-4 h-4 fill-yellow-500"
                  />
                  <Text variant="text-sm" className="text-gray-500">
                    Tarde: {appointments.afternoon.length}
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <Icon
                    svg={MoonStarsIcon}
                    className="w-4 h-4 fill-yellow-500"
                  />
                  <Text variant="text-sm" className="text-gray-500">
                    Noite: {appointments.evening.length}
                  </Text>
                </div>
              </div>
            </div>

            <AppointmentSection
              title="Manhã"
              timeRange="09h-12h"
              appointments={appointments.morning}
              iconComponent={SunHorizonIcon}
            />

            <AppointmentSection
              title="Tarde"
              timeRange="13h-18h"
              appointments={appointments.afternoon}
              iconComponent={CloudSunIcon}
            />

            <AppointmentSection
              title="Noite"
              timeRange="19h-21h"
              appointments={appointments.evening}
              iconComponent={MoonStarsIcon}
            />
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="text-center py-8">
              <Text variant="text-sm" className="text-gray-400">
                Carregando agendamentos...
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

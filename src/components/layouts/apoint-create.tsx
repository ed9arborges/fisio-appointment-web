import { useState, useEffect } from "react"
import Text from "@/components/basic/text"
import Button from "@/components/basic/button"
import Icon from "@/components/basic/icon"
import Calendar from "@/components/Calendar"
import TimeSlotButton from "@/components/basic/time-slot-button"
import { formatDate, formatDateForAPI } from "@/utils/date"
import UserSquareIcon from "@/assets/icons/UserSquare.svg?react"
import { appointmentApi, type AvailableSlots } from "@/api/appointments"
import CalendarBlankIcon from "@/assets/icons/CalendarBlank.svg?react"
import CaretDownIcon from "@/assets/icons/CaretDown.svg?react"

export interface TimeSlot {
  time: string
  available: boolean
  selected?: boolean
  occupied?: boolean
  deactivated?: boolean
}

interface ApointCreateProps {
  refreshKey?: number
  onAppointmentChanged?: () => void
}

const defaultSlots: AvailableSlots = {
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
}

// removed duplicate formatDate and formatDateForAPI, now imported from utils/AppError
function isTimeSlotPast(date: Date, timeSlot: string) {
  const now = new Date()
  const [hours, minutes] = timeSlot.split(":").map(Number)
  const slotDateTime = new Date(date)
  slotDateTime.setHours(hours, minutes, 0, 0)
  return slotDateTime < now
}

export default function ApointCreate({
  refreshKey,
  onAppointmentChanged,
}: ApointCreateProps) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState("")
  const [clientName, setClientName] = useState("")
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [availableSlots, setAvailableSlots] =
    useState<AvailableSlots>(defaultSlots)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadSchedulingData(selectedDate)
  }, [selectedDate, refreshKey])

  async function loadSchedulingData(date: Date) {
    try {
      setIsLoading(true)
      setError("")
      const dateStr = formatDateForAPI(date)
      const healthCheck = await fetch(`http://localhost:3333/health`)
      if (!healthCheck.ok)
        throw new Error(`API server not responding: ${healthCheck.status}`)
      const slotsData = await appointmentApi.getAvailableSlots(dateStr)
      setAvailableSlots(slotsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreateAppointment() {
    if (!selectedTime || !clientName.trim()) {
      setError("Por favor, selecione um horário e informe o nome do cliente")
      return
    }
    try {
      await appointmentApi.createAppointment({
        date: formatDateForAPI(selectedDate),
        time: selectedTime,
        client: clientName.trim(),
      })
      await loadSchedulingData(selectedDate)
      setSelectedTime("")
      setClientName("")
      if (onAppointmentChanged) onAppointmentChanged()
      alert("Agendamento criado com sucesso!")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar agendamento")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="pt-8 pb-8 px-4 md:px-20 flex flex-col mt-4">
      <header className="">
        <div className="mb-7">
          <Text variant="text-xl-bold" className="text-blue-base mb-1">
            Agende um atendimento
          </Text>
        </div>
      </header>
      <div className="mb-7 relative">
        <Text variant="heading-md-bold" className="text-gray-200 mb-2">
          Data
        </Text>
        <button
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className="flex items-center gap-2 p-3 border border-gray-400 rounded-lg h-12 w-full bg-transparent"
        >
          <Icon svg={CalendarBlankIcon} className="w-5 h-5 fill-yellow-500" />
          <Text variant="heading-md" className="text-gray-200 flex-1 text-left">
            {formatDate(selectedDate)}
          </Text>
        </button>
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={(date) => {
            setSelectedDate(date)
            setIsCalendarOpen(false)
            setSelectedTime("")
          }}
          isOpen={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
        />
      </div>
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
        <div className="mb-3">
          <Text variant="text-sm" className="text-gray-400 mb-2">
            Manhã (09h-12h)
          </Text>
          <div className="flex gap-2 flex-wrap">
            {availableSlots.morning.map((slot, index) => (
              <TimeSlotButton
                key={index}
                slot={slot}
                selectedTime={selectedTime}
                selectedDate={selectedDate}
                onSelect={setSelectedTime}
              />
            ))}
          </div>
        </div>
        <div className="mb-3">
          <Text variant="text-sm" className="text-gray-400 mb-2">
            Tarde (13h-18h)
          </Text>
          <div className="flex gap-2 flex-wrap">
            {availableSlots.afternoon.map((slot, index) => (
              <TimeSlotButton
                key={index}
                slot={slot}
                selectedTime={selectedTime}
                selectedDate={selectedDate}
                onSelect={setSelectedTime}
              />
            ))}
          </div>
        </div>
        <div className="mb-3">
          <Text variant="text-sm" className="text-gray-400 mb-2">
            Noite (19h-21h)
          </Text>
          <div className="flex gap-2 flex-wrap">
            {availableSlots.evening.map((slot, index) => (
              <TimeSlotButton
                key={index}
                slot={slot}
                selectedTime={selectedTime}
                selectedDate={selectedDate}
                onSelect={setSelectedTime}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mb-8">
        <Text variant="heading-md-bold" className="text-gray-200 mb-2">
          Cliente
        </Text>
        <div className="flex items-center gap-2 p-3 border border-gray-400 rounded-lg h-12">
          <Icon svg={UserSquareIcon} className="w-5 h-5 fill-yellow-500" />
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Nome do cliente"
            className="flex-1 bg-transparent text-gray-200 placeholder-gray-400 outline-none"
          />
        </div>
      </div>
      {error && (
        <div className="mb-4 p-3 border border-red-400 bg-red-100 rounded-lg">
          <Text variant="text-sm" className="text-red-600 font-semibold mb-2">
            ❌ Erro de Conexão
          </Text>
          <Text variant="text-xs" className="text-red-600 mb-2">
            {error}
          </Text>
        </div>
      )}

      <Button
        variant="primary"
        size="lg"
        className="w-full text-gray-600 disabled:opacity-50"
        onClick={handleCreateAppointment}
        disabled={isLoading || !selectedTime || !clientName.trim()}
      >
        {isLoading ? "AGENDANDO..." : "AGENDAR"}
      </Button>
    </section>
  )
}

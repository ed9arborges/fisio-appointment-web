import { useState } from "react"
import Text from "@/components/basic/text"
import Button from "@/components/basic/button"
import Icon from "@/components/basic/icon"
import Calendar from "@/components/Calendar"

// Icons
import CalendarBlankIcon from "@/assets/icons/CalendarBlank.svg?react"
import CaretDownIcon from "@/assets/icons/CaretDown.svg?react"
import UserSquareIcon from "@/assets/icons/UserSquare.svg?react"
import SunHorizonIcon from "@/assets/icons/SunHorizon.svg?react"
import CloudSunIcon from "@/assets/icons/CloudSun.svg?react"
import MoonStarsIcon from "@/assets/icons/MoonStars.svg?react"
import { Header } from "@/components/basic/header"

interface Appointment {
  time: string
  client: string
}

interface TimeSlot {
  time: string
  available: boolean
  selected?: boolean
}

export default function PageAppointments() {
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 8, 10)) // September 10, 2025
  const [selectedTime, setSelectedTime] = useState("20:00")
  const [clientName] = useState("Helena Souza")
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  // Helper functions for date formatting
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setIsCalendarOpen(false)
  }

  // Mock data for existing appointments
  const morningAppointments: Appointment[] = [
    { time: "11:00", client: "Ryan Dorwart" },
  ]

  const afternoonAppointments: Appointment[] = [
    { time: "13:00", client: "Livia Curtis" },
    { time: "14:00", client: "Randy Calzoni" },
    { time: "16:00", client: "Marley Franci" },
    { time: "17:00", client: "Jaylon Korsgaard" },
  ]

  const eveningAppointments: Appointment[] = [
    { time: "21:00", client: "Maria Herwitz" },
  ]

  // Available time slots
  const morningSlots: TimeSlot[] = [
    { time: "09:00", available: true },
    { time: "10:00", available: true },
    { time: "11:00", available: false }, // occupied
    { time: "12:00", available: true },
  ]

  const afternoonSlots: TimeSlot[] = [
    { time: "13:00", available: false }, // occupied
    { time: "14:00", available: false }, // occupied
    { time: "15:00", available: true },
    { time: "16:00", available: false }, // occupied
    { time: "17:00", available: false }, // occupied
    { time: "18:00", available: true },
  ]

  const eveningSlots: TimeSlot[] = [
    { time: "19:00", available: true },
    { time: "20:00", available: true, selected: selectedTime === "20:00" },
    { time: "21:00", available: false }, // occupied
  ]

  const TimeSlotButton = ({
    slot,
    onSelect,
  }: {
    slot: TimeSlot
    onSelect: (time: string) => void
  }) => (
    <button
      className={`w-20 h-10 rounded-lg border text-base font-normal transition-colors ${
        slot.selected
          ? "bg-blue-base border-gray-600 text-gray-600"
          : slot.available
          ? "bg-gray-300 border-gray-400 text-gray-200 hover:bg-gray-400"
          : "bg-transparent border-gray-300 text-gray-400 cursor-not-allowed opacity-50"
      }`}
      disabled={!slot.available}
      onClick={() => slot.available && onSelect(slot.time)}
    >
      {slot.time}
    </button>
  )

  const AppointmentSection = ({
    title,
    timeRange,
    appointments,
    iconComponent,
  }: {
    title: string
    timeRange: string
    appointments: Appointment[]
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
        {appointments.map((appointment, index) => (
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
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden flex p-3">
      {/* Left sidebar - Scheduling form */}
      <div className="w-[498px] h-screen bg-gray-600 relative rounded-xl border-gray-300">
        {/* Logo area */}
        <Header />

        <div className="pt-20 pb-12 px-20 h-full flex flex-col">
          {/* Form content */}
          <div className="mt-11">
            <div className="mb-7">
              <Text variant="text-xl-bold" className="text-gray-600 mb-1">
                Agende um atendimento
              </Text>
              <Text variant="text-sm" className="text-gray-400">
                Selecione data, horário e informe o nome do cliente para criar o
                agendamento
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
              <Text variant="heading-md-bold" className="text-gray-200 mb-2">
                Horários
              </Text>

              {/* Morning slots */}
              <div className="mb-3">
                <Text variant="text-sm" className="text-gray-400 mb-2">
                  Manhã
                </Text>
                <div className="flex gap-2 flex-wrap">
                  {morningSlots.map((slot, index) => (
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
                  Tarde
                </Text>
                <div className="flex gap-2 flex-wrap">
                  {afternoonSlots.map((slot, index) => (
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
                  Noite
                </Text>
                <div className="flex gap-2 flex-wrap">
                  {eveningSlots.map((slot, index) => (
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
                <Text variant="heading-md" className="text-gray-200">
                  {clientName}
                </Text>
              </div>
            </div>
          </div>

          {/* Schedule button - positioned at bottom */}
          <div className="mt-auto">
            <Button
              variant="primary"
              className="w-full h-14 bg-blue-base hover:bg-blue-light text-gray-600 font-bold rounded-lg"
            >
              AGENDAR
            </Button>
          </div>
        </div>
      </div>

      {/* Right side - Appointments list */}
      <div className="flex-1 bg-gray-100 p-20">
        <div className="max-w-4xl">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <Text variant="text-xl-bold" className="text-gray-600 mb-1">
                Sua agenda
              </Text>
              <Text variant="text-sm" className="text-gray-400">
                Consulte os seus cortes de cabelo agendados por dia
              </Text>
            </div>
            <div className="flex items-center gap-2 px-3 py-3 border border-yellow-500 rounded-lg min-w-38 h-12">
              <Icon
                svg={CalendarBlankIcon}
                className="w-5 h-5 fill-yellow-500"
              />
              <Text variant="heading-md" className="text-gray-200 flex-1">
                {formatDate(selectedDate)}
              </Text>
              <Icon svg={CaretDownIcon} className="w-4 h-4 fill-gray-400" />
            </div>
          </div>

          {/* Appointments sections */}
          <div className="space-y-3">
            <AppointmentSection
              title="Manhã"
              timeRange="09h-12h"
              appointments={morningAppointments}
              iconComponent={SunHorizonIcon}
            />

            <AppointmentSection
              title="Tarde"
              timeRange="13h-18h"
              appointments={afternoonAppointments}
              iconComponent={CloudSunIcon}
            />

            <AppointmentSection
              title="Noite"
              timeRange="19h-21h"
              appointments={eveningAppointments}
              iconComponent={MoonStarsIcon}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

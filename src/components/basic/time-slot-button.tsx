import { cva } from "class-variance-authority"
import Button from "@/components/basic/button"
import Text from "@/components/basic/text"
import React from "react"

const timeSlotButtonStyles = cva(
  "w-20 h-10 rounded-lg border text-base font-normal transition-colors",
  {
    variants: {
      state: {
        selected: "bg-blue-base border-blue-base text-gray-600",
        occupied:
          "bg-red-100 border-red-300 text-red-600 cursor-not-allowed opacity-75",
        deactivated:
          "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed opacity-50",
        available:
          "bg-gray-300 border-gray-400 text-gray-200 hover:bg-gray-400 hover:border-gray-500",
      },
    },
    defaultVariants: {
      state: "available",
    },
  }
)

export interface TimeSlot {
  time: string
  available: boolean
  selected?: boolean
  occupied?: boolean
  deactivated?: boolean
}

interface TimeSlotButtonProps {
  slot: TimeSlot
  selectedTime: string
  selectedDate: Date
  onSelect: (time: string) => void
}

function isTimeSlotPast(date: Date, timeSlot: string) {
  const now = new Date()
  const [hours, minutes] = timeSlot.split(":").map(Number)
  const slotDateTime = new Date(date)
  slotDateTime.setHours(hours, minutes, 0, 0)
  return slotDateTime < now
}

const TimeSlotButton: React.FC<TimeSlotButtonProps> = ({
  slot,
  selectedTime,
  selectedDate,
  onSelect,
}) => {
  const enhancedSlot = {
    ...slot,
    selected: slot.time === selectedTime,
    occupied: !slot.available,
    deactivated: isTimeSlotPast(selectedDate, slot.time),
  }

  let state: "selected" | "occupied" | "deactivated" | "available" = "available"
  if (enhancedSlot.selected) state = "selected"
  else if (enhancedSlot.occupied) state = "occupied"
  else if (enhancedSlot.deactivated) state = "deactivated"

  const isClickable = state === "available"

  return (
    <Button
      variant="primary"
      className={timeSlotButtonStyles({ state })}
      disabled={!isClickable}
      onClick={() => isClickable && onSelect(slot.time)}
      title={
        state === "occupied"
          ? "Horário ocupado"
          : state === "deactivated"
          ? "Horário já passou"
          : state === "selected"
          ? "Horário selecionado"
          : "Clique para selecionar"
      }
    >
      <Text variant="heading-md" className="w-full text-center">
        {slot.time}
      </Text>
    </Button>
  )
}

export default TimeSlotButton

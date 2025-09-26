import { useState, useEffect } from "react"
import Text from "@/components/basic/text"
import Icon from "@/components/basic/icon"
import CaretLeftIcon from "@/assets/icons/CaretLeft.svg?react"
import CaretRightIcon from "@/assets/icons/CaretRight.svg?react"

interface CalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  isOpen: boolean
  onClose: () => void
  className?: string
}

export default function Calendar({
  selectedDate,
  onDateSelect,
  isOpen,
  onClose,
  className = "",
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  )

  // Close calendar when clicking outside or pressing escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".calendar-container")) {
        onClose()
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  // Helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
  }

  const isToday = (month: Date, day: number) => {
    const today = new Date()
    return (
      month.getFullYear() === today.getFullYear() &&
      month.getMonth() === today.getMonth() &&
      day === today.getDate()
    )
  }

  const isPastDate = (month: Date, day: number) => {
    const today = new Date()
    const checkDate = new Date(month.getFullYear(), month.getMonth(), day)
    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    )
    return checkDate < todayDate
  }

  const isSelectedDate = (month: Date, day: number) => {
    return (
      month.getFullYear() === selectedDate.getFullYear() &&
      month.getMonth() === selectedDate.getMonth() &&
      day === selectedDate.getDate()
    )
  }

  const canNavigateToPrevMonth = () => {
    const today = new Date()
    const currentYearMonth = today.getFullYear() * 12 + today.getMonth()
    const prevMonth = new Date(currentMonth)
    prevMonth.setMonth(prevMonth.getMonth() - 1)
    const prevYearMonth = prevMonth.getFullYear() * 12 + prevMonth.getMonth()
    return prevYearMonth >= currentYearMonth
  }

  const handleDateSelect = (day: number) => {
    // Don't allow selection of past dates
    if (isPastDate(currentMonth, day)) {
      return
    }

    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    )
    onDateSelect(newDate)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev)
      if (direction === "prev") {
        newMonth.setMonth(newMonth.getMonth() - 1)
        // Don't allow navigation to months before current month
        const today = new Date()
        const currentYearMonth = today.getFullYear() * 12 + today.getMonth()
        const newYearMonth = newMonth.getFullYear() * 12 + newMonth.getMonth()
        if (newYearMonth < currentYearMonth) {
          return prev // Return previous month if trying to go to past
        }
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1)
      }
      return newMonth
    })
  }

  if (!isOpen) return null

  // Calendar grid calculations
  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth)
  const prevMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() - 1,
    1
  )
  const daysInPrevMonth = getDaysInMonth(prevMonth)

  // Create arrays for calendar grid
  const prevDays = Array.from(
    { length: firstDayOfMonth },
    (_, i) => daysInPrevMonth - firstDayOfMonth + i + 1
  )
  const currentDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const nextDays = Array.from(
    { length: 42 - firstDayOfMonth - daysInMonth },
    (_, i) => i + 1
  )

  return (
    <div
      className={`calendar-container absolute left-0 right-0 top-full z-50 bg-gray-300 border border-gray-400 rounded-lg shadow-lg p-4 ${className}`}
    >
      {/* Month navigation */}
      <div className="flex items-center justify-between p-2 mb-2">
        <button
          onClick={() => navigateMonth("prev")}
          disabled={!canNavigateToPrevMonth()}
          className={`p-1 rounded ${
            !canNavigateToPrevMonth()
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-400"
          }`}
          title="Mês anterior"
        >
          <Icon svg={CaretLeftIcon} className="w-4 h-4 fill-gray-600" />
        </button>
        <Text variant="text-sm-bold" className="text-gray-600 capitalize">
          {getMonthName(currentMonth)}
        </Text>
        <button
          onClick={() => navigateMonth("next")}
          className="p-1 rounded hover:bg-gray-400"
          title="Próximo mês"
        >
          <Icon svg={CaretRightIcon} className="w-4 h-4 fill-gray-600" />
        </button>
      </div>

      {/* Days of week header */}
      <div className="flex justify-between items-center py-1 mb-1">
        {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => (
          <div key={index} className="w-8 h-8 flex items-center justify-center">
            <Text variant="text-sm-bold" className="text-gray-500">
              {day}
            </Text>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="space-y-0">
        {Array.from({ length: 6 }, (_, weekIndex) => (
          <div key={weekIndex} className="flex justify-between">
            {Array.from({ length: 7 }, (_, dayIndex) => {
              const dayNumber = weekIndex * 7 + dayIndex
              let day: number
              let isPrevMonth = false
              let isNextMonth = false

              if (dayNumber < firstDayOfMonth) {
                // Previous month days
                day = prevDays[dayNumber]
                isPrevMonth = true
              } else if (dayNumber < firstDayOfMonth + daysInMonth) {
                // Current month days
                day = currentDays[dayNumber - firstDayOfMonth]
              } else {
                // Next month days
                day = nextDays[dayNumber - firstDayOfMonth - daysInMonth]
                isNextMonth = true
              }

              const isCurrentDay =
                !isPrevMonth && !isNextMonth && isToday(currentMonth, day)
              const isSelected =
                !isPrevMonth &&
                !isNextMonth &&
                isSelectedDate(currentMonth, day)

              // Check if this date is in the past (only for current month dates)
              const isPastDateCheck =
                !isPrevMonth && !isNextMonth && isPastDate(currentMonth, day)
              const isDisabled = isPrevMonth || isNextMonth || isPastDateCheck

              return (
                <button
                  key={dayIndex}
                  onClick={() => !isDisabled && handleDateSelect(day)}
                  disabled={isDisabled}
                  className={`w-8 h-8 rounded flex items-center justify-center relative transition-colors ${
                    isPrevMonth || isNextMonth
                      ? "bg-gray-300 cursor-not-allowed"
                      : isPastDateCheck
                      ? "cursor-not-allowed"
                      : isSelected
                      ? "bg-gray-400 border border-yellow-600"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                >
                  <Text
                    variant="text-sm"
                    className={`${
                      isPrevMonth || isNextMonth
                        ? "text-gray-500"
                        : isPastDateCheck
                        ? "text-gray-400 line-through"
                        : isSelected
                        ? "text-yellow-600 font-bold"
                        : isCurrentDay
                        ? "text-gray-600 font-bold"
                        : "text-gray-600"
                    }`}
                  >
                    {day}
                  </Text>
                  {isCurrentDay && !isSelected && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-0.5 border border-gray-600" />
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

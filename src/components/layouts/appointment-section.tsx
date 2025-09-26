import React from "react"
import Text from "@/components/basic/text"
import Icon from "@/components/basic/icon"
import type { Appointment } from "@/api/appointments"
import TrashIcon from "@/assets/icons/trash.svg?react"

interface AppointmentSectionProps {
  title: string
  timeRange: string
  appointments: Appointment[]
  iconComponent: React.FC<React.SVGProps<SVGSVGElement>>
  onDelete?: (id: string) => void
}

const AppointmentSection: React.FC<AppointmentSectionProps> = ({
  title,
  timeRange,
  appointments,
  iconComponent,
  onDelete,
}) => (
  <section className="border border-yellow-400 rounded-lg">
    <header className="flex items-center gap-3 px-5 py-3 border-b border-gray-300">
      <Icon svg={iconComponent} className="w-5 h-5 fill-yellow-600" />
      <Text variant="text-sm" className="text-gray-600 flex-1">
        {title}
      </Text>
      <Text variant="text-sm" className="text-gray-600">
        {timeRange}
      </Text>
    </header>
    <div className="p-5 space-y-1">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="flex items-center gap-5 py-1 rounded-lg"
        >
          <Text
            variant="heading-md-bold"
            className="text-gray-200 w-12 text-center"
          >
            {appointment.time}
          </Text>
          <Text variant="heading-md" className="text-gray-200 flex-1">
            {appointment.client}
          </Text>
          <button
            title="Excluir agendamento"
            className="p-2 rounded hover:bg-red-100 transition-colors"
            onClick={() => onDelete?.(appointment.id)}
          >
            <Icon svg={TrashIcon} className="w-5 h-5 fill-gray-600" />
          </button>
        </div>
      ))}
      {appointments.length === 0 && (
        <Text variant="text-sm" className="text-gray-400 text-center py-4">
          Nenhum agendamento para este período
        </Text>
      )}
    </div>
  </section>
)

export default AppointmentSection

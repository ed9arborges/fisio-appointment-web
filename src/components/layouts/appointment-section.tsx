import Text from "@/components/basic/text"
import Icon from "@/components/basic/icon"
import { type Appointment as ApiAppointment, appointmentApi } from "@/api/appointments"
import TrashIcon from "@/assets/icons/trash.svg?react"

  title: string
  timeRange: string
  appointments: ApiAppointment[]
  iconComponent: React.FC<React.ComponentProps<"svg">>
  onDelete?: (id: string) => void
}

const AppointmentSection = ({
  title,
  timeRange,
  appointments: sectionAppointments,
  iconComponent,
  onDelete,
}: AppointmentSectionProps) => (
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
          <button
            title="Excluir agendamento"
            className="p-2 rounded hover:bg-red-100 transition-colors"
            onClick={async () => {
              if (window.confirm("Deseja realmente excluir este agendamento?")) {
                await appointmentApi.deleteAppointment(appointment.id)
                if (onDelete) onDelete(appointment.id)
              }
            }}
          >
            <Icon svg={TrashIcon} className="w-5 h-5 fill-red-600" />
          </button>
        </div>
      ))}
      {sectionAppointments.length === 0 && (
        <Text variant="text-sm" className="text-gray-400 text-center py-4">
          Nenhum agendamento para este período
        </Text>
      )}
    </div>
  </section>
)

export default AppointmentSection

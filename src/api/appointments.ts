const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(
    /\/$/,
    ""
  ) ?? "http://localhost:3333"

export interface Appointment {
  id: string
  date: string
  time: string
  client: string
  createdAt: string
  updatedAt: string
}

export interface GroupedAppointments {
  morning: Appointment[]
  afternoon: Appointment[]
  evening: Appointment[]
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface AvailableSlots {
  morning: TimeSlot[]
  afternoon: TimeSlot[]
  evening: TimeSlot[]
}

export interface CreateAppointmentData {
  date: string
  time: string
  client: string
}

class AppointmentApi {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    try {
      console.log(`Making request to: ${url}`)

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for CORS
        mode: "cors", // Explicitly set CORS mode
        ...options,
      })

      console.log(`Response status: ${response.status}`)

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: `HTTP Error ${response.status}: ${response.statusText}`,
        }))
        throw new Error(error.message || `HTTP Error ${response.status}`)
      }

      if (
        response.status === 204 ||
        response.headers.get("content-length") === "0"
      ) {
        return undefined as T
      }

      return response.json()
    } catch (error) {
      console.error(`API request failed:`, error)
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          `Cannot connect to API server at ${API_BASE_URL}. Make sure the server is running.`
        )
      }
      throw error
    }
  }

  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    return this.request<Appointment>("/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getAppointmentsByDate(date: string): Promise<GroupedAppointments> {
    const dateParam = encodeURIComponent(date)
    return this.request<GroupedAppointments>(`/appointments?date=${dateParam}`)
  }

  async getAvailableSlots(date: string): Promise<AvailableSlots> {
    const dateParam = encodeURIComponent(date)
    return this.request<AvailableSlots>(
      `/appointments/available-slots?date=${dateParam}`
    )
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return this.request<Appointment[]>("/appointments/all")
  }

  async deleteAppointment(id: string): Promise<void> {
    return this.request<void>(`/appointments/${id}`, {
      method: "DELETE",
    })
  }
}

export const appointmentApi = new AppointmentApi()

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert a 24-hour "HH:MM" string to 12-hour "h:MM AM/PM" format.
export function formatTime12h(time24?: string | null): string {
  if (!time24) return ''
  const match = /^(\d{1,2}):(\d{2})/.exec(time24.trim())
  if (!match) return time24
  let hour = parseInt(match[1], 10)
  const minute = match[2]
  const period = hour >= 12 ? 'PM' : 'AM'
  hour = hour % 12
  if (hour === 0) hour = 12
  return `${hour}:${minute} ${period}`
}

// Registrations close at the event's registration_end_time (datetime-local string).
// When it is not set, registrations stay open until the event itself starts.
export function registrationDeadline(event: {
  date?: string
  time?: string
  registration_end_time?: string | null
}): Date | null {
  if (event.registration_end_time) {
    const deadline = new Date(event.registration_end_time)
    if (!Number.isNaN(deadline.getTime())) return deadline
  }
  if (!event.date) return null
  const start = new Date(`${event.date} ${event.time || '00:00'}`)
  return Number.isNaN(start.getTime()) ? null : start
}

export function isRegistrationClosed(event: {
  date?: string
  time?: string
  registration_end_time?: string | null
}): boolean {
  const deadline = registrationDeadline(event)
  return deadline ? new Date() > deadline : false
}

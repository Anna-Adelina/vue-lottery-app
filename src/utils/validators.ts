export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export const PHONE_REGEX = /^\+380\d{9}$/

// Сьогоднішня дата у форматі yyyy-mm-dd за локальним часом
export function getTodayIso(): string {
  const d = new Date()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

// Формат yyyy-mm-dd можна порівнювати як рядки
export function isFutureDate(value: string): boolean {
  return value > getTodayIso()
}
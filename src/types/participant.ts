export interface Participant {
  id: string
  name: string
  birthDate: string // формат yyyy-mm-dd (так повертає input type="date")
  email: string
  phone: string // +380XXXXXXXXX
}

// Дані форми (без id, його генеруємо при збереженні)
export type ParticipantForm = Omit<Participant, 'id'>
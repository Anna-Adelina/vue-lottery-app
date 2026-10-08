import type { Participant } from '@/types/participant'

export const STORAGE_KEY = 'vue-lottery-app:v1'
export const MAX_WINNERS = 3

export interface LotteryState {
  participants: Participant[]
  winnerIds: string[]
}

function isParticipant(value: unknown): value is Participant {
  if (typeof value !== 'object' || value === null) return false
  const p = value as Record<string, unknown>
  return (
    typeof p.id === 'string' &&
    typeof p.name === 'string' &&
    typeof p.birthDate === 'string' &&
    typeof p.email === 'string' &&
    typeof p.phone === 'string'
  )
}

/**
 * Читає стан із localStorage. Будь-яка проблема (немає даних, зламаний JSON,
 * неправильна структура, недоступне сховище) -> порожній стан, застосунок не падає.
 */
export function loadState(): LotteryState {
  const empty: LotteryState = { participants: [], winnerIds: [] }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return empty

    const data: unknown = JSON.parse(raw)
    if (typeof data !== 'object' || data === null) return empty

    const { participants, winnerIds } = data as Record<string, unknown>
    if (!Array.isArray(participants)) return empty

    const validParticipants = participants.filter(isParticipant)
    const knownIds = new Set(validParticipants.map((p) => p.id))

    // Переможці зберігаються як id, тому відсіюємо ті, кого вже немає серед учасників,
    // дублікати, і не перевищуємо ліміт.
    const validWinnerIds = Array.isArray(winnerIds)
      ? [...new Set(winnerIds.filter((id): id is string => typeof id === 'string'))]
          .filter((id) => knownIds.has(id))
          .slice(0, MAX_WINNERS)
      : []

    return { participants: validParticipants, winnerIds: validWinnerIds }
  } catch {
    return empty
  }
}

export function saveState(state: LotteryState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // переповнене сховище / приватний режим — просто пропускаємо
  }
}
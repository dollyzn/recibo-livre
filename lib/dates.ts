import { pt } from "chrono-node"

export function formatDateBr(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

export function parseBrDate(value: string): Date | undefined {
  const trimmed = value.trim()
  if (!trimmed) return undefined

  const numeric = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (numeric) {
    const day = Number(numeric[1])
    const month = Number(numeric[2]) - 1
    const year = Number(numeric[3])
    const date = new Date(year, month, day)
    if (
      date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day
    ) {
      return date
    }
    return undefined
  }

  const normalized = trimmed
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (normalized === "hoje") return today
  if (normalized === "ontem") {
    const date = new Date(today)
    date.setDate(date.getDate() - 1)
    return date
  }
  if (normalized === "amanha") {
    const date = new Date(today)
    date.setDate(date.getDate() + 1)
    return date
  }

  const parsed = pt.parseDate(trimmed, today)
  if (!parsed) return undefined
  parsed.setHours(0, 0, 0, 0)
  return parsed
}

export function isValidBrDate(value: string) {
  return Boolean(parseBrDate(value))
}

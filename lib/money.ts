export function parseAmount(value: string | number | null | undefined) {
  if (value == null || value === "") return undefined
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? value : undefined
  }

  const raw = String(value).trim().replace(/^R\$\s*/i, "").replace(/\s/g, "")
  if (!raw) return undefined

  let normalized = raw
  if (raw.includes(",") && raw.includes(".")) {
    normalized = raw.replace(/\./g, "").replace(",", ".")
  } else if (raw.includes(",")) {
    normalized = raw.replace(",", ".")
  } else if ((raw.match(/\./g) ?? []).length > 1 || /\.\d{3}$/.test(raw)) {
    normalized = raw.replace(/\./g, "")
  }

  const amount = Number(normalized)
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(`Valor inválido: "${value}"`)
  }
  return amount
}

export function parseMoneyInput(value: string): number | "" {
  const raw = value.trim()
  if (!raw) return ""
  const normalized = raw.replace(/\./g, "").replace(",", ".")
  const amount = Number(normalized)
  return Number.isFinite(amount) ? amount : ""
}

export function moneyInputDisplay(value: number | "") {
  if (value === "") return ""
  return String(value).replace(".", ",")
}

export function formatMoney(value: number | "" | undefined) {
  if (value === "" || value == null || !Number.isFinite(value)) {
    return "R$ 0,00"
  }
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function todayBr() {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date())
}

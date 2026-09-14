export function onlyDigits(value: string) {
  return value.replace(/\D/g, "")
}

export type DocumentKind = "cpf" | "cnpj"

export function detectDocumentKind(value: string): DocumentKind | undefined {
  const digits = onlyDigits(value)
  if (digits.length === 0) return undefined
  if (digits.length <= 11) return "cpf"
  return "cnpj"
}

export function documentLabel(value: string) {
  const kind = detectDocumentKind(value)
  if (kind === "cpf") return "CPF"
  if (kind === "cnpj") return "CNPJ"
  return "CPF ou CNPJ"
}

export function maskCpf(digits: string) {
  const d = digits.slice(0, 11)
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
}

export function maskCnpj(digits: string) {
  const d = digits.slice(0, 14)
  return d
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
}

export function maskDocument(value: string) {
  const digits = onlyDigits(value)
  if (digits.length <= 11) return maskCpf(digits)
  return maskCnpj(digits)
}

export function maskPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11)
  if (digits.length === 0) return ""
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function cpfCheckDigits(digits: string) {
  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return false

  const calc = (slice: string, factor: number) => {
    const total = slice
      .split("")
      .reduce((sum, digit, index) => sum + Number(digit) * (factor - index), 0)
    const rest = (total * 10) % 11
    return rest === 10 ? 0 : rest
  }

  return (
    calc(digits.slice(0, 9), 10) === Number(digits[9]) &&
    calc(digits.slice(0, 10), 11) === Number(digits[10])
  )
}

function cnpjCheckDigits(digits: string) {
  if (digits.length !== 14 || /^(\d)\1+$/.test(digits)) return false

  const calc = (slice: string, factors: number[]) => {
    const total = slice
      .split("")
      .reduce((sum, digit, index) => sum + Number(digit) * factors[index], 0)
    const rest = total % 11
    return rest < 2 ? 0 : 11 - rest
  }

  return (
    calc(digits.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) ===
      Number(digits[12]) &&
    calc(digits.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) ===
      Number(digits[13])
  )
}

export function validateDocument(value: string, required = false) {
  const digits = onlyDigits(value)
  if (!digits) {
    return required ? "Informe o CPF ou CNPJ." : undefined
  }
  if (digits.length <= 11) {
    if (digits.length < 11) return "CPF incompleto."
    return cpfCheckDigits(digits) ? undefined : "CPF inválido."
  }
  if (digits.length < 14) return "CNPJ incompleto."
  return cnpjCheckDigits(digits) ? undefined : "CNPJ inválido."
}

export function validatePhone(value: string) {
  const digits = onlyDigits(value)
  if (!digits) return undefined
  if (digits.length < 10) return "Telefone incompleto."
  if (digits.length > 11) return "Telefone inválido."
  return undefined
}

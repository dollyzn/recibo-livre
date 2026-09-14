import { maskDocument, validateDocument, validatePhone } from "@/lib/br-docs"
import { isValidBrDate } from "@/lib/dates"
import type { BancoDoBrasilExtract } from "@/lib/extract-bb"
import { todayBr } from "@/lib/money"

export type ReceiptParty = {
  nome: string
  documento: string
  celular: string
  cidade: string
}

export type ReceiptItem = {
  id: string
  descricao: string
  quantidade: number
  valor: number | ""
}

export type ReceiptReferences = {
  id?: string
  documento?: string
  autenticacao?: string
}

export type ReceiptData = {
  numero: string
  data: string
  hora: string
  itens: ReceiptItem[]
  observacao: string
  pagador: ReceiptParty
  beneficiario: ReceiptParty
  referencias?: ReceiptReferences
}

export const DRAFT_STORAGE_KEY = "recibo-livre:rascunho"
export const BENEFICIARY_STORAGE_KEY = "recibo-livre:beneficiario"

function newItemId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `item-${Math.random().toString(36).slice(2, 10)}`
}

export function createReceiptItem(partial?: Partial<ReceiptItem>): ReceiptItem {
  return {
    id: partial?.id ?? newItemId(),
    descricao: partial?.descricao ?? "",
    quantidade:
      typeof partial?.quantidade === "number" && partial.quantidade > 0
        ? Math.round(partial.quantidade)
        : 1,
    valor: partial?.valor ?? "",
  }
}

export function emptyParty(): ReceiptParty {
  return {
    nome: "",
    documento: "",
    celular: "",
    cidade: "",
  }
}

export function emptyReceipt(): ReceiptData {
  return {
    numero: "",
    data: todayBr(),
    hora: "",
    itens: [createReceiptItem({ id: "item-1" })],
    observacao: "",
    pagador: emptyParty(),
    beneficiario: emptyParty(),
  }
}

export function itemQuantity(item: Pick<ReceiptItem, "quantidade">) {
  return Number.isFinite(item.quantidade) && item.quantidade > 0
    ? Math.round(item.quantidade)
    : 1
}

export function itemLineTotal(item: ReceiptItem) {
  const amount = typeof item.valor === "number" && item.valor > 0 ? item.valor : 0
  return itemQuantity(item) * amount
}

export function receiptTotal(data: Pick<ReceiptData, "itens">) {
  return data.itens.reduce((sum, item) => sum + itemLineTotal(item), 0)
}

export function filledReceiptItems(data: Pick<ReceiptData, "itens">) {
  return data.itens.filter(
    (item) =>
      item.descricao.trim().length > 0 ||
      (typeof item.valor === "number" && item.valor > 0),
  )
}

export function hasStoredDraft(data: ReceiptData) {
  return Boolean(
    data.pagador.nome.trim() ||
      data.pagador.documento.trim() ||
      data.beneficiario.nome.trim() ||
      data.beneficiario.documento.trim() ||
      data.observacao.trim() ||
      data.numero.trim() ||
      filledReceiptItems(data).length > 0,
  )
}

function usableDocument(document?: string) {
  return document && !document.includes("*") ? document : undefined
}

function mergeExtractedItems(itens: ReceiptItem[], valor: number): ReceiptItem[] {
  if (itens.length === 1 && !itens[0].descricao.trim()) {
    return [{ ...itens[0], valor, quantidade: itemQuantity(itens[0]) }]
  }

  const emptyValorIndex = itens.findIndex((item) => item.valor === "")
  if (emptyValorIndex >= 0) {
    return itens.map((item, index) =>
      index === emptyValorIndex ? { ...item, valor } : item,
    )
  }

  return [...itens, createReceiptItem({ valor })]
}

export function mergeExtractedReceipt(
  current: ReceiptData,
  extracted: BancoDoBrasilExtract,
): ReceiptData {
  return {
    ...current,
    numero: current.numero || extracted.referencias.documento || "",
    data: extracted.data || current.data,
    hora: extracted.hora || current.hora,
    itens: mergeExtractedItems(current.itens, extracted.valor),
    pagador: {
      ...current.pagador,
      nome: extracted.pagador.nome || current.pagador.nome,
      documento: maskDocument(
        usableDocument(extracted.pagador.documento) || current.pagador.documento,
      ),
    },
    beneficiario: {
      ...current.beneficiario,
      nome: current.beneficiario.nome || extracted.beneficiario.nome || "",
      documento: maskDocument(
        current.beneficiario.documento ||
          usableDocument(extracted.beneficiario.documento) ||
          "",
      ),
    },
    referencias: extracted.referencias,
  }
}

export function loadStoredBeneficiary():
  | Pick<ReceiptParty, "nome" | "documento" | "cidade">
  | undefined {
  if (typeof window === "undefined") return undefined
  try {
    const raw = window.localStorage.getItem(BENEFICIARY_STORAGE_KEY)
    if (!raw) return undefined
    const parsed = JSON.parse(raw) as Partial<ReceiptParty>
    return {
      nome: parsed.nome ?? "",
      documento: maskDocument(parsed.documento ?? ""),
      cidade: parsed.cidade ?? "",
    }
  } catch {
    return undefined
  }
}

function asParty(value: unknown, fallback: ReceiptParty): ReceiptParty {
  if (!value || typeof value !== "object") return fallback
  const party = value as Partial<ReceiptParty>
  return {
    nome: party.nome ?? "",
    documento: maskDocument(party.documento ?? ""),
    celular: party.celular ?? "",
    cidade: party.cidade ?? "",
  }
}

function asItems(value: unknown, legacy?: { descricao?: unknown; valor?: unknown }) {
  if (Array.isArray(value) && value.length > 0) {
    return value.map((item, index) => {
      const entry = item as Partial<ReceiptItem>
      return createReceiptItem({
        id: entry.id ?? `item-${index + 1}`,
        descricao: entry.descricao ?? "",
        quantidade: entry.quantidade,
        valor:
          typeof entry.valor === "number" || entry.valor === ""
            ? entry.valor
            : "",
      })
    })
  }

  const descricao = typeof legacy?.descricao === "string" ? legacy.descricao : ""
  const valor =
    typeof legacy?.valor === "number" || legacy?.valor === "" ? legacy.valor : ""
  return [createReceiptItem({ id: "item-1", descricao, valor })]
}

export function normalizeStoredReceipt(value: unknown): ReceiptData {
  const base = emptyReceipt()
  if (!value || typeof value !== "object") {
    const legacy = loadStoredBeneficiary()
    if (!legacy) return base
    return { ...base, beneficiario: { ...base.beneficiario, ...legacy } }
  }

  const stored = value as Partial<ReceiptData> & {
    descricao?: unknown
    valor?: unknown
  }
  const next: ReceiptData = {
    numero: stored.numero ?? "",
    data: stored.data || base.data,
    hora: stored.hora ?? "",
    itens: asItems(stored.itens, stored),
    observacao: stored.observacao ?? "",
    pagador: asParty(stored.pagador, base.pagador),
    beneficiario: asParty(stored.beneficiario, base.beneficiario),
    referencias: stored.referencias,
  }

  if (!next.beneficiario.nome && !next.beneficiario.documento) {
    const legacy = loadStoredBeneficiary()
    if (legacy) next.beneficiario = { ...next.beneficiario, ...legacy }
  }

  return next
}

export function deserializeReceiptDraft(raw: string) {
  try {
    return normalizeStoredReceipt(JSON.parse(raw))
  } catch {
    return emptyReceipt()
  }
}

export function validateReceipt(data: ReceiptData) {
  const errors: Partial<Record<string, string>> = {}

  if (!data.pagador.nome.trim()) errors.pagadorNome = "Informe o pagador."
  const pagadorDoc = validateDocument(data.pagador.documento)
  if (pagadorDoc) errors.pagadorDocumento = pagadorDoc
  const pagadorPhone = validatePhone(data.pagador.celular)
  if (pagadorPhone) errors.pagadorCelular = pagadorPhone

  const items = data.itens
  if (items.length === 0) {
    errors.itens = "Adicione pelo menos um serviço ou produto."
  }

  items.forEach((item, index) => {
    const label = items.length > 1 ? ` no item ${index + 1}` : ""
    if (!item.descricao.trim()) {
      errors[`item-${item.id}-descricao`] = `Informe a descrição${label}.`
    }
    if (!Number.isInteger(item.quantidade) || item.quantidade < 1) {
      errors[`item-${item.id}-quantidade`] = `Informe a quantidade${label}.`
    }
    if (item.valor === "" || !Number.isFinite(item.valor) || item.valor <= 0) {
      errors[`item-${item.id}-valor`] = `Informe um valor válido${label}.`
    }
  })

  if (receiptTotal(data) <= 0) {
    errors.itens = "O recibo precisa de pelo menos um item com valor."
  }

  if (!data.beneficiario.nome.trim()) {
    errors.beneficiarioNome = "Informe o beneficiário."
  }
  const beneficiarioDoc = validateDocument(data.beneficiario.documento, true)
  if (beneficiarioDoc) errors.beneficiarioDocumento = beneficiarioDoc
  if (!data.beneficiario.cidade.trim()) {
    errors.beneficiarioCidade = "Informe a cidade."
  }
  if (!isValidBrDate(data.data)) {
    errors.data = "Informe uma data válida. Ex.: hoje, ontem ou 16/07/2026."
  }

  return errors
}

export function paymentMoment(data: Pick<ReceiptData, "data" | "hora">) {
  return data.hora ? `${data.data}, às ${data.hora}` : data.data
}

export function receiptFileName(
  data: ReceiptData,
  format: "pdf" | "png" = "pdf",
) {
  const isoDate = data.data.split("/").reverse().join("-")
  return `recibo-${isoDate || "pagamento"}.${format}`
}

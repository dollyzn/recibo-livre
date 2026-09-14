import { describe, expect, it } from "vitest"
import { parseAmount, parseMoneyInput } from "@/lib/money"
import {
  createReceiptItem,
  emptyReceipt,
  receiptTotal,
  validateReceipt,
} from "@/lib/receipt"

describe("itens do recibo", () => {
  it("soma o total a partir dos itens", () => {
    const data = emptyReceipt()
    data.itens = [
      createReceiptItem({ descricao: "Consultoria", quantidade: 2, valor: 150 }),
      createReceiptItem({ descricao: "Hospedagem", quantidade: 1, valor: 50 }),
    ]
    expect(receiptTotal(data)).toBe(350)
  })

  it("valida descrição e valor de cada item", () => {
    const data = emptyReceipt()
    data.pagador.nome = "Empresa"
    data.beneficiario.nome = "Pessoa"
    data.beneficiario.documento = "390.533.447-05"
    data.beneficiario.cidade = "Campos dos Goytacazes - RJ"
    data.itens = [createReceiptItem({ descricao: "", valor: "" })]

    const errors = validateReceipt(data)
    expect(errors[`item-${data.itens[0].id}-descricao`]).toBeTruthy()
    expect(errors[`item-${data.itens[0].id}-valor`]).toBeTruthy()
  })
})

describe("parseMoneyInput", () => {
  it("aceita digitação em formato brasileiro", () => {
    expect(parseMoneyInput("1.200,50")).toBe(1200.5)
    expect(parseMoneyInput("")).toBe("")
    expect(parseAmount("1200")).toBe(1200)
  })
})

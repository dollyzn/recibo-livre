import { describe, expect, it } from "vitest"
import { parseBancoDoBrasilLines } from "@/lib/extract-bb"
import { parseAmount } from "@/lib/money"

describe("parseBancoDoBrasilLines", () => {
  it("extrai os dados principais de um comprovante Pix BB", () => {
    const result = parseBancoDoBrasilLines([
      "Comprovante BB",
      "R$ 600,00",
      "16/07/2026 às 14:59:52",
      "Pix Enviado",
      "Recebedor",
      "Nata Santos Jesus",
      "CPF",
      "***.520.217-**",
      "Pagador",
      "Barbosa Freire Ltda",
      "CNPJ",
      "32.071.029/0002-31",
      "ID: E0000000020260716175940730301019",
      "Documento: 000000000071602",
      "Autenticação SISBB: 2.7BF.7B0.2CD.23C.EC5",
    ])

    expect(result.valor).toBe(600)
    expect(result.data).toBe("16/07/2026")
    expect(result.pagador.nome).toBe("Barbosa Freire Ltda")
    expect(result.pagador.documento).toBe("32.071.029/0002-31")
    expect(result.beneficiario.nome).toBe("Nata Santos Jesus")
    expect(result.referencias.documento).toBe("000000000071602")
  })
})

describe("parseAmount", () => {
  it("aceita valores em formatos brasileiro e decimal", () => {
    expect(parseAmount("1.200,50")).toBe(1200.5)
    expect(parseAmount("1200.50")).toBe(1200.5)
    expect(parseAmount("1200")).toBe(1200)
  })
})

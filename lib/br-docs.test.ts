import { describe, expect, it } from "vitest"
import {
  detectDocumentKind,
  documentLabel,
  maskDocument,
  maskPhone,
  validateDocument,
} from "@/lib/br-docs"
import { formatDateBr, parseBrDate } from "@/lib/dates"

describe("documentos brasileiros", () => {
  it("mascara e identifica CPF e CNPJ", () => {
    expect(maskDocument("39053344705")).toBe("390.533.447-05")
    expect(detectDocumentKind("390.533.447-05")).toBe("cpf")
    expect(documentLabel("390.533.447-05")).toBe("CPF")
    expect(maskDocument("32071029000150")).toBe("32.071.029/0001-50")
    expect(detectDocumentKind("32.071.029/0001-50")).toBe("cnpj")
  })

  it("valida dígitos verificadores", () => {
    expect(validateDocument("390.533.447-05")).toBeUndefined()
    expect(validateDocument("390.533.447-00")).toBe("CPF inválido.")
    expect(validateDocument("32.071.029/0001-50")).toBeUndefined()
    expect(validateDocument("")).toBeUndefined()
    expect(validateDocument("", true)).toBe("Informe o CPF ou CNPJ.")
  })

  it("mascara telefone", () => {
    expect(maskPhone("22999054660")).toBe("(22) 99905-4660")
  })
})

describe("datas", () => {
  it("aceita formato brasileiro e linguagem natural", () => {
    expect(formatDateBr(parseBrDate("16/07/2026")!)).toBe("16/07/2026")
    expect(parseBrDate("31/02/2026")).toBeUndefined()
    expect(parseBrDate("hoje")).toBeInstanceOf(Date)
  })
})

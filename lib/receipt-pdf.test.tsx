import { describe, expect, it } from "vitest"
import { emptyReceipt, receiptFileName } from "@/lib/receipt"

describe("receiptFileName", () => {
  it("nomeia o arquivo com a data e o formato", () => {
    const data = emptyReceipt()
    data.data = "16/07/2026"
    expect(receiptFileName(data, "pdf")).toBe("recibo-2026-07-16.pdf")
    expect(receiptFileName(data, "png")).toBe("recibo-2026-07-16.png")
  })
})

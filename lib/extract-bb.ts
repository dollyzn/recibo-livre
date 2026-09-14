type TextItemLike = {
  str?: string
  transform: number[]
}

export type BancoDoBrasilExtract = {
  valor: number
  data: string
  hora?: string
  pagador: {
    nome?: string
    documento?: string
  }
  beneficiario: {
    nome?: string
    documento?: string
  }
  referencias: {
    id?: string
    documento?: string
    autenticacao?: string
  }
}

function normalizeLine(value: string) {
  return value.replace(/\s+/g, " ").trim()
}

export function groupItemsIntoLines(items: TextItemLike[]) {
  const rows = new Map<number, { x: number; value: string }[]>()

  for (const item of items) {
    if (!item.str?.trim()) continue
    const y = Math.round(item.transform[5] * 2) / 2
    const row = rows.get(y) ?? []
    row.push({ x: item.transform[4], value: item.str })
    rows.set(y, row)
  }

  return [...rows.entries()]
    .sort(([yA], [yB]) => yB - yA)
    .map(([, row]) =>
      normalizeLine(
        row
          .sort((a, b) => a.x - b.x)
          .map((item) => item.value)
          .join(" "),
      ),
    )
    .filter(Boolean)
}

function nextUsefulLine(lines: string[], startIndex: number) {
  const ignored =
    /^(CPF|CNPJ|Agência|Conta|Instituição|Tipo de conta|Chave Pix|Pagador|Recebedor)$/i
  return lines.slice(startIndex + 1).find((line) => line && !ignored.test(line))
}

function findValueAfter(lines: string[], label: string) {
  const index = lines.findIndex(
    (line) => line.toLowerCase() === label.toLowerCase(),
  )
  return index >= 0 ? nextUsefulLine(lines, index) : undefined
}

function parseMoney(value?: string) {
  if (!value) return undefined
  const normalized = value
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
  const amount = Number(normalized)
  return Number.isFinite(amount) ? amount : undefined
}

function findDocument(lines: string[], type: string) {
  const index = lines.findIndex((line) => line.toUpperCase() === type)
  if (index < 0) return undefined
  return lines
    .slice(index + 1)
    .find((line) => /[\d*]{2,}[.\-/\d*]+/.test(line))
}

export function parseBancoDoBrasilLines(lines: string[]): BancoDoBrasilExtract {
  const text = lines.join("\n")
  const amountLine =
    lines.find((line) => /^R\$\s*[\d.]+,\d{2}$/.test(line)) ??
    text.match(/R\$\s*[\d.]+,\d{2}/)?.[0]
  const paymentMatch = text.match(
    /(\d{2}\/\d{2}\/\d{4})\s+(?:às\s+)?(\d{2}:\d{2}(?::\d{2})?)/i,
  )

  const parsed: BancoDoBrasilExtract = {
    valor: parseMoney(amountLine) ?? 0,
    data: paymentMatch?.[1] ?? "",
    hora: paymentMatch?.[2],
    pagador: {
      nome: findValueAfter(lines, "Pagador"),
      documento: findDocument(lines, "CNPJ"),
    },
    beneficiario: {
      nome: findValueAfter(lines, "Recebedor"),
      documento: findDocument(lines, "CPF"),
    },
    referencias: {
      id: text.match(/ID:\s*([A-Z0-9]+)/i)?.[1],
      documento: text.match(/Documento:\s*([A-Z0-9]+)/i)?.[1],
      autenticacao: text.match(/Autenticação SISBB:\s*([A-Z0-9.]+)/i)?.[1],
    },
  }

  if (!parsed.valor || !parsed.data || !parsed.pagador.nome) {
    throw new Error(
      "Não foi possível reconhecer os campos principais do comprovante. Você pode preencher os dados manualmente.",
    )
  }

  return parsed
}

export async function extractBancoDoBrasilFromFile(file: File) {
  const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist")
  GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"

  const data = new Uint8Array(await file.arrayBuffer())
  const pdf = await getDocument({ data, useSystemFonts: true }).promise
  const lines: string[] = []

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const content = await page.getTextContent()
    lines.push(
      ...groupItemsIntoLines(content.items as unknown as TextItemLike[]),
    )
  }

  return parseBancoDoBrasilLines(lines)
}

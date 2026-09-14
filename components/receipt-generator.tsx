"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  ChevronDownIcon,
  DownloadIcon,
  FileTextIcon,
  ImageIcon,
  RotateCcwIcon,
} from "lucide-react"
import { toast } from "sonner"
import { useIsClient, useLocalStorage } from "usehooks-ts"
import { ReceiptDropzone } from "@/components/receipt-dropzone"
import { ReceiptForm } from "@/components/receipt-form"
import { ReceiptPreview } from "@/components/receipt-preview"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import type { BancoDoBrasilExtract } from "@/lib/extract-bb"
import {
  downloadReceiptExport,
  type ReceiptExportFormat,
} from "@/lib/receipt-export"
import {
  createReceiptItem,
  deserializeReceiptDraft,
  DRAFT_STORAGE_KEY,
  emptyReceipt,
  hasStoredDraft,
  mergeExtractedReceipt,
  validateReceipt,
  type ReceiptData,
  type ReceiptItem,
} from "@/lib/receipt"

let restoredDraftToast = false

export function ReceiptGenerator() {
  const isClient = useIsClient()
  const [draft, setDraft] = useLocalStorage<ReceiptData>(
    DRAFT_STORAGE_KEY,
    emptyReceipt,
    {
      initializeWithValue: false,
      deserializer: deserializeReceiptDraft,
    },
  )
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})
  const [isDownloading, setIsDownloading] = useState(false)
  const sheetRef = useRef<HTMLElement>(null)
  const data = isClient ? draft : emptyReceipt()
  const canDownload = useMemo(() => Object.keys(validateReceipt(data)).length === 0, [data])
  const draftSaved = hasStoredDraft(data)

  useEffect(() => {
    if (!isClient || restoredDraftToast) return
    restoredDraftToast = true
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY)
    if (!raw) return
    const stored = deserializeReceiptDraft(raw)
    if (!hasStoredDraft(stored)) return
    toast.message("Rascunho restaurado", {
      description: "Preenchemos o formulário com o que estava neste navegador.",
    })
  }, [isClient])

  function patchReceipt(patch: Partial<ReceiptData>) {
    setDraft((current) => ({ ...current, ...patch }))
    setErrors({})
  }

  function patchParty(
    party: "pagador" | "beneficiario",
    patch: Partial<ReceiptData["pagador"]>,
  ) {
    setDraft((current) => ({
      ...current,
      [party]: { ...current[party], ...patch },
    }))
    setErrors({})
  }

  function patchItem(id: string, patch: Partial<ReceiptItem>) {
    setDraft((current) => ({
      ...current,
      itens: current.itens.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    }))
    setErrors({})
  }

  function addItem() {
    setDraft((current) => ({
      ...current,
      itens: [...current.itens, createReceiptItem()],
    }))
    setErrors({})
  }

  function removeItem(id: string) {
    setDraft((current) => ({
      ...current,
      itens: current.itens.length > 1
        ? current.itens.filter((item) => item.id !== id)
        : current.itens,
    }))
    setErrors({})
  }

  function handleExtracted(extracted: BancoDoBrasilExtract) {
    setDraft((current) => mergeExtractedReceipt(current, extracted))
    setErrors({})
  }

  async function handleDownload(format: ReceiptExportFormat) {
    const nextErrors = validateReceipt(data)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Preencha os campos obrigatórios para baixar.")
      return
    }

    const sheet = sheetRef.current
    if (!sheet) {
      toast.error("O preview ainda não está pronto.")
      return
    }

    setIsDownloading(true)
    try {
      await downloadReceiptExport(sheet, data, format)
      toast.success(format === "png" ? "PNG baixado." : "PDF baixado.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível baixar o recibo.")
    } finally {
      setIsDownloading(false)
    }
  }

  function handleReset() {
    const next = emptyReceipt()
    next.beneficiario = data.beneficiario
    setDraft(next)
    setErrors({})
  }

  return (
    <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,28rem)_minmax(0,1fr)]">
      <div className="flex flex-col gap-4">
        <Alert>
          <AlertTitle>Privacidade</AlertTitle>
          <AlertDescription>
            O comprovante é lido localmente. Nenhum dado financeiro vai para um servidor.
          </AlertDescription>
        </Alert>
        <ReceiptDropzone onExtracted={handleExtracted} />
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle>Preenchimento</CardTitle>
              {draftSaved ? (
                <Badge variant="secondary">Rascunho neste navegador</Badge>
              ) : null}
            </div>
            <CardDescription>
              Itens, partes e observações são salvos automaticamente aqui.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isClient ? (
              <ReceiptForm
                data={data}
                errors={errors}
                onChange={patchReceipt}
                onPartyChange={patchParty}
                onItemChange={patchItem}
                onItemAdd={addItem}
                onItemRemove={removeItem}
              />
            ) : (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            )}
          </CardContent>
        </Card>
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              disabled={isDownloading}
              render={<Button disabled={isDownloading} />}
            >
              {isDownloading ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <DownloadIcon data-icon="inline-start" />
              )}
              Baixar
              <ChevronDownIcon data-icon="inline-end" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  disabled={isDownloading}
                  onClick={() => void handleDownload("pdf")}
                >
                  <FileTextIcon />
                  PDF
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={isDownloading}
                  onClick={() => void handleDownload("png")}
                >
                  <ImageIcon />
                  PNG
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={handleReset} disabled={isDownloading}>
            <RotateCcwIcon data-icon="inline-start" />
            Limpar
          </Button>
          {!canDownload ? (
            <p className="w-full text-sm text-muted-foreground">
              Pagador, itens e beneficiário são obrigatórios.
            </p>
          ) : null}
        </div>
      </div>

      <ReceiptPreview ref={sheetRef} data={data} />
    </div>
  )
}

"use client"

import { useRef, useState } from "react"
import { FileUpIcon } from "lucide-react"
import { toast } from "sonner"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { extractBancoDoBrasilFromFile } from "@/lib/extract-bb"
import { cn } from "@/lib/utils"
import type { BancoDoBrasilExtract } from "@/lib/extract-bb"

type ReceiptDropzoneProps = {
  onExtracted: (data: BancoDoBrasilExtract, fileName: string) => void
}

export function ReceiptDropzone({ onExtracted }: ReceiptDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isReading, setIsReading] = useState(false)
  const [fileName, setFileName] = useState<string>()

  async function handleFile(file: File | undefined) {
    if (!file) return
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Envie um arquivo PDF.")
      return
    }

    setIsReading(true)
    try {
      const extracted = await extractBancoDoBrasilFromFile(file)
      setFileName(file.name)
      onExtracted(extracted, file.name)
      toast.success("Comprovante lido. Confira os campos antes de baixar.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao ler o PDF.")
    } finally {
      setIsReading(false)
    }
  }

  return (
    <button
      type="button"
      disabled={isReading}
      onClick={() => inputRef.current?.click()}
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault()
        setIsDragging(false)
        void handleFile(event.dataTransfer.files[0])
      }}
      className={cn(
        "w-full rounded-xl border border-dashed bg-card text-left transition-colors",
        isDragging && "border-primary bg-muted",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="sr-only"
        onChange={(event) => {
          void handleFile(event.target.files?.[0])
          event.target.value = ""
        }}
      />
      <Empty className="border-0">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            {isReading ? <Spinner /> : <FileUpIcon />}
          </EmptyMedia>
          <EmptyTitle>
            {fileName ?? "Solte o comprovante em PDF aqui"}
          </EmptyTitle>
          <EmptyDescription>
            A leitura acontece só neste navegador.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </button>
  )
}

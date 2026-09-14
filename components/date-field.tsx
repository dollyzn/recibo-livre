"use client"

import { CalendarIcon } from "lucide-react"
import { ptBR } from "react-day-picker/locale"
import { Calendar } from "@/components/ui/calendar"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { formatDateBr, parseBrDate } from "@/lib/dates"

type DateFieldProps = {
  id: string
  value: string
  error?: string
  onChange: (value: string) => void
}

export function DateField({ id, value, error, onChange }: DateFieldProps) {
  const selected = parseBrDate(value)

  return (
    <Field data-invalid={Boolean(error) || undefined}>
      <FieldLabel htmlFor={id}>Data do pagamento</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id={id}
          placeholder="hoje, ontem ou 16/07/2026"
          value={value}
          aria-invalid={Boolean(error) || undefined}
          onChange={(event) => {
            const next = event.target.value
            const parsed = parseBrDate(next)
            onChange(parsed && /[a-zà-ú]/i.test(next) ? formatDateBr(parsed) : next)
          }}
          onBlur={() => {
            const parsed = parseBrDate(value)
            if (parsed) onChange(formatDateBr(parsed))
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover>
            <PopoverTrigger
              render={
                <InputGroupButton
                  size="icon-xs"
                  variant="ghost"
                  aria-label="Abrir calendário"
                />
              }
            >
              <CalendarIcon />
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-2">
              <PopoverTitle className="sr-only">Escolher data</PopoverTitle>
              <Calendar
                mode="single"
                locale={ptBR}
                captionLayout="dropdown"
                startMonth={new Date(2000, 0)}
                endMonth={new Date(new Date().getFullYear() + 1, 11)}
                selected={selected}
                onSelect={(date) => {
                  if (date) onChange(formatDateBr(date))
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
      {error ? (
        <FieldError>{error}</FieldError>
      ) : (
        <FieldDescription>
          Aceita linguagem natural: hoje, ontem, amanhã.
        </FieldDescription>
      )}
    </Field>
  )
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { detectDocumentKind, documentLabel, maskDocument } from "@/lib/br-docs";

type DocumentFieldProps = {
  id: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

export function DocumentField({
  id,
  value,
  error,
  onChange,
}: DocumentFieldProps) {
  const kind = detectDocumentKind(value);
  const label = documentLabel(value);

  return (
    <Field data-invalid={Boolean(error) || undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id={id}
          inputMode="numeric"
          autoComplete="off"
          placeholder={
            kind === "cnpj" ? "00.000.000/0000-00" : "000.000.000-00"
          }
          value={value}
          aria-invalid={Boolean(error) || undefined}
          onChange={(event) => onChange(maskDocument(event.target.value))}
        />
        <InputGroupAddon align="inline-end">
          {kind ? (
            <Badge variant={error ? "destructive" : "secondary"}>
              {kind.toUpperCase()}
            </Badge>
          ) : null}
        </InputGroupAddon>
      </InputGroup>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}

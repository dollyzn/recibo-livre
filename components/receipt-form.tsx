"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";
import { CityCombobox } from "@/components/city-combobox";
import { DateField } from "@/components/date-field";
import { DocumentField } from "@/components/document-field";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
} from "@/components/reui/number-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { maskPhone } from "@/lib/br-docs";
import { formatMoney, moneyInputDisplay, parseMoneyInput } from "@/lib/money";
import {
  receiptTotal,
  type ReceiptData,
  type ReceiptItem,
} from "@/lib/receipt";

type ReceiptFormProps = {
  data: ReceiptData;
  errors: Partial<Record<string, string>>;
  onChange: (patch: Partial<ReceiptData>) => void;
  onPartyChange: (
    party: "pagador" | "beneficiario",
    patch: Partial<ReceiptData["pagador"]>,
  ) => void;
  onItemChange: (id: string, patch: Partial<ReceiptItem>) => void;
  onItemAdd: () => void;
  onItemRemove: (id: string) => void;
};

export function ReceiptForm({
  data,
  errors,
  onChange,
  onPartyChange,
  onItemChange,
  onItemAdd,
  onItemRemove,
}: ReceiptFormProps) {
  const total = receiptTotal(data);

  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend>Serviços e produtos</FieldLegend>
        <FieldGroup>
          <FieldDescription>
            O total do recibo é a soma de quantidade × valor de cada item.
          </FieldDescription>
          {errors.itens ? <FieldError>{errors.itens}</FieldError> : null}
          {data.itens.map((item, index) => {
            const descriptionError = errors[`item-${item.id}-descricao`];
            const quantityError = errors[`item-${item.id}-quantidade`];
            const amountError = errors[`item-${item.id}-valor`];

            return (
              <FieldGroup key={item.id}>
                {index > 0 ? <FieldSeparator /> : null}
                <Field data-invalid={Boolean(descriptionError) || undefined}>
                  <FieldLabel htmlFor={`item-${item.id}-descricao`}>
                    Item {index + 1}
                  </FieldLabel>
                  <Input
                    id={`item-${item.id}-descricao`}
                    placeholder="Suporte em ativos de tecnologia"
                    value={item.descricao}
                    aria-invalid={Boolean(descriptionError) || undefined}
                    onChange={(event) =>
                      onItemChange(item.id, { descricao: event.target.value })
                    }
                  />
                  {descriptionError ? (
                    <FieldError>{descriptionError}</FieldError>
                  ) : null}
                </Field>
                <FieldGroup className="sm:flex-row sm:items-end">
                  <Field
                    className="min-w-0 flex-1"
                    data-invalid={Boolean(quantityError) || undefined}
                  >
                    <NumberField
                      id={`item-${item.id}-quantidade`}
                      min={1}
                      max={999}
                      step={1}
                      value={item.quantidade}
                      onValueChange={(value) =>
                        onItemChange(item.id, {
                          quantidade:
                            value == null ? 1 : Math.max(1, Math.round(value)),
                        })
                      }
                    >
                      <NumberFieldScrubArea label="Quantidade" />
                      <NumberFieldGroup>
                        <NumberFieldDecrement />
                        <NumberFieldInput
                          aria-invalid={Boolean(quantityError) || undefined}
                        />
                        <NumberFieldIncrement />
                      </NumberFieldGroup>
                    </NumberField>
                    {quantityError ? (
                      <FieldError>{quantityError}</FieldError>
                    ) : null}
                  </Field>
                  <Field
                    className="min-w-0 flex-1"
                    data-invalid={Boolean(amountError) || undefined}
                  >
                    <FieldLabel htmlFor={`item-${item.id}-valor`}>
                      Valor unitário
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <InputGroupText>R$</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        id={`item-${item.id}-valor`}
                        inputMode="decimal"
                        placeholder="1.200,00"
                        value={moneyInputDisplay(item.valor)}
                        aria-invalid={Boolean(amountError) || undefined}
                        onChange={(event) =>
                          onItemChange(item.id, {
                            valor: parseMoneyInput(event.target.value),
                          })
                        }
                      />
                    </InputGroup>
                    {amountError ? (
                      <FieldError>{amountError}</FieldError>
                    ) : null}
                  </Field>
                  {data.itens.length > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remover item ${index + 1}`}
                      onClick={() => onItemRemove(item.id)}
                    >
                      <Trash2Icon />
                    </Button>
                  ) : null}
                </FieldGroup>
              </FieldGroup>
            );
          })}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onItemAdd}
            >
              <PlusIcon data-icon="inline-start" />
              Adicionar item
            </Button>
            <Badge variant="secondary">Total {formatMoney(total)}</Badge>
          </div>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      <FieldSet>
        <FieldLegend>Recibo</FieldLegend>
        <FieldGroup>
          <FieldGroup className="min-w-0 sm:flex-row">
            <DateField
              id="data"
              value={data.data}
              error={errors.data}
              onChange={(next) => onChange({ data: next })}
            />
            <Field>
              <FieldLabel htmlFor="numero">Número do recibo</FieldLabel>
              <Input
                id="numero"
                placeholder="Opcional"
                value={data.numero}
                onChange={(event) => onChange({ numero: event.target.value })}
              />
            </Field>
          </FieldGroup>
          <Field>
            <FieldLabel htmlFor="observacao">Observação</FieldLabel>
            <Textarea
              id="observacao"
              placeholder="Opcional"
              value={data.observacao}
              onChange={(event) => onChange({ observacao: event.target.value })}
            />
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      <FieldSet>
        <FieldLegend>Pago por</FieldLegend>
        <FieldGroup>
          <Field data-invalid={Boolean(errors.pagadorNome) || undefined}>
            <FieldLabel htmlFor="pagador-nome">Nome / razão social</FieldLabel>
            <Input
              id="pagador-nome"
              value={data.pagador.nome}
              aria-invalid={Boolean(errors.pagadorNome) || undefined}
              onChange={(event) =>
                onPartyChange("pagador", { nome: event.target.value })
              }
            />
            {errors.pagadorNome ? (
              <FieldError>{errors.pagadorNome}</FieldError>
            ) : null}
          </Field>
          <FieldGroup className="min-w-0 sm:flex-row">
            <DocumentField
              id="pagador-doc"
              value={data.pagador.documento}
              error={errors.pagadorDocumento}
              onChange={(documento) => onPartyChange("pagador", { documento })}
            />
            <Field data-invalid={Boolean(errors.pagadorCelular) || undefined}>
              <FieldLabel htmlFor="pagador-celular">Telefone</FieldLabel>
              <Input
                id="pagador-celular"
                inputMode="tel"
                placeholder="(00) 00000-0000"
                value={data.pagador.celular}
                aria-invalid={Boolean(errors.pagadorCelular) || undefined}
                onChange={(event) =>
                  onPartyChange("pagador", {
                    celular: maskPhone(event.target.value),
                  })
                }
              />
              {errors.pagadorCelular ? (
                <FieldError>{errors.pagadorCelular}</FieldError>
              ) : null}
            </Field>
          </FieldGroup>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      <FieldSet>
        <FieldLegend>Recebido por</FieldLegend>
        <FieldGroup>
          <FieldDescription>
            Guardamos neste navegador para o próximo recibo.
          </FieldDescription>
          <Field data-invalid={Boolean(errors.beneficiarioNome) || undefined}>
            <FieldLabel htmlFor="beneficiario-nome">Nome</FieldLabel>
            <Input
              id="beneficiario-nome"
              value={data.beneficiario.nome}
              aria-invalid={Boolean(errors.beneficiarioNome) || undefined}
              onChange={(event) =>
                onPartyChange("beneficiario", { nome: event.target.value })
              }
            />
            {errors.beneficiarioNome ? (
              <FieldError>{errors.beneficiarioNome}</FieldError>
            ) : null}
          </Field>
          <FieldGroup className="min-w-0 sm:flex-row">
            <DocumentField
              id="beneficiario-doc"
              value={data.beneficiario.documento}
              error={errors.beneficiarioDocumento}
              onChange={(documento) =>
                onPartyChange("beneficiario", { documento })
              }
            />
            <CityCombobox
              id="beneficiario-cidade"
              value={data.beneficiario.cidade}
              error={errors.beneficiarioCidade}
              onChange={(cidade) => onPartyChange("beneficiario", { cidade })}
            />
          </FieldGroup>
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  );
}

"use client";

import { forwardRef } from "react";
import { CheckIcon } from "lucide-react";
import { documentLabel } from "@/lib/br-docs";
import { formatMoney } from "@/lib/money";
import {
  filledReceiptItems,
  itemLineTotal,
  itemQuantity,
  paymentMoment,
  receiptTotal,
  type ReceiptData,
} from "@/lib/receipt";

function PreviewField({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[8px] text-[var(--receipt-muted)]">{label}</span>
      <strong className="text-[10.5px] font-semibold leading-snug">
        {value}
      </strong>
    </div>
  );
}

export const ReceiptPreview = forwardRef<HTMLElement, { data: ReceiptData }>(
  function ReceiptPreview({ data }, ref) {
    const moment = paymentMoment(data);
    const amount = formatMoney(receiptTotal(data));
    const items = filledReceiptItems(data);
    const receiptNumber = data.numero ? `Nº ${data.numero}` : "RECIBO";
    const references = [
      data.referencias?.id ? ["ID", data.referencias.id] : null,
      data.referencias?.documento
        ? ["Documento", data.referencias.documento]
        : null,
      data.referencias?.autenticacao
        ? ["Autenticação", data.referencias.autenticacao]
        : null,
    ].filter(Boolean) as [string, string][];

    return (
      <div className="w-full min-w-0 xl:sticky xl:top-14 xl:self-start">
        <div className="@container w-full">
          <div className="relative aspect-[210/297] w-full overflow-hidden">
            <div className="absolute top-0 left-0 origin-top-left w-[210mm] [transform:scale(calc(100cqi/210mm))] print:relative print:transform-none">
              <article
                ref={ref}
                className="receipt-sheet flex min-h-[297mm] w-[210mm] flex-col rounded-none px-[20mm] pb-[15mm] pt-[20mm] print:shadow-none"
              >
                <header className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-[10px] bg-[var(--receipt-accent)] text-white [&_svg]:size-4">
                      <CheckIcon />
                    </div>
                    <div>
                      <p className="text-base font-semibold tracking-tight">
                        Recibo de pagamento
                      </p>
                      <p className="text-[8px] tracking-[0.16em] text-[var(--receipt-muted)] uppercase">
                        Pagamento confirmado
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-[9px] leading-relaxed text-[var(--receipt-muted)]">
                    <p className="font-semibold text-[var(--receipt-ink)]">
                      {receiptNumber}
                    </p>
                    <p>{moment || "-"}</p>
                  </div>
                </header>

                <section className="my-[22mm]">
                  <p className="text-[9px] font-semibold tracking-[0.18em] text-[var(--receipt-accent)] uppercase">
                    Valor recebido
                  </p>
                  <h1 className="mt-2 text-5xl font-semibold tracking-tight">
                    {amount}
                  </h1>
                  <p className="mt-3 max-w-[118mm] text-[10.5px] leading-relaxed text-[var(--receipt-muted)]">
                    Confirmamos o recebimento do valor acima pelos serviços ou
                    produtos descritos neste documento.
                  </p>
                </section>

                <section className="grid grid-cols-2 border-y border-[var(--receipt-line)]">
                  <div className="flex flex-col gap-4 py-8 pr-8">
                    <p className="text-[8px] font-semibold tracking-[0.17em] text-[var(--receipt-accent)] uppercase">
                      Pago por
                    </p>
                    <PreviewField
                      label="Nome / razão social"
                      value={data.pagador.nome}
                    />
                    <PreviewField
                      label={documentLabel(data.pagador.documento)}
                      value={data.pagador.documento}
                    />
                    <PreviewField
                      label="Contato"
                      value={data.pagador.celular}
                    />
                  </div>
                  <div className="flex flex-col gap-4 border-l border-[var(--receipt-line)] py-8 pl-8">
                    <p className="text-[8px] font-semibold tracking-[0.17em] text-[var(--receipt-accent)] uppercase">
                      Recebido por
                    </p>
                    <PreviewField label="Nome" value={data.beneficiario.nome} />
                    <PreviewField
                      label={documentLabel(data.beneficiario.documento)}
                      value={data.beneficiario.documento}
                    />
                    <PreviewField
                      label="Localidade"
                      value={data.beneficiario.cidade}
                    />
                  </div>
                </section>

                <section className="flex flex-col gap-3 border-b border-[var(--receipt-line)] py-8">
                  <p className="text-[8px] font-semibold tracking-[0.17em] text-[var(--receipt-accent)] uppercase">
                    Serviços / produtos
                  </p>
                  {items.length > 0 ? (
                    items.map((item) => {
                      const quantity = itemQuantity(item);
                      return (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-8"
                        >
                          <div>
                            <h2 className="text-sm font-semibold tracking-tight">
                              {item.descricao || "Item"}
                            </h2>
                            <p className="mt-0.5 text-[8.5px] text-[var(--receipt-muted)]">
                              {quantity} × {formatMoney(item.valor)}
                            </p>
                          </div>
                          <p className="text-sm font-semibold whitespace-nowrap">
                            {formatMoney(itemLineTotal(item))}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <h2 className="text-sm font-semibold tracking-tight">
                      Itens do recibo
                    </h2>
                  )}
                  <p className="text-[9px] text-[var(--receipt-muted)]">
                    Referente ao pagamento realizado em {moment || "-"}.
                  </p>
                </section>

                <p className="mt-8 text-[9px] leading-relaxed text-[#475b5c]">
                  Para os devidos fins, declaro que recebi de{" "}
                  <strong>{data.pagador.nome || "-"}</strong> a importância de{" "}
                  <strong>{amount}</strong>, referente{" "}
                  {items.length > 1
                    ? "aos itens descritos"
                    : "ao item descrito"}{" "}
                  acima, dando plena e irrevogável quitação do valor recebido.
                </p>
                {data.observacao ? (
                  <p className="mt-3 text-[8.5px] text-[var(--receipt-muted)]">
                    <strong>Observação:</strong> {data.observacao}
                  </p>
                ) : null}

                <div className="mt-[28mm] min-h-[28mm] w-[90mm] border-t border-[var(--receipt-ink)] pt-3">
                  <p className="text-[9.5px] font-semibold">
                    {data.beneficiario.nome || "Beneficiário"}
                  </p>
                  <p className="mt-0.5 text-[8px] text-[var(--receipt-muted)]">
                    {data.beneficiario.documento}
                  </p>
                </div>

                <footer className="mt-auto border-t border-[var(--receipt-line)] pt-4">
                  {references.length > 0 ? (
                    <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-[7px] text-[var(--receipt-muted)]">
                      {references.map(([label, value]) => (
                        <span key={label}>
                          <b className="text-[var(--receipt-ink)]">{label}</b>{" "}
                          {value}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <div className="flex items-end justify-between gap-4 text-[7px] text-[var(--receipt-muted)]">
                    <span className="max-w-[125mm]">
                      Documento gerado eletronicamente com base nas informações
                      fornecidas pelas partes.
                    </span>
                    <span className="font-semibold tracking-[0.12em] text-[var(--receipt-accent)] uppercase">
                      Quitado
                    </span>
                  </div>
                </footer>
              </article>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

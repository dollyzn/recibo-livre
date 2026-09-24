import type { Metadata } from "next";
import { ReceiptGenerator } from "@/components/receipt-generator";

export const metadata: Metadata = {
  title: "Gerar recibo",
  description:
    "Envie um comprovante em PDF ou preencha os dados na mão e baixe o recibo em PDF ou PNG. Processamento 100% no navegador.",
  alternates: {
    canonical: "/gerar",
  },
  openGraph: {
    title: "Gerar recibo · Recibo Livre",
    description:
      "Envie um comprovante ou preencha os dados e baixe um recibo em PDF ou PNG, sem enviar nada para servidor.",
    url: "/gerar",
  },
  twitter: {
    title: "Gerar recibo · Recibo Livre",
    description:
      "Envie um comprovante ou preencha os dados e baixe um recibo em PDF ou PNG, sem enviar nada para servidor.",
  },
};

export default function GeneratePage() {
  return (
    <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-6 overflow-x-clip px-4 py-10">
      <div className="flex max-w-2xl flex-col gap-2">
        <h1 className="font-heading text-3xl font-medium tracking-tight">
          Gerar recibo
        </h1>
        <p className="text-muted-foreground">
          Envie um comprovante em PDF ou preencha tudo na mão. O arquivo é
          gerado neste navegador.
        </p>
      </div>
      <ReceiptGenerator />
    </div>
  );
}

import { DownloadIcon, FileUpIcon, PenLineIcon } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const steps = [
  {
    icon: FileUpIcon,
    title: "Envie o comprovante",
    description:
      "Arraste um PDF. Extraímos o que for possível — valor, data, pagador e referências — no próprio navegador.",
  },
  {
    icon: PenLineIcon,
    title: "Confira os dados",
    description:
      "Complete itens, beneficiário e observação. O preview A4 atualiza na hora.",
  },
  {
    icon: DownloadIcon,
    title: "Baixe o PDF",
    description:
      "Um recibo com espaço para a assinatura digital do Gov.br, pronto para enviar.",
  },
]

export function LandingSteps() {
  return (
    <section id="como-funciona" className="mx-auto w-full max-w-6xl px-4 py-20">
      <div className="mb-10 flex max-w-2xl flex-col gap-3">
        <p className="text-sm font-medium text-primary">Como funciona</p>
        <h2 className="font-heading text-3xl font-medium tracking-tight">
          Três passos, do comprovante ao PDF.
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <BlurFade key={step.title} delay={0.1 * index} inView>
            <Card>
              <CardHeader>
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted [&_svg]:size-4">
                  <step.icon />
                </div>
                <CardTitle>{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          </BlurFade>
        ))}
      </div>
    </section>
  )
}

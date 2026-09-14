import Link from "next/link";
import { ArrowRightIcon, LockIcon } from "lucide-react";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { LightRays } from "@/components/ui/light-rays";
import { siteConfig } from "@/lib/site";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      <AnimatedGridPattern
        numSquares={28}
        maxOpacity={0.08}
        duration={3}
        className="inset-0 mask-[radial-gradient(500px_circle_at_center,white,transparent)]"
      />
      <LightRays className="pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col items-center justify-center gap-8 px-4 py-24 text-center">
        <BlurFade delay={0.05}>
          <div className="inline-flex items-center rounded-full border px-3 py-1">
            <AnimatedShinyText className="mx-0 text-sm">
              100% no navegador · sem cadastro · open source
            </AnimatedShinyText>
          </div>
        </BlurFade>
        <BlurFade
          delay={0.12}
          className="flex max-w-3xl flex-col items-center gap-4"
        >
          <h1 className="font-heading text-4xl font-medium tracking-tight text-balance sm:text-6xl">
            Do comprovante ao recibo de pagamento.
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground text-balance">
            {siteConfig.description}
          </p>
        </BlurFade>
        <BlurFade delay={0.2}>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/gerar" />}
            >
              Gerar recibo
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<a href="#como-funciona" />}
            >
              Como funciona
            </Button>
          </div>
        </BlurFade>
        <BlurFade delay={0.28} className="w-full max-w-xl">
          <div className="relative overflow-hidden rounded-xl border bg-card p-6 text-left">
            <BorderBeam
              size={80}
              duration={8}
              colorFrom="var(--primary)"
              colorTo="transparent"
            />
            <p className="flex items-center gap-2 text-sm text-muted-foreground [&_svg]:size-4">
              <LockIcon />
              Comprovante, documentos e valores ficam no seu computador. Nada é
              enviado para servidor.
            </p>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}

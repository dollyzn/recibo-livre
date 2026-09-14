import Link from "next/link"
import { Code2Icon, FileCheckIcon, ReceiptIcon } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/site"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-heading font-medium">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground [&_svg]:size-4">
            <FileCheckIcon />
          </span>
          {siteConfig.name}
        </Link>
        <nav className="flex items-center gap-1">
          <Button size="sm" nativeButton={false} render={<Link href="/gerar" />}>
            <ReceiptIcon data-icon="inline-start" />
            Gerar recibo
          </Button>
          <ThemeToggle />
          <Button
            variant="outline"
            size="icon"
            nativeButton={false}
            render={<a href={siteConfig.author.url} target="_blank" rel="noreferrer" />}
            aria-label={`Site de ${siteConfig.author.name}`}
          >
            <span className="font-heading text-xs font-semibold">N.</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            nativeButton={false}
            render={<a href={siteConfig.author.github} target="_blank" rel="noreferrer" />}
            aria-label="GitHub"
          >
            <Code2Icon />
          </Button>
        </nav>
      </div>
    </header>
  )
}

import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/site"

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          {siteConfig.name} · um projeto de{" "}
          <Button
            variant="link"
            nativeButton={false}
            render={<a href={siteConfig.author.url} target="_blank" rel="noreferrer" />}
            className="h-auto px-0"
          >
            {siteConfig.author.name}
          </Button>
        </p>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Button
            variant="link"
            nativeButton={false}
            render={<a href={siteConfig.author.github} target="_blank" rel="noreferrer" />}
            className="h-auto px-0"
          >
            GitHub
          </Button>
          <span>MIT License</span>
        </p>
      </div>
    </footer>
  )
}

"use client"

import { useTheme } from "@wrksz/themes/client"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { buttonVariants } from "@/components/ui/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const theme = resolvedTheme === "dark" ? "dark" : "light"

  return (
    <AnimatedThemeToggler
      variant="circle"
      theme={theme}
      onThemeChange={setTheme}
      aria-label="Alternar tema"
      className={buttonVariants({ variant: "ghost", size: "icon" })}
    />
  )
}

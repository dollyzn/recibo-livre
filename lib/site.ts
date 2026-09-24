const repo = "recibo-livre";
const isGithubPages = process.env.GITHUB_PAGES === "true";

export const siteConfig = {
  name: "Recibo Livre",
  shortName: "Recibo Livre",
  tagline: "Recibos em PDF, no seu navegador.",
  description:
    "Gere recibos de pagamento em PDF ou PNG a partir de um comprovante ou preenchendo os dados na mão. Tudo roda no navegador: nada sobe para servidor.",
  locale: "pt_BR",
  language: "pt-BR",
  /** URL canônica do site em produção (GitHub Pages). */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (isGithubPages
      ? `https://dollyzn.github.io/${repo}`
      : "http://localhost:3000"),
  /** Base path do deploy em project pages. Vazio em dev local. */
  basePath: isGithubPages ? `/${repo}` : "",
  keywords: [
    "recibo",
    "recibo de pagamento",
    "gerar recibo",
    "recibo PDF",
    "recibo online",
    "comprovante",
    "pagamento",
    "open source",
    "privacidade",
    "Brasil",
  ],
  author: {
    name: "Natã Santos",
    url: "https://nsantos.dev",
    github: "https://github.com/dollyzn",
    githubRepo: `https://github.com/dollyzn/${repo}`,
  },
  themeColor: {
    light: "#0F766E",
    dark: "#0F766E",
  },
} as const;

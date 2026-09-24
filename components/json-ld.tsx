import { siteConfig } from "@/lib/site";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: siteConfig.language,
        publisher: { "@id": `${siteConfig.url}/#person` },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${siteConfig.url}/#app`,
        name: siteConfig.name,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "BRL",
        },
        description: siteConfig.description,
        url: siteConfig.url,
        inLanguage: siteConfig.language,
        author: { "@id": `${siteConfig.url}/#person` },
        isAccessibleForFree: true,
      },
      {
        "@type": "Person",
        "@id": `${siteConfig.url}/#person`,
        name: siteConfig.author.name,
        url: siteConfig.author.url,
        sameAs: [siteConfig.author.github, siteConfig.author.url],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

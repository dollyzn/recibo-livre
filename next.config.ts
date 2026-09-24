import type { NextConfig } from "next";
import { siteConfig } from "./lib/site";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: siteConfig.basePath || undefined,
  assetPrefix: siteConfig.basePath ? `${siteConfig.basePath}/` : undefined,
  transpilePackages: ["pdfjs-dist"],
};

export default nextConfig;

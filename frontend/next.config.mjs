import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const isStaticExport = process.env.STATIC_EXPORT === "true";
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoBasePath = "/aster-quant-trading-platform";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: isStaticExport ? "export" : "standalone",
  reactStrictMode: true,
  basePath: isGithubPages ? repoBasePath : undefined,
  assetPrefix: isGithubPages ? `${repoBasePath}/` : undefined,
  turbopack: {
    root
  }
};

export default nextConfig;

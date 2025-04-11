/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for Vercel Hobby plan
  experimental: {
    // Only include essential packages
    serverComponentsExternalPackages: ["puppeteer-core"],

    // Only trace necessary files for chromium-min
    outputFileTracingIncludes: {
      "/api/pdf": ["./node_modules/@sparticuz/chromium-min/dist/**"],
    },
  },
};

export default nextConfig;

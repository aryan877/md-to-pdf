/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output as standalone build for better Vercel compatibility
  output: "standalone",
  // Add custom headers to increase function timeout
  serverRuntimeConfig: {
    // Use a larger API timeout for PDF generation
    apiTimeout: 60, // in seconds
  },
  // Configure Vercel functions to have more memory and timeout
  experimental: {
    serverComponentsExternalPackages: [
      "puppeteer-core",
      "@sparticuz/chromium-min",
    ],
    // Ensure Chromium binary is included in the deployment
    outputFileTracingIncludes: {
      "/api/pdf": ["./node_modules/@sparticuz/chromium-min/**"],
    },
  },
  // Increase serverless function limits for Vercel
  functions: {
    // Specific configuration for our PDF route
    "app/api/pdf/route": {
      memory: 1024, // Maximum memory size in MB for Hobby plan
      maxDuration: 60, // Maximum execution time in seconds
    },
  },
};

export default nextConfig;

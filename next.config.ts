/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output as standalone build for better Vercel compatibility
  output: "standalone",
  // Add custom headers to increase function timeout
  serverRuntimeConfig: {
    // Use a larger API timeout for PDF generation
    apiTimeout: 60, // in seconds
  },
};

export default nextConfig;

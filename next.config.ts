import type { NextConfig } from "next";

// Environment-based configuration
const isStaticExport = process.env.NEXT_EXPORT === 'true';
const isVercelDeploy = process.env.VERCEL === '1';
const isNetlifyDeploy = process.env.NETLIFY === 'true';

const nextConfig: NextConfig = {
  // Base configuration for all platforms
  output: isStaticExport ? 'export' : 'standalone',
  trailingSlash: false,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // Image optimization - disable for static exports
  images: {
    unoptimized: isStaticExport || isNetlifyDeploy,
  },
  
  // Platform-specific optimizations
  ...(isVercelDeploy && {
    // Vercel-specific optimizations
    experimental: {
      serverComponentsExternalPackages: ['reactflow'],
    },
  }),
  
  ...(isNetlifyDeploy && {
    // Netlify-specific optimizations
    distDir: 'out',
  }),
};

export default nextConfig;

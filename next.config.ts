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
  
  // Webpack configuration for ReactFlow
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent ReactFlow from being processed on the server
      config.externals = config.externals || [];
      config.externals.push({
        'reactflow': 'reactflow',
        '@reactflow/core': '@reactflow/core',
        '@reactflow/node-resizer': '@reactflow/node-resizer',
        '@reactflow/node-toolbar': '@reactflow/node-toolbar',
      });
    }
    return config;
  },
  
  // Platform-specific optimizations
  ...(isVercelDeploy && {
    // Vercel-specific optimizations
    serverExternalPackages: ['reactflow', '@reactflow/core', '@reactflow/node-resizer', '@reactflow/node-toolbar'],
  }),
  
  ...(isNetlifyDeploy && {
    // Netlify-specific optimizations
    distDir: 'out',
  }),
};

export default nextConfig;

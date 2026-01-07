/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Exclude Node.js built-in modules from browser bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        buffer: false,
        process: false,
        util: false,
        // Exclude node: protocol imports
        'node:child_process': false,
        'node:fs': false,
        'node:path': false,
        'node:url': false,
        'node:crypto': false,
        child_process: false,
      }
    }
    return config
  },
}

export default nextConfig

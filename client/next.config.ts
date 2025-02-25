import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // setting img in there will allow us to use the next/image component
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'https://lottie.host', // link domain allowed
        port: '',
        pathname: '/**'
      }
    ]
  },
  logging: {
    fetches: {
      fullUrl: true
    }
  }
}

export default nextConfig

// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true, // Enable Server Actions
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.techpublishnow.com',
        port: '', // Leave empty unless the URL specifies a port
        pathname: '/**', // Allow all paths from this domain
      },
    ],
  },
};

export default nextConfig; // Use export default for ES module

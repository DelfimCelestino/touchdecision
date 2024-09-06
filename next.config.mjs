/** @type {import('next').NextConfig} */
import withPWA from "next-pwa"

const nextConfig = {
  ...withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
  }),
  httpAgentOptions: {
    keepAlive: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
    ],
  },
}

export default nextConfig

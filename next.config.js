/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['uploadthing.com', 'lh3.googleusercontent.com', 'avatars.githubusercontent.com', 'images.unsplash.com', 'plus.unsplash.com'],
  },
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig

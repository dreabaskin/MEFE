/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'localhost', 'images.unsplash.com'],
    unoptimized: true, // For data URLs
  },
}

module.exports = nextConfig


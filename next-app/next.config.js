const origins = process.env.NEXT_DEV_ORIGINS
  ? process.env.NEXT_DEV_ORIGINS.split(',').map(origin => origin.trim())
  : [];

console.log('✅ NEXT_DEV_ORIGINS:', process.env.NEXT_DEV_ORIGINS);
console.log('✅ Parsed Origins:', origins);


/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Handle cross-origin requests for development
  async headers() {
    return [
      {
        source: '/_next/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          }
        ]
      }
    ]
  }
};

module.exports = nextConfig;

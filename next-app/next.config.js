const origins = process.env.NEXT_DEV_ORIGINS
  ? process.env.NEXT_DEV_ORIGINS.split(',').map(origin => origin.trim())
  : [];

console.log('✅ NEXT_DEV_ORIGINS:', process.env.NEXT_DEV_ORIGINS);
console.log('✅ Parsed Origins:', origins);


/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // allowedDevOrigins: origins,
};

module.exports = nextConfig;

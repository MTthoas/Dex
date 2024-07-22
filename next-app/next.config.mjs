/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    webpack: (config) => {
        config.externals.push('pino-pretty', 'lokijs', 'encoding');
        return config;
    },
    images: {
        domains: ['coin-images.coingecko.com'],
    },
};

export default nextConfig;

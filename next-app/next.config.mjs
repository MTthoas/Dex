/** @type {import('next').NextConfig} */
const nextConfig = {
<<<<<<< HEAD
    webpack: config => {
      config.externals.push('pino-pretty', 'lokijs', 'encoding')
      return config
    }
  }
=======
    output: 'standalone',
    webpack: (config) => {
        config.externals.push('pino-pretty', 'lokijs', 'encoding');
        return config;
    },
};
>>>>>>> develop

export default nextConfig;

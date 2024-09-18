const path = require("path");
/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Configuration spécifique à Next.js */
  sassOptions: {
    includePaths: ["./src/app/styles"],
  },
};

module.exports = {
  ...nextConfig, // Inclure la configuration spécifique à Next.js
  reactStrictMode: true,
  webpack(config, { dev, isServer }) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };

    // Retourne la configuration modifiée de Webpack
    return config;
  },
};

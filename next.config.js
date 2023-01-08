/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
module.exports = {
  webpack(config) {
    config.module.rules.push(
      {
        test: /\.svg$/i,
        type: 'asset',
        resourceQuery: { not: [/component/] },
      },
      {
        test: /\.svg$/i,
        resourceQuery: /component/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              babel: true,
              icon: true,
            },
          },
        ],
      },
    );
    return config;
  },
};

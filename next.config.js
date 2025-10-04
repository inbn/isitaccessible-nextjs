/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  async redirects() {
    return [
      {
        source: '/package',
        has: [
            {
              type: 'query',
              key: 'name'
            }
        ],
        destination: '/package/:name',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

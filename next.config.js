module.exports = {
  reactStrictMode: true,
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

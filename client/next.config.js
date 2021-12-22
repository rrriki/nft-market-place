module.exports = {
  reactStrictMode: true,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.tsx?$/,
      loader: 'ts-loader',
      exclude: /node_modules/,
    })

    return config
  },
}

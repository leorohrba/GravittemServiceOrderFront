// const BundleAnalyzerPlugin = require('umi-webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path')

module.exports = (config, {webpack}) => {
  // Set alias
  config.resolve.alias.set(
    '@components',
    path.resolve(__dirname, 'src', 'components'),
  )
  config.resolve.alias.set('@pages', path.resolve(__dirname, 'src', 'pages'))
  config.resolve.alias.set('@utils', path.resolve(__dirname, 'src', 'utils'))
  config.resolve.alias.set(
    '@services',
    path.resolve(__dirname, 'src', 'services'),
  )
  config.resolve.alias.set('@assets', path.resolve(__dirname, 'src', 'assets'))
  config.resolve.alias.set(
    '@locales',
    path.resolve(__dirname, 'src', 'locales'),
  )
  config.resolve.alias.set('@models', path.resolve(__dirname, 'src', 'models'))
  config.resolve.alias.set('@atoms', path.resolve(__dirname, 'src', 'atoms'))
//   config
//   .plugin("umi-webpack-bundle-analyzer")
//   .use(new BundleAnalyzerPlugin());
}

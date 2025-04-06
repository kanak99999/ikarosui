/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    'antd',
    'rc-util',
    'rc-picker',
    '@ant-design/icons',
    '@ant-design/icons-svg'
  ],
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      extensionAlias: {
        '.js': ['.js', '.ts', '.tsx']
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      fallback: {
        ...config.resolve.fallback,
        module: false,
      }
    };
    return config;
  },
  // experimental: {
  //   esmExternals: 'loose'
  // }
};

module.exports = nextConfig;

/* eslint-disable */
/* config-overrides.js */
const path = require('path')
const {
  override,
  // disableEsLint,
  addLessLoader,
  addBabelPlugin,
  fixBabelImports,
  addPostcssPlugins,
  addDecoratorsLegacy,
  overrideDevServer,
  addWebpackPlugin,
  addWebpackAlias
} = require('customize-cra');
const rewireStyl = require('react-app-rewire-stylus-modules');

const addStylLoad = () => config => {
  config = rewireStyl(config);
  
  return config;
};

module.exports = override(
  // addWebpackPlugin(new LifeCyclePlugin()),
  addStylLoad(),
  // disableEsLint(),
  addBabelPlugin('@babel/plugin-proposal-optional-chaining'),
  addDecoratorsLegacy(),
  fixBabelImports('import', {
    libraryName: 'antd-mobile',
    libraryDirectory: 'es',
    style: true,
  }),
  addWebpackAlias({
    ['@']: path.resolve(__dirname, 'src'),
    ['@container']: path.resolve(__dirname, 'src/container'),
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@brand-primary': '#5470FF',
      '@brand-primary-tap': '#5470FF',
      '@hd': '1px'
    }
  }),
  addPostcssPlugins([
    require('postcss-import')({}),
    require('postcss-url')({}),
    require('postcss-aspect-ratio-mini')({}),  //  处理元素容器宽高比
    require('postcss-write-svg')({
      utf8: false
    }), // 处理移动端1px
    require('postcss-preset-env')({}), // 可以使用 css 未来的特性 // postcss-cssnext 已弃用
    require('postcss-plugin-px2rem')({
      rootValue: 37.5, // 这里对应的是750的设计图尺寸
      selectorBlackList: ['html'],
      mediaQuery: true,
      propBlackList: ['font-size'] // 如果要保持font-size不转换
    }),
    // require('cssnano')({       // 压缩和清理 css
    //   'preset': 'advanced',
    //   'autoprefixer': false,   // postcss-preset-env 已经有了 autoprefixer, 因此 false 且删掉默认的 autoprefixer
    //   'postcss-zindex': false
    // })
  ]),
);
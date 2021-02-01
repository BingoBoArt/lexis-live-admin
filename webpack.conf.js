var webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin');

var path = require('path');
// 参考但远优于 https://github.com/vuejs-templates/webpack/blob/master/template/build/utils.js
var extract = require('extract-text-webpack-plugin').extract;
// postcss-loader 配置见 .postcssrc
// var basicLoaders = ['css-loader', 'postcss-loader', 'px2rem-loader-le?remUnit=75&remPrecision=8', 'less-loader'];
var basicLoaders = ['css-loader', 'postcss-loader', 'less-loader'];
var LOADERS = {
  css: basicLoaders,
  less: basicLoaders.concat('less-loader'),
  sass: basicLoaders.concat('sass-loader?indentedSyntax=true'),
  scss: basicLoaders.concat('sass-loader')
};

function ruleGen(ext, isForVueLoader) {
  var styleLoader = (isForVueLoader ? 'vue-' : '') + 'style-loader',
    useLoaders = LOADERS[ext];

  // 开发环境下直接内嵌 CSS 以支持热替换
  //if (ENV.__DEV__) return [styleLoader].concat(useLoaders);
  // 生产环境下分离出 CSS 文件
  return extract({ use: useLoaders, fallback: styleLoader });
}

function styleRulesGen(isForVueLoader) {
  var rules = isForVueLoader ? {} : [];
  Object.keys(LOADERS).forEach(function (ext) {
    isForVueLoader ?
      rules[ext] = ruleGen(ext, true) :
      rules.push({ test: new RegExp('\\.' + ext + '$'), use: ruleGen(ext) });
  });
  return rules;
}
/*
  {
      test: /\.(js|vue)$/,
      loader: 'eslint-loader',
      options: {
        formatter: require('eslint-friendly-formatter')
      },
      enforce: 'pre',
      exclude: /node_modules/
    },
  */
module.exports = {
  entry: {
    
  },
  externals: {
    'vue': 'Vue',
    'vuex': 'Vuex',
    'vue-router': 'VueRouter',
    'element-ui': 'ELEMENT'
  },
  // devtool - source map 配置详见 https://webpack.js.org/configuration/devtool
  devtool: false,
  output: {
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src/'),
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['.js', '.vue', '.json', '.css']
  },
  module: {
    rules: [
    {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: styleRulesGen(true)
      }
    },{
      test: /\.js$/,
      loader: 'babel-loader?cacheDirectory',
      query: {
        presets: ['react', 'es2015-loose', 'stage-0'],
        //'transform-remove-strict-mode' //去除webpack babel后自动增加的 use strict
        // {helpers: false, polyfill: false, regenerator: true, } 解决引用node_modules中自定义组件编译问题
        plugins: [['transform-runtime',{helpers: false, polyfill: false, regenerator: true, }], 'transform-remove-strict-mode', 'transform-decorators-legacy']
      },
      exclude: /node_modules/
    }, {
      test: /\.(png|jpe?g|gif|svg)$/,
      loader: 'url-loader',
      options: {
        limit: 10240, // 10KB 以下使用 base64
        name: '/images/[name]-[hash:6].[ext]'
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)$/,
      loader: 'url-loader',
      options: {
        limit: 10240,
        name: '/fonts/[name]-[hash:6].[ext]'
      }
    }].concat(styleRulesGen())
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        return (module.context && module.context.indexOf('node_modules') !== -1);
      }
    }),
    new webpack.HashedModuleIdsPlugin()
  ]
};

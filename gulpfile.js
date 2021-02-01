/**
 * @export {gulp}
 * 1. gulp.start('default')
 * 2. 命令行执行 gulp
 */
var gulp = require('gulp'),
  path = require('path'),
  events = require('events'),
  fs = require('fs-extra'),
  stringReplace = require('gulp-replace'),//replace
  webpack = require('webpack'),
  gutil = require("gulp-util"),
  gulpSequence = require('gulp-sequence'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin'),
  WebpackNotifierPlugin = require('webpack-notifier');
  config = require('./webpack.conf');

var ROOT = path.resolve(__dirname, './');
var isDev = false,
    isTest = false,
    isPro = false;

String.prototype.join = function (target) {
  return path.join(this.toString(), target);
};
var BuildConfig = {//build的配置信息
  build_project: ROOT.join('build/'),    // build 后输出目录
  origin_project: ROOT.join('src/'),      // 源码目录
  need_copy_path: [ // 复制目录
    'assets'
  ]
};

gulp.task('default', ['bundle']);

if (module.parent) {
  module.exports = gulp;
} else {
  gulp.start('default');
}

// 清理文件
gulp.task('clean', function (cb) {
  fs.emptyDirSync(BuildConfig.build_project); // 清空 build 目录
  cb && cb();
});

/*
 * 查找:测试域名和未注释的localData
 */
gulp.task('find_word', function (cb) {
  //eg:
  if(!isPro){cb&&cb();return;}

  var rootPath = BuildConfig.origin_project;
  //var lookingForString = '123';
  //recursiveReadFile(filePath,lookingForString);
  recursiveReadFile(rootPath, "     mock:");//空格不能删除防止，中断注释掉的localData；

  function recursiveReadFile(fileName,lookingForString) {
      if (!fs.existsSync(fileName)) return;
      if (isFile(fileName)) {
          check(fileName,lookingForString);
      }
      if (isDirectory(fileName)) {
          var files = fs.readdirSync(fileName);
          files.forEach(function (val, key) {
              var temp = path.join(fileName, val);
              if (isDirectory(temp)) recursiveReadFile(temp,lookingForString);
              if (isFile(temp)) check(temp,lookingForString);
          })
      }
      function check(fileName,lookingForString) {
          var data = readFile(fileName);
          var exc = new RegExp(lookingForString);
          if (exc.test(data)) {
              var ee = new events.EventEmitter;
              gutil.log("error", gutil.colors.red("存在mock数据"));
              ee.emit('error', new Error('find ' + lookingForString + ' in ' + fileName));
          }
      }

      function isDirectory(fileName) {
          if (fs.existsSync(fileName)) return fs.statSync(fileName).isDirectory();
      }

      function isFile(fileName) {
          if (fs.existsSync(fileName)) return fs.statSync(fileName).isFile();
      }

      function readFile(fileName) {
          if (fs.existsSync(fileName)) return fs.readFileSync(fileName, "utf-8");
      }
  }
  cb && cb();
});

gulp.task("webpack_build", function(){
  if(!isDev){//生产环境或者测试环境
    config.output = {
      path: BuildConfig.build_project,
      publicPath: '',
      filename: 'js/[name].[chunkhash:6].js',
      chunkFilename: 'js/[id].[chunkhash:6].js'
    };
    config.plugins.push(
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        comments: false,
        compress: {
          warnings: false,
          collapse_vars: true,
          reduce_vars: true
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        minChunks: Infinity
      }),
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.optimize.MinChunkSizePlugin({
        minChunkSize: 30000
      }),
      new ExtractTextPlugin({
        filename: 'css/[name].[contenthash:6].css',
        allChunks: true // 若要按需加载 CSS 则请注释掉该行
      }),
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {
          // 避免 cssnano 重新计算 z-index
          safe: true
        },
      }), // 优化 CSS（去重/压缩）

      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: BuildConfig.origin_project.join('index.html'),
        minify: {
          removeAttributeQuotes: true,
          collapseWhitespace: true,
          html5: true,
          minifyCSS: true,
          minifyJS: true,
          removeComments: true,
          removeEmptyAttributes: true,
        }
      })
    );
  }else{//开发环境
    config.watch = true;
    config.output = {
      path: BuildConfig.build_project,
      publicPath: '',
      filename: 'js/[name].js',
      chunkFilename: 'js/[id].js'
    };
    config.plugins.push(
      // new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new FriendlyErrorsPlugin(),
      new ExtractTextPlugin('css/[name].css'),
      new WebpackNotifierPlugin(),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: BuildConfig.origin_project.join('index.html')
      })
    );
  }
  config.entry = {
    app: BuildConfig.origin_project.join('app.js')
  };

  config.resolve = {
    alias: {
      '@': BuildConfig.origin_project,
      'vue': 'vue/dist/vue.esm.js',
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['.js', '.vue', '.json', '.css']
  },
  webpack(config, function (err, stats) {
    if (err) {
        gutil.log('webpack:' + err)
    }
  });
})


/*
 * 复制其他文件
 */
gulp.task("copyAfter", function (cb) {
  if (BuildConfig.need_copy_path && BuildConfig.need_copy_path.length) {
      BuildConfig.need_copy_path.forEach(function (item, index) {
          fs.stat(BuildConfig.origin_project + item, function (err, stat) {
              if (!err) {
                  var origin_path = null,
                      output_path = null;
                  if (stat.isDirectory()) {
                      origin_path = BuildConfig.origin_project + item + "/**";
                      output_path = BuildConfig.build_project + item;
                  } else if (stat.isFile()) {
                      origin_path = BuildConfig.origin_project + item;
                      output_path = path.dirname(BuildConfig.build_project + item); //获取文件所在目录
                  }
                  gulp.src(origin_path).pipe(gulp.dest(output_path));
              }
          })
      });
      cb();
  } else {
      cb();
  }
});

/**
 * 修改global_env
 */
gulp.task('replaceEnv', function (cb) {
  var replaceText = isPro ? 'global_env: "pro"' : (isTest ? 'global_env: "test"' : 'global_env: "dev"');
  var reg =  new RegExp(/(['"]?)global_env\1\s*:\s*(['"]?)\w+\2/);
  return gulp.src(BuildConfig.origin_project + '/common/config.js')
      .pipe(stringReplace(reg, replaceText))
      .pipe(gulp.dest(BuildConfig.origin_project + 'common/'))
})

gulp.task('dev', function (callback) {
  //开发环境编译
  isDev = true;
  //watch状态下如果不加callback 会出现The thunk already filled错误
  gulpSequence('clean', 'replaceEnv', 'webpack_build', 'copyAfter')(callback)
  // eval(generate_config_task())
});
gulp.task('test', function (callback) {
  //测试环境编译 相比production只去除代码压缩功能
  isTest = true;
  process.env.NODE_ENV = 'production'
  //watch状态下如果不加callback 会出现The thunk already filled错误
  gulpSequence('clean', 'replaceEnv', 'find_word', 'webpack_build', 'copyAfter')(callback)
});
gulp.task('production', function (callback) {
  //生产环境编译
  isPro = true;
  process.env.NODE_ENV = 'production'
  gulpSequence('clean', 'replaceEnv', 'find_word', 'webpack_build', 'copyAfter')(callback)
});

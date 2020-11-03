// Karma 核心configuration
// Generated on Tue Jun 09 2020 22:03:49 GMT+0800 (GMT+08:00)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',  //根路径


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],  // 断言库，带适配器karma-jasmine


    // list of files / patterns to load in the browser
    files: ['./src/**/*.js', 'tests/unit/**/*.spec.js'], //需要测试的js文件


    // list of files / patterns to exclude
    exclude: [],  //排除测试的js文件


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // tests results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],  //进程， 覆盖率

    preprocessors: {  //测试哪些文件对应的覆盖率
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'src/**/*.js': ['coverage']
    },

    // optionally, configure the reporter
    coverageReporter: {  //配置生成的报表
        type : 'html',  //文件类型
        dir : 'docs/coverage/'  //生成位置
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],  //设置无头浏览器


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true, //独立运行

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}

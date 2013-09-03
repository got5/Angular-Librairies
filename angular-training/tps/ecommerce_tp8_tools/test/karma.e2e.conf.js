// Karma configuration
// Generated on Tue Sep 03 2013 10:54:47 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '../',


    // frameworks to use
      frameworks: ["ng-scenario"],


    // list of files / patterns to load in the browser
    files: [
      'test/e2e/scenarios.js'
    ],


    // list of files to exclude
    exclude: [
      
    ],

    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    proxies : {
      // change this if you've changed your grunt server port. default is 9000
      '/': 'http://localhost:9000'
    },

    urlRoot : '/__e2e/'
  });
};

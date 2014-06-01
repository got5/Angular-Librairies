// Karma configuration
// Generated on Mon Aug 26 2013 14:21:36 GMT+0200 (CEST)

module.exports = function(config) {
	config.set({
		
		// Used to change your templates/views into js testable files.
		preprocessors : {
			'templates/**/*.html' : 'ng-html2js'
		},

		// base path, that will be used to resolve files and exclude
		basePath : '../app/',

		// frameworks to use
		frameworks : [ 'jasmine' ],

		// list of files / patterns to load in the browser
		files : [
		    '../test/lib/jquery/jquery.js',
		    'lib/angular/angular.js', 'lib/**/*.js', 
		    'js/**/*.js',
			'../test/lib/angular/angular-mocks.js', 
			'../test/unit/**/*.js',
			'templates/**/*.html' 
		],

		// list of files to exclude
		exclude : [

		],

		// test results reporter to use
		// possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
		reporters : [ 'progress' ],

		// web server port
		port : 9876,

		// enable / disable colors in the output (reporters and logs)
		colors : true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR ||
		// config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel : config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file
		// changes
		autoWatch : false,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		browsers : [ 'Chrome' ],

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout : 60000,

		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun : false
	});
};

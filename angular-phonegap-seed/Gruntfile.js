// Gruntfile with the configuration of grunt-express and grunt-open.
module.exports = function(grunt) {
 
	// Load Grunt tasks declared in the package.json file
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
	
	var yeomanConfig = {
		    app: 'app',
		    dist: 'dist',
		    test: 'test',
		    docs: 'docs'
	};

	try {
		yeomanConfig.app = require('./component.json').appPath || yeomanConfig.app;
	} catch (e) {
		
	}
	
	// Configure Grunt 
	grunt.initConfig({
	
		yeoman: yeomanConfig,
	
		// grunt-express will serve the files from the folders listed in `bases`
		// on specified `port` and `hostname`
		express: {
			all: {
				options: {
					port: 9000,
					hostname: "0.0.0.0",
					bases: ['<%= yeoman.app %>/'],
					livereload: true
				}
			}
		},
 
		// grunt-watch will monitor the projects files
		watch: {
			all: {
				files: [
				        '<%= yeoman.app %>/index.html',
				        '<%= yeoman.app %>/templates/{,*/}*.html',
				        '{.tmp,<%= yeoman.app %>}/css/{,*/}*.css',
				        '{.tmp,<%= yeoman.app %>}/js/{,*/}*.js',
				        '<%= yeoman.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
				        ],
				options: {
					livereload: true
				}
			}
		},
 
		// grunt-open will open your browser at the project's URL
		open: {
			all: {
				// Gets the port from the connect configuration
				path: 'http://localhost:<%= express.all.options.port%>'
			}
		},
		
		// Validates js files
		jshint: {
			files: [
			      'Gruntfile.js', 
			      '{.tmp,<%= yeoman.app %>}/js/{,*/}*.js', 
			      'test/{,*/}*.js'
			      ],
			options: {
				ignores: ['{.tmp,<%= yeoman.app %>}/js/lib/{,*/}*.js'],
				smarttabs: true //TODO: patch jshint to ignore mix spaces/tabs
			}
		},
		
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
					      '<%= yeoman.dist %>/*',
					      '!<%= yeoman.dist %>/.git*'
					      ]
				}]
			}
		},
		
		copy: {
			all: {
				files: {
					expand: true,
					src: '<%= yeoman.app %>/*',
					dest: '<%= yeoman.dist %>/'
				}
			}
		},
		
		// Minify files
		uglify: {
			
		},
		
		// Pre-minifying released app.
		ngmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.dist %>',
					src: '*.js',
					dest: '<%= yeoman.dist %>'
		      }]
		    }
		},
		
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: {
					'<%= yeoman.dist %>/index.html': '<%= yeoman.app %>/index.html'
				}
			}
		},
		
		// Generates documentation
		ngdocs: {
			options: {
			    dest: '<%= yeoman.docs %>',
			    scripts: [
			        '<%= yeoman.app %>/js/controllers/*.js',
			        '<%= yeoman.app %>/js/services/*.js',
			        '<%= yeoman.app %>/js/filters/*.js'
			    ],
			    html5Mode: true,
			    title: "Documentation"
			  }
		},
		
		// Tests
		karma: {
			// Shared options
			options: {
				// base path, that will be used to resolve files and exclude
				basePath: '<%= yeoman.app %>',
				frameworks: ['ng-scenario', 'jasmine', 'requirejs'],
			    autoWatch: true,
			    singleRun: false,
			    colors: true
			},
			// Unit tests
			unit: {
				configFile: '<%= yeoman.test %>/karma-unit.conf.js',
				//autoWatch: false,
				//singleRun: true
			},
			unit_auto: {
				configFile: '<%= yeoman.test %>/karma-unit.conf.js'
			},
			// Midway tests
			midway: {
				configFile: '<%= yeoman.test %>/karma-midway.conf.js',
				autoWatch: false,
				singleRun: true
			},
			midway_auto: {
				configFile: '<%= yeoman.test %>/karma-midway.conf.js'
			},
			// End to end tests
			e2e: {
				configFile: '<%= yeoman.test %>/karma-e2e.conf.js',
				autoWatch: false,
				singleRun: true
			},
			e2e_auto: {
				configFile: '<%= yeoman.test %>/karma-e2e.conf.js'
			}
		}
	});
	
	grunt.registerTask('test:e2e', ['express', 'karma:e2e']);
	grunt.registerTask('test', ['karma:unit', 'karma:midway', 'test:e2e']);
	
	// Creates the `server` task
	grunt.registerTask('server', [
	                              'express',
	                              'open',
	                              'watch'
	                              ]);
};
'use strict';

module.exports = function(grunt){

    grunt.initConfig({

        yeoman: {
            // configurable paths
            app:  'app',
            tmp: 'tmp',
            dist: 'prod'
        },

        pkg: grunt.file.readJSON("package.json"),

        html2js:{
            directives:{
                options:{
                    base:'<%= yeoman.app %>'
                },
                src:['<%= yeoman.app %>/editor/templates/*.html'],
                dest: '<%= yeoman.app %>/editor/templates.js',
                module:false
            }
        },
        concat: {
            options: {
                separator: ';\n',
                line:true,
                block:true,
                stripBanners:true
            },
            editor:{
                src:['<%= yeoman.app %>/editor/templates.js','app/editor/training-editor.js','app/editor/js/**/*.js'],
                dest:'<%= yeoman.tmp %>/editor.js'
            },

            app: {
                src: [ '<%= yeoman.app %>/js/**/*.js'],
                dest: '<%= yeoman.tmp %>/app.js'
            },
            dep: {
                src: [
                    '<%= yeoman.app %>/vendor/ace-builds/src-min/ace.js',
                    '<%= yeoman.app %>/vendor/ace-builds/src-min/ext-language_tools.js',
                    '<%= yeoman.app %>/vendor/angular/angular.min.js',
                    '<%= yeoman.app %>/vendor/angular-route/angular-route.min.js',
                    '<%= yeoman.app %>/vendor/angular-animate/angular-animate.min.js',
                    '<%= yeoman.app %>/vendor/angular-ui-bootstrap-bower/ui-bootstrap-tpls.min.js'
                ],
                dest: '<%= yeoman.tmp %>/dep.js'
            },
            prod:{
                src:['<%= yeoman.tmp %>/dep.js','<%= yeoman.tmp %>/editor.js','<%= yeoman.tmp %>/app.js'],
                dest: '<%= yeoman.dist %>/js/script.js'
            }
        },

        watch: {
            js: {
                files: ['<%= yeoman.app %>/js/**/*.js', 'test/unit/**/*.js'],
                tasks: ['karma:unit:run'],
                options: {
                    livereload: true
                }
            },
            css: {
                files: ['<%= yeoman.app %>/style/**/*.css'],
                tasks: [],
                options: {
                    livereload: true
                }
            }
        },

        copy: {
            prod: {
                cwd: '<%= yeoman.app %>/',
                expand: true,
                src: [
                    'data/**',
                    'styles/**',
                    '*.{ico,png,txt}',
                    '.htaccess',
                    '*.html',
                    'partials/**/*.html',
                    'images/{,*/}*.{webp}',
                    'fonts/*'
                ],
                dest: '<%= yeoman.dist %>/'
            },
            ace:{
                cwd:'app/vendor/ace-builds/src-min/',
                expand:true,
                src:['**'],
                dest: '<%= yeoman.dist %>/'

            }
        },


        uglify: {
            prod: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>/js',
                    src: '**/*.js',
                    dest: '<%= yeoman.dist %>/js'
                }],
                options: {
                    mangle: true
                }
            }
        },
        cssmin: {
            combine: {
                options: {
                    banner: '/* CSS Minified stylesheet */'
                },
                files: {
                    'prod/styles/styles.css': ['<%= yeoman.dist %>/styles/styles.css']
                }
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: ['*.html'],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },
        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            html: ['<%= yeoman.dist %>/index.html','<%= yeoman.dist %>/partials/**/*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= yeoman.dist %>']
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/js/{,*/}*.js',
                        '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                    ]
                }
            }
        },
        clean: {
            prodpre: {
                src: ["<%= yeoman.dist %>/*"]
            },
            temp:{
                src:['<%= yeoman.tmp %>/*']
            }
        }
    });

    require('matchdep').filterDev('grunt-contrib-*').forEach(grunt.loadNpmTasks);
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask("build", [
        "clean:prodpre",
        "html2js",
        'useminPrepare',
        "concat",
        "copy:prod",
        "imagemin",
        //"cssmin",
      //  "uglify:prod",
        "rev",
        "clean:temp",
        "copy:ace",
        "usemin",
        "htmlmin"
    ]);

};
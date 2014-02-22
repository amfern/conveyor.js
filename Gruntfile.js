'use strict';

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.initConfig({

        // Define Directory
        dirs: {
            src: 'src',
            build: 'dist'
        },

        // Metadata
        pkg: grunt.file.readJSON('package.json'),
        banner: '\n' +
            '/*\n' +
            ' * -------------------------------------------------------\n' +
            ' * Project: <%= pkg.title %>\n' +
            ' * Version: <%= pkg.version %>\n' +
            ' *\n' +
            ' * Author:  <%= pkg.author.name %>\n' +
            ' * Site:     <%= pkg.author.url %>\n' +
            ' * Contact: <%= pkg.author.email %>\n' +
            ' *\n' +
            ' *\n' +
            ' * Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.author.name %>\n' +
            ' * -------------------------------------------------------\n' +
            ' */\n' +
            '\n',

        pkgFullName: '<%= pkg.name %>-v<%= pkg.version%>',
        pkgCoreFiles: [
            'src/util/**/*.js',
            'src/core/core.js',
            'src/core/system.js',
            'src/core/entity.js'
        ],
        pkgSystemFiles: ['src/systems/**/*.js'],
        pkgVendores: [
            'lib/performance/index.js',
            'lib/rAF/index.js',
            'lib/threejs/build/three.js',
            'lib/lodash/dist/lodash.js'
        ],

        // Minify and Concat archives
        uglify: {
            options: {
                mangle: false,
                banner: '<%= banner %>'
            },
            dist: {
                files: {
                    '<%= dirs.build %>/<%= pkgFullName %>.min.js': '<%= dirs.build %>/<%= pkgFullName %>.js'
                }
            }
        },

        // Notifications
        notify: {
            options: {
                title: 'Javascript - <%= pkg.title %>',
                message: 'Minified and validated with success!'
            }
        },

        // concat configuration
        concat: {
            options: {
                banner: '<%= banner %>'
            },
            target: {
                src: [
                    // engine core
                    // --------------------------------------------
                    '<%= pkgCoreFiles %>',

                    // engine output/input/interpolation core systems
                    // --------------------------------------------
                    '<%= pkgSystemFiles %>',

                    // basic entities
                    // --------------------------------------------
                    'src/entities/**/*.js' // engine entities
                ],
                dest: '<%= dirs.build %>/<%= pkgFullName %>.js'
            }
        },

        copy: {
            main: {
                src: '<%= dirs.build %>/<%= pkgFullName %>.js',
                dest: '<%= dirs.build %>/<%= pkg.name %>-latest.js',
            },
        },

        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        bower: {
            install: {
                options: {
                    install: true,
                    copy: false
                }
            }
        },

        // clean 
        clean: {
            build: ['<%= dirs.build %>/']
        },

        jasmine: {
            core: {
                src: ['<%= pkgCoreFiles %>', 'spec/mocks/**/*.js'],
                options: {
                    specs: ['spec/core/**/*.js'],
                    helpers: 'spec/helpers/**/*.js',
                    vendor: ['<%= pkgVendores %>'],
                    outfile: 'spec/core.html'
                }
            },
            systems: {
                src: [
                    '<%= pkgCoreFiles %>',
                    '<%= pkgSystemFiles %>',
                    'spec/mocks/**/*.js'
                ],
                options: {
                    specs: ['spec/systems/**/*.js'],
                    helpers: 'spec/helpers/**/*.js',
                    vendor: ['<%= pkgVendores %>'],
                    outfile: 'spec/systems.html'
                }
            },
            options: {
                outfile: 'spec/spec.html'
            }
        },

        // Observe changes
        watch: {
            specCore: {
                files: [
                    '<%= pkgCoreFiles %>',
                    'spec/core/**/*.js',
                    'spec/helpers/**/*.js',
                    'spec/mocks/**/*.js'
                ],
                tasks: ['jasmine:core:build'],
                options: {
                    livereload: true,
                    atBegin: true
                }
            },
            specSystems: {
                files: [
                    '<%= pkgCoreFiles %>',
                    '<%= pkgSystemFiles %>',
                    'spec/systems/**/*.js',
                    'spec/helpers/**/*.js',
                    'spec/mocks/**/*.js'
                ],
                tasks: ['jasmine:systems:build'],
                options: {
                    livereload: true,
                    atBegin: true
                }
            }
        },

        // test server configuration
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: '.',
                    hostname: '*',
                    livereload: true
                }
            }
        }
    });

    // Register Taks
    // --------------------------

    // concatenate, minify and validate files
    grunt.registerTask('compile', ['jshint', 'concat', 'copy']);
    grunt.registerTask('build', ['clean:build', 'bower:install', 'compile', 'jasmine', 'uglify']);

    grunt.registerTask('specBase', ['bower:install', 'connect']);
    grunt.registerTask('spec', ['specBase', 'watch']);
    grunt.registerTask('spec:core', ['specBase', 'watch:specCore']);
    grunt.registerTask('spec:system', ['specBase', 'watch:specSystems']);
    grunt.registerTask('default', ['spec']);
};
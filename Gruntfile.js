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
            build: 'dist',
            lib: 'lib',
            spec: 'spec',
            docs: 'docs',
            examples: '<%= dirs.docs %>/examples'
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
            'lib/lodash/lodash.js'
        ],

        // Minify and Concat archives
        uglify: {
            options: {
                mangle: false,
                banner: '<%= banner %>'
            },
            dist: {
                files: {
                    '<%= dirs.build %>/<%= pkg.name %>.min.js': '<%= dirs.build %>/<%= pkg.name %>.js'
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
                dest: '<%= dirs.build %>/<%= pkg.name %>.js'
            }
        },

        copy: {
            copyToExamples: {
                src: '<%= dirs.build %>/<%= pkg.name %>.js',
                dest: '<%= dirs.examples %>/<%= pkg.name %>.js'
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
                src: ['<%= pkgCoreFiles %>', '<%= dirs.spec %>/mocks/**/*.js'],
                options: {
                    specs: ['<%= dirs.spec %>/core/**/*.js'],
                    helpers: '<%= dirs.spec %>/helpers/**/*.js',
                    vendor: ['<%= pkgVendores %>'],
                    outfile: '<%= dirs.spec %>/core.html',
                    keepRunner: true
                }
            },
            systems: {
                src: [
                    '<%= pkgCoreFiles %>',
                    '<%= pkgSystemFiles %>',
                    '<%= dirs.spec %>/mocks/**/*.js'
                ],
                options: {
                    specs: ['<%= dirs.spec %>/systems/**/*.js'],
                    helpers: '<%= dirs.spec %>/helpers/**/*.js',
                    vendor: ['<%= pkgVendores %>'],
                    outfile: '<%= dirs.spec %>/systems.html',
                    keepRunner: true
                }
            },
            options: {
                outfile: '<%= dirs.spec %>/spec.html'
            }
        },

        // Observe changes
        watch: {
            specCore: {
                files: [
                    '<%= pkgCoreFiles %>',
                    '<%= dirs.spec %>/core/**/*.js',
                    '<%= dirs.spec %>/helpers/**/*.js',
                    '<%= dirs.spec %>/mocks/**/*.js'
                ],
                tasks: ['jasmine:core:build', 'compile'],
                options: {
                    livereload: true,
                    atBegin: true
                }
            },
            specSystems: {
                files: [
                    '<%= pkgCoreFiles %>',
                    '<%= pkgSystemFiles %>',
                    '<%= dirs.spec %>/systems/**/*.js',
                    '<%= dirs.spec %>/helpers/**/*.js',
                    '<%= dirs.spec %>/mocks/**/*.js'
                ],
                tasks: ['jasmine:systems:build', 'compile'],
                options: {
                    livereload: true,
                    atBegin: true
                }
            },
            examples: {
                files: '<%= dirs.examples %>/**/**',
                tasks: '',
                options: {
                    livereload: true
                }
            }
        },

        // test server configuration
        connect: {
            server: {
                options: {
                    port: 9001,
                    // base: ['<%= dirs.examples %>', '<%= dirs.spec %>'],
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
    grunt.registerTask('compile', ['jshint', 'concat']);
    grunt.registerTask('build', ['clean:build', 'bower:install', 'compile', 'jasmine', 'uglify', 'copy:copyToExamples']);

    grunt.registerTask('specBase', ['bower:install', 'connect']);
    grunt.registerTask('spec', ['specBase', 'watch']);
    grunt.registerTask('spec:core', ['specBase', 'watch:specCore']);
    grunt.registerTask('spec:system', ['specBase', 'watch:specSystems']);
    grunt.registerTask('default', ['spec']);
};

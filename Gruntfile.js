"use strict";

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
   // grunt.loadNpmTasks('grunt-jasmine-runner');

  grunt.initConfig({

    // Define Directory
    dirs: {
      src:     "src",
      build:  "dist"
    },

    // Metadata
    pkg: grunt.file.readJSON("package.json"),
    banner:
    "\n" +
    "/*\n" +
     " * -------------------------------------------------------\n" +
     " * Project: <%= pkg.title %>\n" +
     " * Version: <%= pkg.version %>\n" +
     " *\n" +
     " * Author:  <%= pkg.author.name %>\n" +
     " * Site:     <%= pkg.author.url %>\n" +
     " * Contact: <%= pkg.author.email %>\n" +
     " *\n" +
     " *\n" +
     " * Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.author.name %>\n" +
     " * -------------------------------------------------------\n" +
     " */\n" +
     "\n",

    pkgFullName: "<%= pkg.name %>-v<%= pkg.version%>",
    pkgCoreFiles: ['src/util/**/*.js', 'src/core/core.js', 'src/core/system.js', 'src/core/entity.js'],
    pkgSystemFiles: ['src/systems/**/*.js'],
    pkgVendores: ["lib/performance/index.js", "lib/rAF/index.js", "lib/threejs/build/three.js", "lib/lodash/dist/lodash.js"],

    // Minify and Concat archives
    uglify: {
      options: {
        mangle: false,
        banner: "<%= banner %>"
      },
      dist: {
        files: {
          "<%= dirs.build %>/<%= pkgFullName %>.min.js": "<%= dirs.build %>/<%= pkgFullName %>.js"
        }
      }
    },

    // Notifications
    notify: {
      options: {
        title: "Javascript - <%= pkg.title %>",
        message: "Minified and validated with success!"
      }
    },

    // concat configuration
    concat: {
      options: {
        banner: "<%= banner %>"
      },
      target : {
        src: [           
            // engine core
            // --------------------------------------------
            "<%= pkgCoreFiles %>",

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
      beforeconcat: ['src/**/*.js'],
      // afterconcat: ['<%= dirs.build %>/<%= pkgFullName %>.js']
    },

    bower: {
      install: {
        options: {
          install: true,
          copy: false
        }
      }
    },

    // Observe changes
    watch: {
      debug: {
        files: ['src/**/*.js', 'spec/**/*.js'],
        tasks: ['compile', 'jasmine'],
        options: {
          interrupt: true,
          nospawn: true
        },
      },
    },

    // clean 
    clean: {
      debug: ["<%= dirs.build %>/<%= pkgFullName %>.js"],
      build: ["<%= dirs.build %>/"] 
    },

    // test server configuration
    connect: {
      server: {
        options: {
          port: 9001,
          base: "examples",
          hostname: "*"
        }
      }
    },

    jasmine: {
      core: {
        src: ["<%= pkgCoreFiles %>", "spec/mocks/engineCycle.js"],
        options: {
          specs: ['spec/core/**/*.js'],
          vendor: ["<%= pkgVendores %>"],
          keepRunner: true
        }
      },
      systems: {
        src: ["<%= pkgCoreFiles %>", "<%= pkgSystemFiles %>", "spec/mocks/**/*.js"],
        options: {
          specs: ['spec/systems/**/*.js'],
          helpers: 'spec/helpers/**/*.js',
          vendor: ["<%= pkgVendores %>"],
          keepRunner: true
        }
      }
    }
  });

  // Register Taks
  // --------------------------

  // concatenate, minify and validate files
  grunt.registerTask( "compile", [ "jshint", "concat", "copy" ]);
  grunt.registerTask( "debug", [ "clean:debug", "bower:install", "connect", "watch:debug" ]);
  grunt.registerTask( "build", [ "clean:build", "bower:install", "compile", "uglify" ]);
};
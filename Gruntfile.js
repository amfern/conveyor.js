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
            'src/core/core.js',
            'src/core/system.js',
            'src/core/entity.js',
            'src/core/interval.js', // interval between last loop(logic systems goes here): performance.now()
            'src/core/output-interval.js', // interval between and after logic system finished proccesing(output systems goes here): interval + performance.now()

            // engine output/input core systems
            // --------------------------------------------
            'src/systems/**/*.js',

            // basic output/input systems
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
      scripts: {
        files: ['src/**/*.js', 'lib/**/*.js'],
        tasks: ['compile'],
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
    }
  });


  // Register Taks
  // --------------------------

  // concatenate, minify and validate files
  grunt.registerTask( "compile", [ "jshint", "concat", "copy" ]);
  grunt.registerTask( "debug", [ "clean:debug", "bower:install", "compile", "connect", "watch" ]);
  grunt.registerTask( "build", [ "clean:build", "bower:install", "compile", "uglify" ]);
};
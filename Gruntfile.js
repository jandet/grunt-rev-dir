/*
 * grunt-rev
 * https://github.com/cbas/grunt-rev
 *
 * Copyright (c) 2013 Sebastiaan Deckers
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Work on a copy of the files because they will be renamed during testing.
    copy: {
      test: {
        expand: true,
        cwd: 'test/fixtures',
        src: ['**'],
        dest: 'tmp/',
      },
    },

    // Configuration to be run (and then tested).
    revdir: {
      default_options: {
        src: ['tmp/default/assets', 'tmp/default/images']
      },
      custom_options: {
        options: {
          algorithm: 'sha1',
          length: 4
        },
        src: ['tmp/custom/assets', 'tmp/custom/images']
      },
      exclusion_options: {
        options: {
          exclude: ['*.gif']
        },
        src: ['tmp/exclusion/assets', 'tmp/exclusion/images']
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'copy', 'revdir', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};

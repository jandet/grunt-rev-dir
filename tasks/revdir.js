/*
 * grunt-rev-dir
 * https://github.com/jander/grunt-rev-dir
 *
 * Copyright (c) 2014 Sebastiaan Deckers
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
  path = require('path'),
  crypto = require('crypto'),
  recursive = require('recursive-readdir');

module.exports = function(grunt) {

  grunt.registerMultiTask('revdir', 'Prefix static asset folder names with a content hash', function() {

    var options = this.options({
      encoding: 'utf8',
      algorithm: 'md5',
      length: 8,
      exclude: []
    });

    var revdir = grunt.revdir || {summary: {}};
    var done = this.async();
    var fileCount = 0;
    var files = this.filesSrc;

    files.forEach(function(dirpath) {
      var hash = crypto.createHash(options.algorithm);
      grunt.log.verbose.write('Hashing ' + dirpath + '...');

      recursive(dirpath, options.exclude, function(err, files) {
        files.forEach(function(f) {
          grunt.log.verbose.write('Hashing file ' + f + '...');
          hash.update(grunt.file.read(f, options.encoding));
        });

        var hashStr = hash.digest('hex'),
          prefix = hashStr.slice(0, options.length),
          renamed = [prefix, path.basename(dirpath)].join('-'),
          outPath = path.resolve(path.dirname(dirpath), renamed);

        if (grunt.file.exists(outPath)) {
          grunt.log.write('No content change ').error(outPath + ' already exists');
        } else {
          fs.renameSync(dirpath, outPath);
        }

        revdir.summary[dirpath] = outPath;
        grunt.log.write(dirpath + ' ').ok(renamed);

        fileCount++;
        if (fileCount === files.length) {
          grunt.revdir = revdir;
          done();
        }
      });
    });
  });
};

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

  grunt.registerMultiTask('rev_dir', 'Prefix static asset folder names with a content hash', function() {

    var options = this.options({
      encoding: 'utf8',
      algorithm: 'md5',
      length: 8,
      exclude: []
    });

    var done = this.async();

    this.filesSrc.forEach(function(dirpath) {
      var hash = crypto.createHash(options.algorithm);
      grunt.log.verbose.write('Hashing ' + dirpath + '...');

      recursive('testdir', [], function(err, files) {
        files.forEach(function(f) {
          hash.update(grunt.file.read(f, options.encoding));
        });

        var hashStr = hash.digest('hex'),
          prefix = hashStr.slice(0, options.length),
          renamed = [prefix, path.basename(dirpath)].join('-'),
          outPath = path.resolve(path.dirname(dirpath), renamed);

        grunt.verbose.ok().ok(hash);
        fs.renameSync(dirpath, outPath);
        grunt.log.write(dirpath + ' ').ok(renamed);

        done(renamed);
      });
    });
  });

};

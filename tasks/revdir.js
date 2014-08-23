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
      exclude: [],
      overwrite: true
    });

    var revdir = grunt.revdir || {summary: {}};
    var done = this.async();
    var fileCount = 0;
    var numFiles = this.filesSrc.length;

    this.files.forEach(function(fileObject) {
      fileObject.src.forEach(function(file) {
        var hash = crypto.createHash(options.algorithm),
            dirpath = file,
            destpath = fileObject.dest;

        grunt.log.verbose.write('Hashing ' + dirpath + '...').ok();

        recursive(dirpath, options.exclude, function(err, files) {
          files.forEach(function(f) {
            grunt.log.verbose.write('Hashing file ' + f + '...').ok();
            hash.update(grunt.file.read(f, options.encoding));
          });

          var hashStr = hash.digest('hex'),
            prefix = hashStr.slice(0, options.length),
            renamed = [prefix, path.basename(dirpath)].join('-'),
            outPath = path.resolve(path.dirname(dirpath), renamed);

          if (grunt.file.exists(outPath)) {
            grunt.log.write('No content change ').ok(outPath + ' already exists');
          } else if (options.overwrite && !destpath) {
            fs.renameSync(dirpath, outPath);
          } else {
            grunt.file.recurse(dirpath, function(abspath, rootdir, subdir, filename) {
              var dest = [destpath || path.dirname(dirpath), renamed, subdir, filename].join('/');
              grunt.file.copy(abspath, dest);
            });
          }

          var renamedPath = [destpath || path.dirname(dirpath), renamed].join('/');
          revdir.summary[dirpath] = renamedPath;
          grunt.log.write(dirpath + ' ').ok(renamedPath);

          fileCount++;
          if (fileCount === numFiles) {
            grunt.revdir = revdir;
            done();
          }
        });
      });
    });
  });
};

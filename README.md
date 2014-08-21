> Directory name revisioning through content hashing

## Getting Started
_If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide._

From the same directory as your project's [Gruntfile][Getting Started] and [package.json][], install this plugin with the following command:

```bash
npm install grunt-revdir --save-dev
```

Once that's done, add this line to your project's Gruntfile:

```js
grunt.loadNpmTasks('grunt-revdir');
```

If the plugin has been installed correctly, running `grunt --help` at the command line should list the newly-installed plugin's task or tasks. In addition, the plugin should be listed in package.json as a `devDependency`, which ensures that it will be installed whenever the `npm install` command is run.

[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/blob/devel/docs/getting_started.md
[package.json]: https://npmjs.org/doc/json.html

## The "revdir" task

Use the **revdir** task to prepend a revision hash to a directory name according to its contents (the contents of its containing files).

### Overview
In your project's Gruntfile, add a section named `revdir` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  revdir: {
    options: {
      encoding: 'utf8',
      algorithm: 'md5',
      length: 8,
      exclusions: ['*.gif']
    },
    assets: {
      files: [{
        src: [
          'img/',
          'fonts/'
        ]
      }]
    }
  },
})
```

### Options

#### options.encoding
Type: `String`
Default value: `'utf8'`

The encoding of the file contents.

#### options.algorithm
Type: `String`
Default value: `'md5'`

`algorithm` is dependent on the available algorithms supported by the version of OpenSSL on the platform. Examples are `'sha1'`, `'md5'`, `'sha256'`, `'sha512'`, etc. On recent releases, `openssl list-message-digest-algorithms` will display the available digest algorithms.

#### options.length
Type: `Number`
Default value: `8`

The number of characters of the file content hash to prefix the file name with.

#### options.exclude
Type: `Array`
Default value: `[]`

List of exclusions from md5 content hashing.

### Usage Example

#### Basic Asset Revving
This will rename `scripts` and `css` with an 8 character long hash prefix. For example `9becff3a-scripts` and `ae35dd05-css`. The hash value depends on the directory's containing file's contents.

```js
grunt.initConfig({
  rev: {
    files: {
      src: ['scripts', 'css']
    }
  }
})
```

#### Custom Options
Change the algorithm or length to style the generated asset file names.

```js
grunt.initConfig({
  rev: {
    options: {
      algorithm: 'sha1',
      length: 4
    },
    files: {
      src: ['scripts']
    }
  }
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][].

## Release History
_(Nothing yet)_

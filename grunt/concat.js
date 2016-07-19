module.exports = function (grunt) {
  var cwd = process.cwd();
  var modules = require(cwd + '/config.js');
  for (var i = 0, len = modules.length; i < len; ++i) {
    modules[i] = './src/' + modules[i] + '.js';
  }

  grunt.config('concat', {
    dist: {
      src: [
        './node_modules/promise-polyfills/promise.js', 
        './src/intro.js'
      ].concat(modules).concat(['./src/outro.js']),
      dest: 'dist/jambo.js'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
};

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('./package.json')
    });

    require('./grunt/concat')(grunt);
    require('./grunt/jshint')(grunt);
    require('./grunt/uglify')(grunt);
    require('./grunt/workflow')(grunt);

};

module.exports = function(grunt) {

    grunt.config('jshint', {
        beforeConcat: ['src/**/*.js', '!src/intro.js', '!src/outro.js'],
        afterConcat: ['dist/jambo.js']
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');

};

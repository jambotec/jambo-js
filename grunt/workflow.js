module.exports = function(grunt) {

    grunt.registerTask('build', [
        'jshint:beforeConcat', 
        'concat',         
        'uglify'
    ]);

};

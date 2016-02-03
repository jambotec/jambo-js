module.exports = function(grunt) {

    grunt.config('uglify', {
        dist: {
            files: {
                'dist/jambo.min.js': ['dist/jambo.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');

};

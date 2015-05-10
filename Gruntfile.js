module.exports = function (grunt) {

    grunt.initConfig({
            uglify: {
                target: {
                    files: {
                        'dist/tangCloud.min.js': ['dist/tangCloud.js']
                    }
                }
            }
        }
    );

    grunt.loadNpmTasks('grunt-contrib-uglify');
};

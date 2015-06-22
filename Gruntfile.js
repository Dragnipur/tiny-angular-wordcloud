module.exports = function (grunt) {

    grunt.registerTask('default', ['uglify']);

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

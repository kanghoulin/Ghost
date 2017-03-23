/* eslint-env node */
/* eslint-disable no-var, one-var, object-shorthand, prefer-template */

var moment         = require('moment')

module.exports = function(grunt) {

    // Find all of the task which start with `grunt-` and load them, rather than explicitly declaring them all
    require('matchdep').filterDev(['grunt-*', '!grunt-cli']).forEach(grunt.loadNpmTasks);

    grunt.initConfig({
		
        shell: {
            'npm-install': {
                command: 'npm install'
            },

            'bower-install': {
                command: 'bower install'
            },

			ember: {
                command: function (mode) {
                    switch (mode) {
                    case 'prod':
                        return 'npm run build -- --environment=production --silent';
                    case 'dev':
                        return 'npm run build';
                    }
                },
                options: {
                    execOptions: {
                        stdout: false
                    }
                }
            },
			
            options: {
                preferLocal: true
            }
        }
    });

    grunt.registerTask('init', 'Install the client dependencies',
        ['shell:npm-install', 'shell:bower-install']
    );
};

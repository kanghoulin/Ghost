/* eslint-disable */
/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app'),
    concat = require('broccoli-concat'),
    mergeTrees = require('broccoli-merge-trees'),
    uglify = require('broccoli-uglify-js'),
    cleanCSS = require('broccoli-clean-css'),
    environment = EmberApp.env(),
    isProduction = environment === 'production',
    mythCompress = isProduction || environment === 'test',
    disabled = {enabled: false},
    assetLocation, codemirrorAssets;

assetLocation = function (fileName) {
    if (isProduction) {
        fileName = fileName.replace('.', '.min.');
    }
    return '/assets/' + fileName;
};

codemirrorAssets = function () {
    var codemirrorFiles = [
        'lib/codemirror.css',
        'theme/xq-light.css',
        'lib/codemirror.js',
        'mode/htmlmixed/htmlmixed.js',
        'mode/xml/xml.js',
        'mode/css/css.js',
        'mode/javascript/javascript.js'
    ];

    if (environment === 'test') {
        return {import: codemirrorFiles};
    }

    return {
        public: {
            include: codemirrorFiles,
            destDir: '/',
            processTree: function (tree) {
                var jsTree = concat(tree, {
                    outputFile: 'assets/codemirror/codemirror.js',
                    headerFiles: ['lib/codemirror.js'],
                    inputFiles: ['mode/**/*'],
                    sourceMapConfig: {enabled: false}
                });

                var cssTree = concat(tree, {
                    outputFile: 'assets/codemirror/codemirror.css',
                    inputFiles: ['**/*.css']
                });

                if (isProduction) {
                    jsTree = uglify(jsTree);
                    cssTree = cleanCSS(cssTree);
                }

                return mergeTrees([jsTree, cssTree]);
            }
        }
    };
};

module.exports = function (defaults) {
    var app = new EmberApp(defaults, {
        babel: {
            optional: ['es6.spec.symbols'],
            includePolyfill: true
        },
        outputPaths: {
            app: {
                js: assetLocation('ghost-user.js')
            },
            vendor: {
                js:  assetLocation('vendor.js'),
                css: assetLocation('vendor.css')
            }
        },
        mythOptions: {
            source: './app/styles/app.css',
            inputFile: 'app.css',
            browsers: 'last 2 versions',
            // @TODO: enable sourcemaps for development without including them in the release
            sourcemap: false,
            compress: mythCompress,
            outputFile: isProduction ? 'ghost-user.min.css' : 'ghost-user.css'
        },
        fingerprint: disabled,
        nodeAssets: {
            'blueimp-md5': {
                import: ['js/md5.js']
            },
            codemirror: codemirrorAssets(),
            'jquery-deparam': {
                enabled: EmberApp.env() === 'test',
                import: ['jquery-deparam.js']
            },
            moment: {
                import: ['moment.js']
            },
            'moment-timezone': {
                import: ['builds/moment-timezone-with-data.js']
            },
            'password-generator': {
                import: ['lib/password-generator.js']
            }
        },
        'ember-cli-selectize': {
            theme: false
        }
    });

    // 'dem Scripts
    app.import('bower_components/validator-js/validator.js');
	app.import('bower_components/moment/moment.js');
	app.import('bower_components/moment-timezone/moment-timezone.js');



    if (app.env === 'test') {
        app.import(app.bowerDirectory + '/jquery.simulate.drag-sortable/jquery.simulate.drag-sortable.js', {type: 'test'});
    }

    return app.toTree();
};

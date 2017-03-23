/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'ghost-user',
    environment: environment,
    rootURL: '/',
    locationType: 'trailing-history',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
		Array: true,
                String: true,
                Function: true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
	  version: require('../package.json').version.match(/^(\d+\.)?(\d+)/)[0]
    },
	'ember-simple-auth': {
            authenticationRoute: 'sign-in', //登录不成功，转入登录页
			routeAfterAuthentication: '',  //登录成功后跳转到的页面
            routeIfAlreadyAuthenticated: 'blog'  //如果已经登录跳转到的页面
        },
		torii: {

        }
  };

  if (environment === 'development') {
	// ENV.APP.LOG_RESOLVER = true;
        ENV.APP.LOG_ACTIVE_GENERATION = true;
        ENV.APP.LOG_TRANSITIONS = true;
        ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
        ENV.APP.LOG_VIEW_LOOKUPS = true;
        // Enable mirage here in order to mock API endpoints during development
        ENV['ember-cli-mirage'] = {
            enabled: false
        };
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  return ENV;
};

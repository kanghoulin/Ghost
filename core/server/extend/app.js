var debug = require('debug')('ghost:admin'),
    config = require('../config'),
    express = require('express'),
    extendHbs = require('express-hbs').create(),

    // Admin only middleware
    redirectToSetup = require('../middleware/redirect-to-setup'),

    // Global/shared middleware?
    cacheControl = require('../middleware/cache-control'),
    checkSSL = require('../middleware/check-ssl'),
    errorHandler = require('../middleware//error-handler'),
    maintenance = require('../middleware/maintenance'),
    prettyURLs = require('../middleware//pretty-urls'),
    serveStatic = require('express').static,
    utils = require('../utils');

module.exports = function setupAdminApp() {
    debug('Admin setup start');
    var extendApp = express();

    // First determine whether we're serving admin or theme content
    // @TODO finish refactoring this away.
    extendApp.use(function setIsAdmin(req, res, next) {
        res.isAdmin = true;
        next();
    });

    // @TODO replace all this with serving ember's index.html
    // Create a hbs instance for admin and init view engine
    extendApp.set('view engine', 'hbs');
    extendApp.set('views', config.get('paths').extendViews);
    extendApp.engine('hbs', extendHbs.express3({}));
    // Register our `asset` helper
    extendHbs.registerHelper('asset', require('../helpers/asset'));

    // Admin assets
    // @TODO ensure this gets a local 404 error handler
    extendApp.use('/assets', serveStatic(
        config.get('paths').znextendAssets,
        {maxAge: utils.ONE_YEAR_MS, fallthrough: false}
    ));

    // Render error page in case of maintenance
    extendApp.use(maintenance);

    // Force SSL if required
    // must happen AFTER asset loading and BEFORE routing
    extendApp.use(checkSSL);

    // Add in all trailing slashes & remove uppercase
    // must happen AFTER asset loading and BEFORE routing
    extendApp.use(prettyURLs);

    // Cache headers go last before serving the request
    // Admin is currently set to not be cached at all
    extendApp.use(cacheControl('private'));
    // Special redirects for the admin (these should have their own cache-control headers)
    extendApp.use(redirectToSetup);

    // Finally, routing
    extendApp.get('*', require('./controller'));
    //extendApp.use(require('./routes')());

    extendApp.use(errorHandler.pageNotFound);
    extendApp.use(errorHandler.handleHTMLResponse);

    debug('Admin setup end');

    return extendApp;
};

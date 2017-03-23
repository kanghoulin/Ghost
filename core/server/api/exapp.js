// # API routes
var debug = require('debug')('extend:api'),
    express = require('express'),
    tmpdir = require('os').tmpdir,

    // This essentially provides the controllers for the routes
    api = require('../api'),

    // Include the middleware

    // API specific
    auth = require('../auth'),
    cors = require('../middleware/api/cors'),   // routes only?!
    brute = require('../middleware/brute'),  // routes only
    versionMatch = require('../middleware/api/version-match'), // global

    // Handling uploads & imports
    upload = require('multer')({dest: tmpdir()}), // routes only
    validation = require('../middleware/validation'), // routes only

    // Shared
    bodyParser = require('body-parser'), // global, shared
    cacheControl = require('../middleware/cache-control'), // global, shared
    checkSSL = require('../middleware/check-ssl'),
    prettyURLs = require('../middleware/pretty-urls'),
    maintenance = require('../middleware/maintenance'), // global, shared
    errorHandler = require('../middleware/error-handler'), // global, shared

    // Temporary
    // @TODO find a more appy way to do this!
    labs = require('../middleware/labs'),

    // @TODO find a better way to bundle these authentication packages
    // Authentication for public endpoints
    authenticatePublic = [
        auth.authenticate.authenticateClient,
        auth.authenticate.authenticateUser,
        auth.authorize.requiresAuthorizedUserPublicAPI,
        // @TODO do we really need this multiple times or should it be global?
        cors
    ],
    // Require user for private endpoints
    authenticatePrivate = [
        auth.authenticate.authenticateClient,
        auth.authenticate.authenticateUser,
        auth.authorize.requiresAuthorizedUser,
        // @TODO do we really need this multiple times or should it be global?
        cors
    ];

// @TODO refactor/clean this up - how do we want the routing to work long term?
function apiRoutes() {
    var apiRouter = express.Router();

    // alias delete with del
    apiRouter.del = apiRouter.delete;

    // ## Posts
    apiRouter.get('/posts', api.http(api.posts.unAuthBrowse));
	
	// ## Comments
	apiRouter.get('/comments', api.http(api.comments.browse));
	apiRouter.post('/comments', api.http(api.comments.add));
	apiRouter.get('/comments/:id', api.http(api.comments.read));
	apiRouter.put('/comments/:id', api.http(api.comments.edit));
	
	// ## Users
    apiRouter.get('/users/:id', authenticatePublic, api.http(api.users.read));

    // ## Notifications
    apiRouter.get('/notifications', authenticatePrivate, api.http(api.notifications.browse));
    apiRouter.post('/notifications', authenticatePrivate, api.http(api.notifications.add));
    apiRouter.del('/notifications/:id', authenticatePrivate, api.http(api.notifications.destroy));

    // ## Authentication
    apiRouter.post('/authentication/passwordreset',
        // Prevent more than 5 password resets from an ip in an hour for any email address
        brute.globalReset,
        // Prevent more than 5 password resets in an hour for an email+IP pair
        brute.userReset,
        api.http(api.authentication.generateResetToken)
    );
    apiRouter.put('/authentication/passwordreset', brute.globalBlock, api.http(api.authentication.resetPassword));
    apiRouter.post('/authentication/invitation', api.http(api.authentication.acceptInvitation));
    apiRouter.get('/authentication/invitation', api.http(api.authentication.isInvitation));
    apiRouter.post('/authentication/setup', api.http(api.authentication.setup));
    apiRouter.put('/authentication/setup', authenticatePrivate, api.http(api.authentication.updateSetup));
    apiRouter.get('/authentication/setup', api.http(api.authentication.isSetup));
    apiRouter.post('/authentication/token',
        brute.globalBlock,
        //brute.userLogin,
        auth.authenticate.authenticateClient,
        auth.oauth.generateAccessToken
    );
	apiRouter.post('/authentication/register', api.http(api.authentication.register));

    apiRouter.post('/authentication/revoke', authenticatePrivate, api.http(api.authentication.revoke));

    // ## Invites
    apiRouter.get('/invites', authenticatePrivate, api.http(api.invites.browse));
    apiRouter.get('/invites/:id', authenticatePrivate, api.http(api.invites.read));
    apiRouter.post('/invites', authenticatePrivate, api.http(api.invites.add));
    apiRouter.del('/invites/:id', authenticatePrivate, api.http(api.invites.destroy));

    return apiRouter;
}

module.exports = function setupApiApp() {
    debug('API setup start');
    var apiApp = express();

    // @TODO finish refactoring this away.
    apiApp.use(function setIsAdmin(req, res, next) {
        // Api === isAdmin for the purposes of the forceAdminSSL config option.
        res.isAdmin = true;
        next();
    });

    // API middleware

    // Body parsing
    apiApp.use(bodyParser.json({limit: '1mb'}));
    apiApp.use(bodyParser.urlencoded({extended: true, limit: '1mb'}));

    // send 503 json response in case of maintenance
    apiApp.use(maintenance);

    // Force SSL if required
    // must happen AFTER asset loading and BEFORE routing
    apiApp.use(checkSSL);

    // Add in all trailing slashes & remove uppercase
    // must happen AFTER asset loading and BEFORE routing
    apiApp.use(prettyURLs);

    // Check version matches for API requests, depends on res.locals.safeVersion being set
    // Therefore must come after themeHandler.ghostLocals, for now
    apiApp.use(versionMatch);

    // API shouldn't be cached
    apiApp.use(cacheControl('private'));

    // Routing
    apiApp.use(apiRoutes());

    // API error handling
    apiApp.use(errorHandler.resourceNotFound);
    apiApp.use(errorHandler.handleJSONResponse);

    debug('API setup end');

    return apiApp;
};

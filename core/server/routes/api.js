// # API routes
var express     = require('express'),
    api         = require('../api'),
    apiRoutes;

apiRoutes = function apiRoutes(middleware) {
    var router = express.Router();
        // Authentication for public endpoints
        // authenticatePublic = [
        //     middleware.api.authenticateClient,
        //     middleware.api.authenticateUser,
        //     middleware.api.requiresAuthorizedUserPublicAPI,
        //     middleware.api.cors
        // ]
        // // Require user for private endpoints
        // authenticatePrivate = [
        //     middleware.api.authenticateClient,
        //     middleware.api.authenticateUser,
        //     middleware.api.requiresAuthorizedUser,
        //     middleware.api.cors
        // ];
        authenticateAdmin = [
            middleware.auth.verifyToken,
            middleware.api.requiresAdminUser
        ];
        authenticatePrivate = [
            middleware.auth.verifyToken
        ];

    // alias delete with del
    router.del = router.delete;

    // Check version matches for API requests, depends on res.locals.safeVersion being set
    // Therefore must come after themeHandler.ghostLocals, for now
    // router.use(middleware.api.versionMatch);

    // ## CORS pre-flight check
    // router.options('*', middleware.api.cors);
    
    router.get('/discover', authenticateAdmin, api.http(api.discover.browse));

    // ## Users
    // router.get('/users', authenticatePublic, api.http(api.users.browse));
    router.get('/users', authenticateAdmin, api.http(api.users.browse));
    router.post('/users', authenticateAdmin, api.http(api.users.add));
    router.get('/users/:id', authenticateAdmin, api.http(api.users.read));
    // router.put('/users/:id', middleware.auth.verifyToken, api.http(api.users.edit));


    // ## Authentication
    router.put('/auth/token', api.http(api.auth.genToken));
    router.post('/auth/signup', api.http(api.auth.signupUser));

    // ## Authentication
    // router.post('/authentication/passwordreset',
    //     middleware.spamPrevention.forgotten,
    //     api.http(api.authentication.generateResetToken)
    // );
    // router.put('/authentication/passwordreset', api.http(api.authentication.resetPassword));
    // router.post('/authentication/invitation', api.http(api.authentication.acceptInvitation));
    // router.get('/authentication/invitation', api.http(api.authentication.isInvitation));
    // router.post('/authentication/setup', api.http(api.authentication.setup));
    // router.put('/authentication/setup', authenticatePrivate, api.http(api.authentication.updateSetup));
    // router.get('/authentication/setup', api.http(api.authentication.isSetup));
    // router.post('/authentication/token',
    //     middleware.spamPrevention.signin,
    //     middleware.api.authenticateClient,
    //     middleware.oauth.generateAccessToken
    // );
    // router.post('/authentication/revoke', authenticatePrivate, api.http(api.authentication.revoke));

    // API Router middleware
    router.use(middleware.api.errorHandler);

    return router;
};

module.exports = apiRoutes;

var bodyParser      = require('body-parser'),
    express         = require('express'),
    path            = require('path'),
    cors            = require('cors'),
    helmet          = require('helmet'),
    cookieParser    = require('cookie-parser'),
    config 			= require('../config'),
    models          = require('../models'),
    routes          = require('../routes'),
    errors 			= require('../errors'),
    auth            = require('./auth'),
    checkSSL        = require('./check-ssl'),
    utils           = require('../utils'),

    middleware,
    setupMiddleware;

setupMiddleware = function setupMiddleware(app) {
    middleware = {
        auth: auth,
        api: {
            // forceApiSubdomain: 
            errorHandler: errors.handleAPIError,
            requiresAdminUser: auth.requiresAdminUser
        },
        oauth2: {
            cors:cors
        }
    };
	
    app.use(helmet())
	app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    app.use(cookieParser());
    
    // console.log('middleware');
    
    app.use((req, res, next) => { console.log(req.url); next()})

    // console.log(config.corePath + '/client/build/');
    // console.log(path.join(config.corePath, 'client', 'build', 'index.html'));
    // console.log(path.join(__dirname, 'build', 'index.html'));

    // app.use(express.static(config.corePath))
    // app.use(express.static(config.corePath + '/client/build/');

    // app.use('/', express.static(config.corePath + '/client/build/'));
    app.use(express.static(path.join(config.corePath, 'client', 'build')));
    
    // app.enable('trust proxy');
    // app.use(checkSSL);


    // ### Routing
    // Set up API routes

    app.use(routes.apiBaseUri, routes.api(middleware));

    app.get('/*', function (req, res) {
        console.log('in default route');
        res.sendFile(path.join(config.corePath, 'client', 'build', 'index.html'));
    });

    // catch 404 and forward to error handler
	app.use(errors.error404);
};

module.exports = setupMiddleware;
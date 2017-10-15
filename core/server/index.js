var express     = require('express'),
    // api         = require('./api'),
    middleware  = require('./middleware'),
    AppServer 	= require('./app-server');

function init(options) {
    var appServer = null;

    // ### Initialisation
    // The server and its dependencies require a populated config
    // It returns a promise that is resolved when the application
    // has finished starting up.

    // Get reference to an express app instance.

    return new Promise( resolve => {
	    var parentApp = express();

	    // ## Middleware and Routing
	    middleware(parentApp);

	    appServer = new AppServer(parentApp);
		resolve(appServer);
    });
}

module.exports = init;
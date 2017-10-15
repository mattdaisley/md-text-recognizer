// # Node Server Starter
// Handles the creation of an HTTP Server
var fs      = require('fs')
    config  = require('./config');

/**
 * ## AppServer
 * @constructor
 * @param {Object} rootApp - parent express instance
 */
function AppServer(rootApp) {
    this.rootApp = rootApp;
    this.httpServer = null;

    // Expose config module for use externally.
    this.config = config;
}

/**
 * ## Public API methods
 *
 * ### Start
 * Starts the ghost server listening on the configured port.
 * Alternatively you can pass in your own express instance and let Ghost
 * start listening for you.
 * @param  {Object} externalApp - Optional express app instance.
 * @return {Promise} Resolves once Ghost has started
 */
AppServer.prototype.start = (externalApp) => {
    var self = this,
        rootApp = externalApp ? externalApp : self.rootApp;

    return new Promise( resolve => {
        // self.httpServer = rootApp.listen(
        //     config.web.port,
        //     config.web.host
        // );
        self.httpServer = rootApp.listen(
            config.web.port
        );

        self.httpServer.on('error', error => {
            if (error.errno === 'EADDRINUSE') {
                console.log(error);
            } else {
                console.log(error)
            }
            process.exit(-1);
        });
    });
};

/**
 * ### Stop
 * Returns a promise that will be fulfilled when the server stops. If the server has not been started,
 * the promise will be fulfilled immediately
 * @returns {Promise} Resolves once the server has stopped
 */
AppServer.prototype.stop = () => {
    var self = this;

    return new Promise( resolve => {
        if (self.httpServer === null) {
            resolve(self);
        } else {
            self.httpServer.close( () => {
                self.httpServer = null;
                resolve(self);
            });
        }
    });
};

/**
 * ### Restart
 * Restarts the application
 * @returns {Promise} Resolves once the server has restarted
 */
AppServer.prototype.restart = () => {
    return this.stop().then(this.start.bind(this));
};

module.exports = AppServer;

// # Ghost Data API
// Provides access from anywhere to the Ghost data layer.
//
// Ghost's JSON API is integral to the workings of Ghost, regardless of whether you want to access data internally,
// from a theme, an app, or from an external app, you'll use the Ghost JSON API to do so.

var _              = require('lodash'),
    users          = require('./users'),
    auth           = require('./auth'),
    discover       = require('./discover'),

    http;

/**
 * ### HTTP
 *
 * Decorator for API functions which are called via an HTTP request. Takes the API method and wraps it so that it gets
 * data from the request and returns a sensible JSON response.
 *
 * @public
 * @param {Function} apiMethod API method to call
 * @return {Function} middleware format function to be called by the route when a matching request is made
 */
http = function http(apiMethod) {
    return function apiHandler(req, res, next) {
        // console.log(req);
        var ip = req.headers['x-forwarded-for'] || 
            req.connection.remoteAddress || 
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        var object = req.body, 
            options = { query: req.query, params: req.params, context: req.decoded, ip: ip};

        // If this is a GET, or a DELETE, req.body should be null, so we only have options (route and query params)
        // If this is a PUT, POST, or PATCH, req.body is an object
        if (_.isEmpty(object)) {
            object = options;
            options = {};
        }

        return apiMethod(object, options).then( response => {
            if (req.method === 'DELETE') {
                return res.status(204).end();
            }
            // Keep CSV header and formatting
            if (res.get('Content-Type') && res.get('Content-Type').indexOf('text/csv') === 0) {
                return res.status(200).send(response);
            }
            // Send a properly formatting HTTP response containing the data with correct headers
            res.json(response || {});
        }).catch( error => {
            // To be handled by the API middleware
            console.log(error);
            next(error);
        });
    };
};

/**
 * ## Public API
 */
module.exports = {
    // Extras
    http: http,
    users: users,
    auth: auth,
    discover: discover
};

/**
 * ## API Methods
 *
 * Most API methods follow the BREAD pattern, although not all BREAD methods are available for all resources.
 * Most API methods have a similar signature, they either take just `options`, or both `object` and `options`.
 * For RESTful resources `object` is always a model object of the correct type in the form `name: [{object}]`
 * `options` is an object with several named properties, the possibilities are listed for each method.
 *
 * Read / Edit / Destroy routes expect some sort of identifier (id / slug / key) for which object they are handling
 *
 * All API methods take a context object as one of the options:
 *
 * @typedef context
 * Context provides information for determining permissions. Usually a user, but sometimes an app, or the internal flag
 * @param {Number} user (optional)
 * @param {String} app (optional)
 * @param {Boolean} internal (optional)
 */

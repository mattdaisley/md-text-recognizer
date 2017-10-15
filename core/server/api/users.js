// # Users API
// RESTful API for the User resource
var 
    docName         = 'users',
    DB              = require('../db'),
    config          = require('../config'),
    models          = require('../models'),
    errors          = require('../errors'),
    utils           = require('../utils'),
    users;
    
/**
 * ### Users API Methods
 *
 * **See:** [API Methods](index.js.html#api%20methods)
 */

users = {
    /**
     * ## Browse
     * Fetch all users
     * @param {{context}} options (optional)
     * @returns {Promise<Users>} Users Collection
     */
    browse: function browse(options) {

        function doQuery(options) {
            return models.user.findPage(options);
        }

        return new Promise( (resolve, reject) => {
            doQuery(options)
                .then( result => {
                    resolve( {users: result, next_page: utils.nextPageLink(options, docName) } );
                })
                .catch( err => {
                    // some other error occurred
                    reject(err);
                });
        });
    },

    read: function read(options) {
        // Special handling for id = 'me'
        if (options.params.id === 'me' && options.context && options.context.id) {
            options.params.id = options.context.id;
        }

        function doQuery(options) {
            return models.user.findOne(options.params.id);
        }

        return new Promise( (resolve, reject) => {
            doQuery(options)
                .then( result => {
                    if ( result ) {
                        // success, a user was found
                        resolve( {users: [result]} );
                    } else {
                        // fail, no user found
                        reject(new errors.NotFoundError('User Not Found'));
                    }

                })
                .catch( err => {
                    // some other error occurred
                    reject(err);
                });
        });
    },

    add: function add(object, options) {
        function validateInput(data) {
            if ( !data.email ) return false;
            if ( !data.password ) return false;
            return true;
        }

        function doQuery() {
            return models.user.addOne(object);
        }

        return new Promise( (resolve, reject) => {
            if ( !validateInput(object) ) {
                reject(new errors.BadRequestError('There was an error with the data you provided.'));
                return;
            };

            doQuery()
                .then( result => {
                    if ( result ) {
                        // success, a user was found
                        resolve( {users: [result]} );
                    } else {
                        // fail, no user created. something wrong happened
                        reject(new errors.InternalServerError('An error occurred with your request.'));
                    }
                })
                .catch( err => {
                    // some other error occurred
                    reject(err);
                });
        });
    }

};

module.exports = users;

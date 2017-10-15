// # Discover API
// RESTful API for the User resource
var 
    docName         = 'discover',
    fs              = require('fs'),
    config          = require('../config'),
    discover;
                
/**
 * ### Users API Methods
 *
 * **See:** [API Methods](index.js.html#api%20methods)
 */
discover = {
    /**
     * ## Browse
     * @param {{context}} options (optional)
     * @returns {Promise<Object>} JSON Object of API Map
     */
    browse: function browse(object) {

        return new Promise( resolve => {

            fs.readFile(config.corePath + '/server/models/discover.json', 'utf8',  (err, data) => {
                console.log(err);
                resolve( { 'paths': JSON.parse(data) });
            });

        });
    }

};

module.exports = discover;

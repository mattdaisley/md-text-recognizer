var api         = require('./api');
var config		= require('../config');

module.exports = {
    api: api,
    apiBaseUri: config.apiBaseUri
};

var config = require('../config'),
    url    = require('url'),
    checkSSL;

function isSSLrequired(configUrl) {
    var forceSSL = url.parse(configUrl).protocol === 'https:' ? true : false;
    return forceSSL;
}

// Check to see if we should use SSL
// and throw error if needed
checkSSL = function checkSSL(req, res, next) {
    if (isSSLrequired(config.appUrl)) {
        if (!req.secure) {
            return res.sendStatus(403);
        }
    }
    next();
};

module.exports = checkSSL;

var 
    jwt         = require('jsonwebtoken'),
    config      = require('../config'),
    errors      = require('../errors'),

    auth;

auth = {
    
    // ### Authenticate Client Middleware
    verifyToken: function verifyToken(req, res, next) {

        if (!req.headers['x-access-token']) {
            // error token not provided
            return res.json({success: false, message: 'No auth token provided'});
        }

        jwt.verify(req.headers['x-access-token'], config.jwtSecret, 
            function verify(err, decoded) {     
                if (err) {
                    return next(new errors.NotAuthorizedError('There was an authorizing the provided token.'));
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    return next();
                }
            }
        );
    },

    verifySocketToken: function verifySocketToken(socket, next) {
        if ( !socket.request._query ) { socket.disconnect(); return; }

        var token = socket.request._query.token;
        jwt.verify(token, config.jwtSecret, 
            function verify(err, decoded) {      
                if (err) {
                    socket.disconnect();
                    next(err);  
                } else {
                    socket.decoded = decoded;
                    // if everything is good, save to request for use in other routes
                    next();
                }
            }
        );
    },

    requiresAdminUser: function requiresAdminUser(req, res, next) {
        var permissions = req.decoded.permissions.split(','),
            pass = false;

        permissions.forEach( perm => {
            if ( perm === 'admin' ) { pass = true; }
        });
        if ( pass ) return next();
        return res.json({ success: false, message: 'You do not have permission to access this information.' });   
    }
};

module.exports = auth;

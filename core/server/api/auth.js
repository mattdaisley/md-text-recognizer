// # Users API
// RESTful API for the User resource
var 
    docName        = 'auth',
    bcrypt         = require('bcryptjs'),
    config         = require('../config'),
    models         = require('../models'),
    auth;
                
/**
 * ### Users API Methods
 *
 * **See:** [API Methods](index.js.html#api%20methods)
 */
auth = {
    /**
     * ## Browse
     * Fetch all users
     * @param {{context}} options (optional)
     * @returns {Promise<Users>} Users Collection
     */
    genToken: function genToken(object) {

        return new Promise( (resolve, reject) => {
            if ( !object.password || object.password.length < 1 ) { resolve( { success:false, response:'please provide a password' } ); return; }
            if ( !object.email || object.email.length < 1 ) { resolve( { success:false, response:'please provide an email' } ); return; }

            models.user.findOneByEmail(object.email).then( result => {
                if ( !result ) { 
                    resolve( { success:false, response:'password or email does not match' } ); 
                    return; 
                }
                var user = result;
                return models.user.verifyPassword(object, user);
            })
            .then( result => {
                if ( result ) {
                    return models.user.signToken(result);
                } else {
                    resolve({success:false,response:'password or email does not match'});
                }
            })
            .then( result => {
                delete result.user.password;
                resolve( { success: true, token: result.token, user: result.user } );
            })
            .catch( err => {
                reject(err);
            })
        });
    }, 

    signupUser: function signupUser(object) {

        return new Promise( (resolve, reject) => {
            if ( !object.password || object.password.length < 1 ) { resolve( { success:false, response:'please provide a password' } ); return; }
            if ( !object.email || object.email.length < 1 ) { resolve( { success:false, response:'please provide an email' } ); return; }

            models.user.addOne(object)
                .then( result => {
                    if ( result ) {
                        resolve( { success:true, users: [result] } );
                    }
                })
                .catch( err => {
                    reject(err);
                })

        });
    }

};

module.exports = auth;

// # Users API
// RESTful API for the User resource
var 
    docName         = 'users',
    DB              = require('../db'),
    config          = require('../config'),
    jwt             = require('jsonwebtoken'),
    bcrypt          = require('bcryptjs'),
    errors          = require('../errors'),
    utils           = require('../utils'),
    knex            = require('knex')({client: 'mysql'}),
    users;
    
/**
 * ### Users API Methods
 *
 * **See:** [API Methods](index.js.html#api%20methods)
 */
users = {

    findAll: function findAll() {
        return new Promise( resolve => {
            DB.connect( connection => {
                var query = knex(config.db.tablePrefix + 'users')
                    .select();

                connection.query( query.toString(), (err, users) => {
                    connection.release();
                    if ( err ) { reject(err); return; }
                    resolve(users);
                });

            });
        });
        
    },

    findPage: function findPage(options) {
        
        return new Promise( resolve => {
            DB.connect( connection => {

                var query = knex(config.db.tablePrefix + 'users')
                    .select()
                    .limit( utils.getPageLimit(options) )
                    .offset( utils.getPageOffset(options) );

                connection.query( query.toString(), (err, users) => {
                    connection.release();
                    if ( err ) { reject(err); return; }
                    resolve(users);
                });

            });
        });
        
    },

    findOne: function findOne(id) {
        return new Promise( (resolve, reject) => {
            DB.connect( connection => {
                var query = knex(config.db.tablePrefix + 'users')
                    .select()
                    .where('id', parseInt(id))
                    .limit(1);

                connection.query( query.toString(), (err, users) => {
                    connection.release();
                    if ( err ) { reject(err); return; }

                    resolve(users[0]);
                });

            });
        });
        
    },

    findOneByEmail: function findOneByEmail(email) {
        return new Promise( resolve => {
            DB.connect( connection => {
                var query = knex(config.db.tablePrefix + 'users')
                    .select()
                    .where('email', email)
                    .limit(1);

                connection.query( query.toString(), (err, users) => {
                    connection.release();
                    if ( err ) { reject(err); return; }

                    resolve(users[0]);
                });
            });
        });
    },

    addOne: function addOne(object) {
        var self = this;
        return self.findOneByEmail(object.email)
            .then(function userFound(user) {
                if ( !user ) {
                    return self.genPassword(object.password);
                }
                // already exists error
                return new Promise( (resolve, reject) => {
                    reject(new errors.BadRequestError('A user with this email address already exists.'));
                });
            })
            .then(function passwordCreated(password) {
                if ( !object.name ) object.name = object.email;
                object.password = password;
                return new Promise( resolve => {
                    DB.connect( connection => {

                        connection.query( 'INSERT INTO ' + config.db.tablePrefix + 'users (email, password, name) VALUES (?,?,?)', [object.email, object.password, object.name], (err, users) => {
                            connection.release();
                            if ( err ) { reject(err); return; }

                            resolve(users[0]);
                        });
                    });
                });
            })
            .then(function userCreated() {
                return self.findOneByEmail(object.email);
            })
        
    },

    genPassword: function genPassword(password) {
        return new Promise( resolve => {
            bcrypt.genSalt(10, (err, salt) => {
                if ( err ) { reject(err); return; }

                bcrypt.hash(password, salt, (err, hash) => {
                    if ( err ) { reject(err); return; }
                    resolve(hash);
                });
            });
        });
    },

    verifyPassword: function verifyPassword(object, user) {
        return new Promise( (resolve, reject) => {
            bcrypt.compare(object.password, user.password, (err, isMatch) => {
                if ( err ) {
                    reject(err);
                    return;
                }
                if ( isMatch ) {
                    resolve(user);
                } else {
                    resolve(false);
                }
            });
        });
    },

    signToken: function signToken(user) {
        return new Promise( resolve => {
            var claims = {
                id: user.id,
                iss: config.appUrl,
                permissions: user.permissions
            }

            jwt.sign(claims, config.jwtSecret, {expiresIn: 3600}, (err, token) => {
                resolve({user: user, token: token});
            });
        });
    }

};

// make sure all methods can be called by eachother
[
    'findAll',
    'findOne',
    'findOneByEmail',
    'addOne',
    'genPassword',
    'verifyPassword',
    'signToken'
].forEach( funcName => {
    users[funcName] = users[funcName].bind(users);
});

module.exports = users;

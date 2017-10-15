var 
    path                       = require('path'),
    NotFoundError              = require('./not-found-error'),
    BadRequestError            = require('./bad-request-error'),
    InternalServerError        = require('./internal-server-error'),
    NotAuthorizedError         = require('./not-authorized-error'),
    errorMethods,
    errors;


function isValidErrorStatus(status) {
    return status > 0 && status >= 400 && status < 600;
}

function getStatusCode(error) {
    if (error.statusCode) {
        return error.statusCode;
    }

    if (error.status && isValidErrorStatus(error.status)) {
        error.statusCode = error.status;
        return error.statusCode;
    }

    if (error.code && isValidErrorStatus(error.code)) {
        error.statusCode = error.code;
        return error.statusCode;
    }

    error.statusCode = 500;
    return error.statusCode;
}

errors = {

    // ## Reject Error
    // Used to pass through promise errors when we want to handle them at a later time
    rejectError: err => {
        return Promise.reject(err);
    },

    logError: (err, context, help) => {
        var self = this;
        console.log(err);
        console.error.apply(console, err);
    },

    /**
     * ### Format HTTP Errors
     * Converts the error response from the API into a format which can be returned over HTTP
     *
     * @private
     * @param {Array} error
     * @return {{errors: Array, statusCode: number}}
     */
    formatHttpErrors: function formatHttpErrors(error) {
        var statusCode = 500,
            errors = [];

        statusCode = getStatusCode(error);
        // todo: handle many errors

        return {errors: error.message, statusCode: statusCode};
    },

    handleAPIError: function errorHandler(err, req, res, next) {
        /*jshint unused:false */
        var httpErrors = this.formatHttpErrors(err);
        this.logError(err);
        // Send a properly formatted HTTP response containing the errors
        res.status(httpErrors.statusCode).json({errors: httpErrors.errors});
    },

    error404: function (req, res, next) {
    	var message = 'page not found';

        // do not cache 404 error
        res.set({'Cache-Control': 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'});
        res.status(404).send(message);
    }
};

// make sure all methods can be called by eachother
[
	'logError',
	'handleAPIError',
	'formatHttpErrors',
	'error404'
].forEach(funcName => {
    errors[funcName] = errors[funcName].bind(errors);
});

module.exports                 				= errors;
module.exports.NotFoundError            	= NotFoundError;
module.exports.BadRequestError            	= BadRequestError;
module.exports.InternalServerError          = InternalServerError;
module.exports.NotAuthorizedError           = NotAuthorizedError;
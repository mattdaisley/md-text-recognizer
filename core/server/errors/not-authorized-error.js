// # Internal Server Error
// Custom error class with status code and type prefilled.

function NotAuthorizedError(message) {
    this.message = message;
    this.stack = new Error().stack;
    this.statusCode = 401;
    this.errorType = this.name;
}

NotAuthorizedError.prototype = Object.create(Error.prototype);
NotAuthorizedError.prototype.name = 'NotAuthorizedError';

module.exports = NotAuthorizedError;

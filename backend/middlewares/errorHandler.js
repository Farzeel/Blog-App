const {ValidationError} = require('joi');

const errorHandler = (err, req, res, next) => {
    // Default error handler
    let status = 500;
    let data = {
        message: 'Internal Server Error'
    };
    
    // VALIDATION ERROR
    if (err instanceof ValidationError) {
        status = 400;
        data.message = err.message;
        return res.status(status).json(data);
    } 

    // Status error
    if (err.status) {
        status = err.status;
    }

    // message error
    if (err.message) {
        data.message = err.message;
    }
    
    return res.status(status).json(data);
}

module.exports = errorHandler;
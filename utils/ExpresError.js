// thow different messages accroding to error occure

class ExpressError extends Error{
    constructor(statusCode, message){
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}
module.exports = ExpressError;
const STATUS_CODES = {
    OK: 200,
    BAD_REQUEST: 400,
    UN_AUTHORISED: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
}

class baseError extends Error{
    constructor(name,STATUS_CODES,description){
        super(description);
        Object.setPrototypeOf(this,new.target.prototype)
        this.name = name;
        this.STATUS_CODES = STATUS_CODES;
        Error.captureStackTrace(this);
    }
}
//internal error (API)
class internalError extends baseError{
    constructor (description = "api error"){
        super("api error", STATUS_CODES.INTERNAL_ERROR,description)
    }
}
//400 validation error
class validationError extends baseError{
    constructor (description = "bad request"){
        super("bad request", STATUS_CODES.BAD_REQUEST,description)
    }
}
// 403 authorzie error
class authorizeError extends baseError{
    constructor (description = "access denied"){
        super("access denied", STATUS_CODES.UN_AUTHORISED,description)
    }
}

class notfoundError extends baseError{
    constructor (description = "not found"){
        super("not found", STATUS_CODES.NOT_FOUND,description)
    }
}
module.exports ={
    internalError,
    validationError,
    authorizeError,
    notfoundError
}

class CatchError extends Error{
    constructor(msg, code) {
        super();
        this.msg = msg;
        this.code = code;
    }
}

module.exports = CatchError;